/* jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/* global define, $, brackets, window, Mustache */

define(function (require, exports, module) {
  
  var DEFAULT_HOSTNAME = 'https://quiet-shelf-57463.herokuapp.com'
  var MAX_FORWARDING_SIZE = 5*1000*1000 // max 5mb for non-p2p (validated by server)
  var FILE_BLACKLIST = ['node_modules', '.DS_Store', '.git'] // blacklist for paths that will not be requested
  
  var AppInit = brackets.getModule('utils/AppInit')
  var PreferencesManager = brackets.getModule('preferences/PreferencesManager')
  var EditorManager = brackets.getModule('editor/EditorManager')
  var DocumentManager = brackets.getModule('document/DocumentManager')
  var ProjectManager = brackets.getModule('project/ProjectManager')
  var FileSystem = brackets.getModule('filesystem/FileSystem')
  var FileUtils = brackets.getModule('file/FileUtils')
  var Dialogs = brackets.getModule('widgets/Dialogs')
  var ExtensionUtils = brackets.getModule('utils/ExtensionUtils')
  var Mustache = brackets.getModule("thirdparty/mustache/mustache") 
        
  var prefs = PreferencesManager.getExtensionPrefs('multihack-brackets')

  var RemoteManager = require('./lib/npm/multihack-core')
  var PeerGraph = require('./lib/npm/p2p-graph')
  var Voice = require('./lib/voice')

  var remote = null
  var isSyncing = false
  var isInCall = false
  var currentEditor = null
  var editorMutexLock = false
  var projectBasePath = null
  var documentRelativePath = null
  var changeQueue = {}
  var nickname = null
  var knownDocs = {}
  var room
  
  ExtensionUtils.loadStyleSheet(module, 'widget/css/main.css')
  
  var buttonHTML = require('text!./widget/html/button.html')
  var modalHTML = require('text!./widget/html/modal.html')
  var optionsHTML = require('text!./widget/html/optionmodal.html')
  
  $('#main-toolbar .buttons').append(buttonHTML)
  
  var button = document.querySelector('#edc-multihack-btn')
  
  button.addEventListener('click', function () {
    if (isSyncing) {
      handleClick()
    } else {
      handleStart()
    }
  })

  var inited = false // Brackets sometimes tries to init multiple times
  function init () {
    if (inited) return
    inited = true
    setupPreferences()
    setupEventListeners()
  }

  function setupPreferences () {
    prefs.definePreference('hostname', 'string', DEFAULT_HOSTNAME)
    prefs.save()
  }

  function setupEventListeners () {
    projectBasePath = ProjectManager.getProjectRoot().fullPath
    ProjectManager.on('projectOpen', handleStop) // Stop sync on project open
    EditorManager.on('activeEditorChange', handleEditorChange)
    DocumentManager.on('pathDeleted', handleLocalDeleteFile)
    FileSystem.on('rename', handleLocalRename)
  }
  
  function handleVoiceJoin () {    
    if (!remote.voice) return
    remote.voice.join()
    // success listener is set in handleStart
  }
  
  
  function handleVoiceLeave () {
    if (!remote.voice) return
    remote.voice.leave()
    isInCall = false
    button.className = 'active'
  }

  function handleStart () {
    Dialogs.showModalDialog(
      '', 
      'Multihack', 
      modalHTML, 
      [customButton('Join Room', true), customButton('Cancel')]
    )
    var roomInput = document.querySelector('#multihack-room')
    roomInput.value = Math.random().toString(36).substr(2, 20)
    roomInput.select()
    
    var nicknameInput = document.querySelector('#multihack-nickname')
    
    document.querySelector('[data-button-id="multihack-button-JoinRoom"]').addEventListener('click', function () {
      
      room = roomInput.value
      if (!room) return
      nickname = nicknameInput.value || 'Guest'
      
      projectBasePath = ProjectManager.getProjectRoot().fullPath
      remote = new RemoteManager({
        hostname: 'http://localhost:6011', // TODO: prefs.get('hostname'), 
        room: room, 
        nickname: nickname,
        wrtc: null,
        voice: Voice
      })
      remote.posFromIndex = function (filePath, index, cb) {
        if (fromWebPath(filePath) === documentRelativePath) {
          cb(currentEditor._codeMirror.posFromIndex(index))
        } else {
          var absPath = projectBasePath+fromWebPath(filePath)
          DocumentManager.getDocumentForPath(absPath).then(function (doc) {
            doc._ensureMasterEditor()
            cb(doc._masterEditor._codeMirror.posFromIndex(index))
          })
        }
      }
      
      if (remote.voice) {
        remote.voice.on('join', function () {
          button.className = 'active voice'
          isInCall = true
        })
      }
      
      remote.once('ready', function () {
        provideProject()
      })

      remote.on('changeFile', handleRemoteChangeFile)
      remote.on('changeSelection', handleRemoteSelection)
      remote.on('createFile', handleRemoteCreateFile)
      remote.on('deleteFile', handleRemoteDeleteFile)
      remote.on('renameFile', handleRemoteRename)
      remote.on('lostPeer', handleLostPeer)
      remote.on('createDir', handleRemoteCreateDir)

      isSyncing = true
      button.className='active'

      console.log('MH started')
    })
  }
  
  function handleClick () {
    
    var callText = isInCall ? 'Leave Call' : 'Join Call'

    Dialogs.showModalDialog(
      '', 
      'Multihack', 
      Mustache.render(optionsHTML, {room: room}), 
      [
        customButton('Leave Room', true),
        customButton(callText),
        customButton('Cancel')
      ]
    )
    
    var el = document.querySelector('#multihack-network')
    el.style.overflow = 'hidden'
    el.style.maxHeight = '300px'
    el.style.transform = 'translateY(-60px)'
    var graph = new PeerGraph(el)

    graph.add({
      id: 'Me',
      me: true,
      name: 'You'
    })
    
    var proxyID = remote.nop2p ? 'Server' : 'Me'
    
    if (remote.mustForward || remote.nop2p) {
      graph.add({
        id: 'Server',
        me: false,
        name: 'Server'
      })
      graph.connect('Server', 'Me')
    }
    
    for (var i=0; i<remote.peers.length;i++){
      graph.add({
        id: remote.peers[i].id,
        me: false,
        name: remote.peers[i].metadata.nickname
      })
      if (remote.peers[i].nop2p) {
        graph.connect('Server', remote.peers[i].id)
      } else {
        graph.connect(proxyID, remote.peers[i].id)
      }
    }
    
    document.querySelector('[data-button-id="multihack-button-LeaveRoom"]').addEventListener('click', function () {
      graph.destroy()
      handleStop()
    })
    
    document.querySelector('[data-button-id="multihack-button-'+callText.replace(/\s/g, '')+'"]').addEventListener('click', function () {
      graph.destroy()
      if (isInCall) {
        handleVoiceLeave()
      } else {
        handleVoiceJoin()
      }
    })
    
    document.querySelector('[data-button-id="multihack-button-Cancel"]').addEventListener('click', function () {
      graph.destroy()
    })
  }

  function handleStop () {
    if (remote) {
      remote.destroy()
      remote = null
    }
    knownDocs = {}
    
    isSyncing = false
    button.className=''
    
    console.log('MH stopped')
  }

  function handleEditorChange ($event, newEditor, oldEditor) {
    
    if (oldEditor) {
      oldEditor._codeMirror.off('change', sendLocalChange)
      oldEditor._codeMirror.off('beforeSelectionChange', sendLocalSelect)
    }

    if (newEditor) {
      currentEditor = newEditor
      documentRelativePath = FileUtils.getRelativeFilename(projectBasePath, newEditor.document.file.fullPath)
      newEditor._codeMirror.on('change', sendLocalChange)
      newEditor._codeMirror.on('beforeSelectionChange', sendLocalSelect)
      
      if (isSyncing && documentRelativePath && !knownDocs[toWebPath(documentRelativePath)]) {
        knownDocs[toWebPath(documentRelativePath)] = true
        remote.changeFile(toWebPath(documentRelativePath), {
          from: {line: 0, ch: Number.MAX_SAFE_INTEGER},
          to: { line: Number.MAX_SAFE_INTEGER, ch: Number.MAX_SAFE_INTEGER},
          text: newEditor._codeMirror.getValue(),
          origin: 'paste'
        })
      }
    }
  }
  
  function sendLocalSelect (cm, change) {
    var ranges = change.ranges.filter(function (range) {
      return range.head.ch !== range.anchor.ch || range.head.line !== range.anchor.line
    }).map(function (range) {
      var nr = JSON.parse(JSON.stringify(range))
      if (nr.head.line > nr.anchor.line || (
        nr.head.line === nr.anchor.line && nr.head.ch > nr.anchor.ch
      )) {
        var temp = nr.head
        nr.head = nr.anchor
        nr.anchor = temp
      }
      return nr
    })
    
    sendLocalChange(cm, {
      type: 'selection',
      ranges: ranges
    })
  }
  
  function sendLocalChange (cm, change) {
    if (editorMutexLock || !isSyncing) return
    if (!documentRelativePath) {
      documentRelativePath = FileUtils.getRelativeFilename(projectBasePath, EditorManager.getActiveEditor().document.file.fullPath)
      if (!documentRelativePath) {
        // Outside of project
        return
      }
    }
    remote.changeFile(toWebPath(documentRelativePath), change) // Send change to remote peers
  }
  
  function handleLocalDeleteFile (e, fullPath) {
    if (!isSyncing) return
    
    var relativePath = FileUtils.getRelativeFilename(projectBasePath, fullPath)
    if (relativePath.slice(-1) === '/') { // Brackets adds a extra '/' to directory paths
      relativePath = relativePath.slice(0,-1)
    }
    remote.deleteFile(toWebPath(relativePath))
    ProjectManager.refreshFileTree()
  }
  
  function pushChangeToDocument (absPath, data) {
    return DocumentManager.getDocumentForPath(absPath).then(function (doc) {
      editorMutexLock = true
      doc.replaceRange(data.change.text, data.change.from, data.change.to)
      editorMutexLock = false
    })
  }
  
  function buildPath (absPath, cb) {    
    // Build the path
    // HACK: Brackets doesn't offer any sort of path-builder. This is less than ideal
    var split = absPath.split('/')
    for (var i=1; i < split.length; i++) {
      var curPath = split.slice(0, -(split.length-i)).join('/')
      var name = split[i]
      if (!ProjectManager.isWithinProject(curPath+'/'+name)) continue

      var isDir = (i === split.length-1 ? false : true)
      ;(function (curPath, name, isDir) {
        FileSystem.resolve(curPath+'/'+name, function (err) {
          if (err) {
            // HACK: Workaround for adobe/brackets#13267
            if (isDir) name = name + '/'

            ProjectManager.createNewItem(curPath, name, true).then(function () {
              if (!isDir) {
                ProjectManager.refreshFileTree()
                cb() // we are done when we reach the file at the end of the path
              }
            })
          } else if (!isDir) {
            ProjectManager.refreshFileTree()
            cb()
          }
        })
      }(curPath, name, isDir))
    }
  }
  
  function handleLocalRename (e, oldPath, newPath) {
    if (!isSyncing) return
    
    console.log(oldPath, newPath)
    
    var oldFilePath = FileUtils.getRelativeFilename(projectBasePath, oldPath)
    var newFilePath = FileUtils.getRelativeFilename(projectBasePath, newPath)
    
    if (oldFilePath === documentRelativePath) {
      documentRelativePath = newFilePath
    }
    
    var changeObj = {
      type: 'rename', 
      newPath: toWebPath(newFilePath)
    }

    remote.changeFile(toWebPath(oldFilePath), changeObj)
  }
  
  function handleRemoteRename (data) {
    console.log(data)
    var absPath = projectBasePath+fromWebPath(data.filePath)
    
    FileSystem.resolve(absPath, function (err, file) {
      console.log(err, file)
      file.read(function (err, contents) {
        console.log(err, contents)
        handleRemoteChange({
          filePath: data.change.newPath,
          change: {
            from: {ch:0, line:0},
            to: {ch:0, line:0},
            text: contents,
            origin: 'paste'
          }
        })
        handleRemoteDeleteFile({
          filePath: data.filePath
        })
      })
    })
  }
  
  function handleRemoteSelection (data) {
    if (fromWebPath(data.filePath) !== documentRelativePath) return
    
    currentEditor._codeMirror.getAllMarks().forEach(function (mark) {
      mark.clear()
    })

    data.change.ranges.forEach(function (range) {
      console.log(range)
      currentEditor._codeMirror.markText(range.head, range.anchor, {
        className: 'remoteSelection'
      })
    })
  }
  
  function handleRemoteChangeFile (data) {        
    if (fromWebPath(data.filePath) === documentRelativePath) {
      editorMutexLock = true
      currentEditor._codeMirror.replaceRange(data.change.text, data.change.from, data.change.to)
      editorMutexLock = false
    } else {
      // TODO: Batch changes
      var absPath = projectBasePath+fromWebPath(data.filePath)
      if (changeQueue[absPath]) {
        changeQueue[absPath].push(data)
        return
      }

      // Push change to document (create if missing)
      pushChangeToDocument(absPath, data).fail(function (err) {
        changeQueue[absPath] = [data]
        
        buildPath(absPath, function () {
          // Empty the queue that built up
          while (changeQueue[absPath][0]) {
            pushChangeToDocument(absPath, changeQueue[absPath].shift())
          }
          delete changeQueue[absPath]
        })
      })
    }
  }
  
  function handleLostPeer(peer) {
    if (!isSyncing) return
    
    Dialogs.showModalDialog(
      '', 
      'Multihack', 
      '<p>Your connection to "'+peer.metadata.nickname+'" was lost.</p>', 
      [customButton('Ok')]
    )
  }
  
  function provideProject () {
    ProjectManager.getAllFiles().then(function (allFiles) {
      allFiles.sort(function (a, b) {
        return a.fullPath.length - b.fullPath.length
      })
      allFiles.filter(function (a) {
        return a.fullPath.indexOf(FILE_BLACKLIST) === -1
      })
      
      var size = 0
      for (var i=0; i<allFiles.length; i++) {
        ;(function (i) {
          allFiles[i].read(function (err, contents, stat) {
            if (err) return
            size+=contents.length
            if (size > MAX_FORWARDING_SIZE && remote.hostname === DEFAULT_HOSTNAME) {
              return alert('Project too large! Use a P2P connection.')
            }
            
            var filePath = FileUtils.getRelativeFilename(projectBasePath, allFiles[i].fullPath)
            knownDocs[toWebPath(filePath)] = true
            remote.createFile(toWebPath(filePath), contents)
            console.log('sent '+i+' of '+allFiles.length)
          })
        }(i))
      }
    })
  }
  
  function handleRemoteCreateFile (data) {
    handleRemoteChangeFile({
      filePath: data.filePath,
      change: {
        from: {line:0, ch:0},
        to: {line:0, ch:0},
        text: ''
      }
    })
  }
  
  function handleRemoteCreateDir (data) {
    // TODO
  }
  
  function handleRemoteDeleteFile (data) {
    var absPath = projectBasePath+fromWebPath(data.filePath)
    FileSystem.resolve(absPath, function (err, entry) {
      if (entry && entry.moveToTrash) {
        entry.moveToTrash()
        ProjectManager.refreshFileTree()
        console.log(absPath+' moved to trash')
      }
    })
  }
  
  function toWebPath (path) {
    return path[0] === '/' ? path : '/'+path
  }
  
  function fromWebPath (path) {
    return path[0] === '/' ? path.slice(1) : path
  }
  
  function customButton(text, isPrimary) {
    return {
      id: 'multihack-button-'+text.replace(/\s/g, ''),
      text: text,
      className: isPrimary ? 'primary' : ''
    }
  }

  AppInit.appReady(init)
})
/* jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/* global define, $, brackets, window, Mustache */

define(function (require, exports, module) {
  
  var DEFAULT_HOSTNAME = 'https://quiet-shelf-57463.herokuapp.com'
  var MAX_FORWARDING_SIZE = 5*1000*1000 // max 5mb for non-p2p (validated by server)
  var FILE_BLACKLIST = ['node_modules', '.DS_Store', '.git'] // blacklist for paths that will not be requested
  
  var AppInit = brackets.getModule('utils/AppInit')
  var PreferencesManager = brackets.getModule('preferences/PreferencesManager')
  var EditorManager = brackets.getModule('editor/EditorManager')
  var DocumentManager = brackets.getModule('document/DocumentManager')
  var ProjectManager = brackets.getModule('project/ProjectManager')
  var FileSystem = brackets.getModule('filesystem/FileSystem')
  var FileUtils = brackets.getModule('file/FileUtils')
  var Dialogs = brackets.getModule('widgets/Dialogs')
  var ExtensionUtils = brackets.getModule('utils/ExtensionUtils')
  var Mustache = brackets.getModule("thirdparty/mustache/mustache") 
        
  var prefs = PreferencesManager.getExtensionPrefs('multihack-brackets')

  var RemoteManager = require('./lib/npm/multihack-core')
  var PeerGraph = require('./lib/npm/p2p-graph')
  var Voice = require('./lib/voice')

  var remote = null
  var isSyncing = false
  var isInCall = false
  var currentEditor = null
  var editorMutexLock = false
  var projectBasePath = null
  var documentRelativePath = null
  var changeQueue = {}
  var nickname = null
  var knownDocs = {}
  var room
  
  ExtensionUtils.loadStyleSheet(module, 'widget/css/main.css')
  
  var buttonHTML = require('text!./widget/html/button.html')
  var modalHTML = require('text!./widget/html/modal.html')
  var optionsHTML = require('text!./widget/html/optionmodal.html')
  
  $('#main-toolbar .buttons').append(buttonHTML)
  
  var button = document.querySelector('#edc-multihack-btn')
  
  button.addEventListener('click', function () {
    if (isSyncing) {
      handleClick()
    } else {
      handleStart()
    }
  })

  var inited = false // Brackets sometimes tries to init multiple times
  function init () {
    if (inited) return
    inited = true
    setupPreferences()
    setupEventListeners()
  }

  function setupPreferences () {
    prefs.definePreference('hostname', 'string', DEFAULT_HOSTNAME)
    prefs.save()
  }

  function setupEventListeners () {
    projectBasePath = ProjectManager.getProjectRoot().fullPath
    ProjectManager.on('projectOpen', handleStop) // Stop sync on project open
    EditorManager.on('activeEditorChange', handleEditorChange)
    DocumentManager.on('pathDeleted', handleLocalDeleteFile)
    FileSystem.on('rename', handleLocalRename)
  }
  
  function handleVoiceJoin () {    
    if (!remote.voice) return
    remote.voice.join()
    // success listener is set in handleStart
  }
  
  
  function handleVoiceLeave () {
    if (!remote.voice) return
    remote.voice.leave()
    isInCall = false
    button.className = 'active'
  }

  function handleStart () {
    Dialogs.showModalDialog(
      '', 
      'Multihack', 
      modalHTML, 
      [customButton('Join Room', true), customButton('Cancel')]
    )
    var roomInput = document.querySelector('#multihack-room')
    roomInput.value = Math.random().toString(36).substr(2, 20)
    roomInput.select()
    
    var nicknameInput = document.querySelector('#multihack-nickname')
    
    document.querySelector('[data-button-id="multihack-button-JoinRoom"]').addEventListener('click', function () {
      
      room = roomInput.value
      if (!room) return
      nickname = nicknameInput.value || 'Guest'
      
      projectBasePath = ProjectManager.getProjectRoot().fullPath
      remote = new RemoteManager({
        hostname: 'http://localhost:6011', // TODO: prefs.get('hostname'), 
        room: room, 
        nickname: nickname,
        wrtc: null,
        voice: Voice
      })
      remote.posFromIndex = function (filePath, index, cb) {
        if (fromWebPath(filePath) === documentRelativePath) {
          cb(currentEditor._codeMirror.posFromIndex(index))
        } else {
          var absPath = projectBasePath+fromWebPath(filePath)
          DocumentManager.getDocumentForPath(absPath).then(function (doc) {
            cb(doc.posFromIndex(index))
          })
        }
      }
      
      if (remote.voice) {
        remote.voice.on('join', function () {
          button.className = 'active voice'
          isInCall = true
        })
      }
      
      remote.once('ready', function () {
        provideProject()
      })

      remote.on('changeFile', handleRemoteChangeFile)
      remote.on('changeSelection', handleRemoteSelection)
      remote.on('createFile', handleRemoteCreateFile)
      remote.on('deleteFile', handleRemoteDeleteFile)
      remote.on('renameFile', handleRemoteRename)
      remote.on('lostPeer', handleLostPeer)
      remote.on('createDir', handleRemoteCreateDir)

      isSyncing = true
      button.className='active'

      console.log('MH started')
    })
  }
  
  function handleClick () {
    
    var callText = isInCall ? 'Leave Call' : 'Join Call'

    Dialogs.showModalDialog(
      '', 
      'Multihack', 
      Mustache.render(optionsHTML, {room: room}), 
      [
        customButton('Leave Room', true),
        customButton(callText),
        customButton('Cancel')
      ]
    )
    
    var el = document.querySelector('#multihack-network')
    el.style.overflow = 'hidden'
    el.style.maxHeight = '300px'
    el.style.transform = 'translateY(-60px)'
    var graph = new PeerGraph(el)

    graph.add({
      id: 'Me',
      me: true,
      name: 'You'
    })
    
    var proxyID = remote.nop2p ? 'Server' : 'Me'
    
    if (remote.mustForward || remote.nop2p) {
      graph.add({
        id: 'Server',
        me: false,
        name: 'Server'
      })
      graph.connect('Server', 'Me')
    }
    
    for (var i=0; i<remote.peers.length;i++){
      graph.add({
        id: remote.peers[i].id,
        me: false,
        name: remote.peers[i].metadata.nickname
      })
      if (remote.peers[i].nop2p) {
        graph.connect('Server', remote.peers[i].id)
      } else {
        graph.connect(proxyID, remote.peers[i].id)
      }
    }
    
    document.querySelector('[data-button-id="multihack-button-LeaveRoom"]').addEventListener('click', function () {
      graph.destroy()
      handleStop()
    })
    
    document.querySelector('[data-button-id="multihack-button-'+callText.replace(/\s/g, '')+'"]').addEventListener('click', function () {
      graph.destroy()
      if (isInCall) {
        handleVoiceLeave()
      } else {
        handleVoiceJoin()
      }
    })
    
    document.querySelector('[data-button-id="multihack-button-Cancel"]').addEventListener('click', function () {
      graph.destroy()
    })
  }

  function handleStop () {
    if (remote) {
      remote.destroy()
      remote = null
    }
    knownDocs = {}
    
    isSyncing = false
    button.className=''
    
    console.log('MH stopped')
  }

  function handleEditorChange ($event, newEditor, oldEditor) {
    
    if (oldEditor) {
      oldEditor._codeMirror.off('change', sendLocalChange)
      oldEditor._codeMirror.off('beforeSelectionChange', sendLocalSelect)
    }

    if (newEditor) {
      currentEditor = newEditor
      documentRelativePath = FileUtils.getRelativeFilename(projectBasePath, newEditor.document.file.fullPath)
      newEditor._codeMirror.on('change', sendLocalChange)
      newEditor._codeMirror.on('beforeSelectionChange', sendLocalSelect)
      
      if (isSyncing && documentRelativePath && !knownDocs[toWebPath(documentRelativePath)]) {
        knownDocs[toWebPath(documentRelativePath)] = true
        remote.changeFile(toWebPath(documentRelativePath), {
          from: {line: 0, ch: Number.MAX_SAFE_INTEGER},
          to: { line: Number.MAX_SAFE_INTEGER, ch: Number.MAX_SAFE_INTEGER},
          text: newEditor._codeMirror.getValue(),
          origin: 'paste'
        })
      }
    }
  }
  
  function sendLocalSelect (cm, change) {
    var ranges = change.ranges.filter(function (range) {
      return range.head.ch !== range.anchor.ch || range.head.line !== range.anchor.line
    }).map(function (range) {
      var nr = JSON.parse(JSON.stringify(range))
      if (nr.head.line > nr.anchor.line || (
        nr.head.line === nr.anchor.line && nr.head.ch > nr.anchor.ch
      )) {
        var temp = nr.head
        nr.head = nr.anchor
        nr.anchor = temp
      }
      return nr
    })
    
    sendLocalChange(cm, {
      type: 'selection',
      ranges: ranges
    })
  }
  
  function sendLocalChange (cm, change) {
    if (editorMutexLock || !isSyncing) return
    if (!documentRelativePath) {
      documentRelativePath = FileUtils.getRelativeFilename(projectBasePath, EditorManager.getActiveEditor().document.file.fullPath)
      if (!documentRelativePath) {
        // Outside of project
        return
      }
    }
    remote.changeFile(toWebPath(documentRelativePath), change) // Send change to remote peers
  }
  
  function handleLocalDeleteFile (e, fullPath) {
    if (!isSyncing) return
    
    var relativePath = FileUtils.getRelativeFilename(projectBasePath, fullPath)
    if (relativePath.slice(-1) === '/') { // Brackets adds a extra '/' to directory paths
      relativePath = relativePath.slice(0,-1)
    }
    remote.deleteFile(toWebPath(relativePath))
    ProjectManager.refreshFileTree()
  }
  
  function pushChangeToDocument (absPath, data) {
    return DocumentManager.getDocumentForPath(absPath).then(function (doc) {
      editorMutexLock = true
      doc.replaceRange(data.change.text, data.change.from, data.change.to)
      editorMutexLock = false
    })
  }
  
  function buildPath (absPath, cb) {    
    // Build the path
    // HACK: Brackets doesn't offer any sort of path-builder. This is less than ideal
    var split = absPath.split('/')
    for (var i=1; i < split.length; i++) {
      var curPath = split.slice(0, -(split.length-i)).join('/')
      var name = split[i]
      if (!ProjectManager.isWithinProject(curPath+'/'+name)) continue

      var isDir = (i === split.length-1 ? false : true)
      ;(function (curPath, name, isDir) {
        FileSystem.resolve(curPath+'/'+name, function (err) {
          if (err) {
            // HACK: Workaround for adobe/brackets#13267
            if (isDir) name = name + '/'

            ProjectManager.createNewItem(curPath, name, true).then(function () {
              if (!isDir) {
                ProjectManager.refreshFileTree()
                cb() // we are done when we reach the file at the end of the path
              }
            })
          } else if (!isDir) {
            ProjectManager.refreshFileTree()
            cb()
          }
        })
      }(curPath, name, isDir))
    }
  }
  
  function handleLocalRename (e, oldPath, newPath) {
    if (!isSyncing) return
    
    console.log(oldPath, newPath)
    
    var oldFilePath = FileUtils.getRelativeFilename(projectBasePath, oldPath)
    var newFilePath = FileUtils.getRelativeFilename(projectBasePath, newPath)
    
    if (oldFilePath === documentRelativePath) {
      documentRelativePath = newFilePath
    }
    
    var changeObj = {
      type: 'rename', 
      newPath: toWebPath(newFilePath)
    }

    remote.changeFile(toWebPath(oldFilePath), changeObj)
  }
  
  function handleRemoteRename (data) {
    console.log(data)
    var absPath = projectBasePath+fromWebPath(data.filePath)
    
    FileSystem.resolve(absPath, function (err, file) {
      console.log(err, file)
      file.read(function (err, contents) {
        console.log(err, contents)
        handleRemoteChange({
          filePath: data.change.newPath,
          change: {
            from: {ch:0, line:0},
            to: {ch:0, line:0},
            text: contents,
            origin: 'paste'
          }
        })
        handleRemoteDeleteFile({
          filePath: data.filePath
        })
      })
    })
  }
  
  function handleRemoteSelection (data) {
    if (fromWebPath(data.filePath) !== documentRelativePath) return
    
    currentEditor._codeMirror.getAllMarks().forEach(function (mark) {
      mark.clear()
    })

    data.change.ranges.forEach(function (range) {
      console.log(range)
      currentEditor._codeMirror.markText(range.head, range.anchor, {
        className: 'remoteSelection'
      })
    })
  }
  
  function handleRemoteChangeFile (data) {        
    if (fromWebPath(data.filePath) === documentRelativePath) {
      editorMutexLock = true
      currentEditor._codeMirror.replaceRange(data.change.text, data.change.from, data.change.to)
      editorMutexLock = false
    } else {
      // TODO: Batch changes
      var absPath = projectBasePath+fromWebPath(data.filePath)
      if (changeQueue[absPath]) {
        changeQueue[absPath].push(data)
        return
      }

      // Push change to document (create if missing)
      pushChangeToDocument(absPath, data).fail(function (err) {
        changeQueue[absPath] = [data]
        
        buildPath(absPath, function () {
          // Empty the queue that built up
          while (changeQueue[absPath][0]) {
            pushChangeToDocument(absPath, changeQueue[absPath].shift())
          }
          delete changeQueue[absPath]
        })
      })
    }
  }
  
  function handleLostPeer(peer) {
    if (!isSyncing) return
    
    Dialogs.showModalDialog(
      '', 
      'Multihack', 
      '<p>Your connection to "'+peer.metadata.nickname+'" was lost.</p>', 
      [customButton('Ok')]
    )
  }
  
  function provideProject () {
    ProjectManager.getAllFiles().then(function (allFiles) {
      allFiles.sort(function (a, b) {
        return a.fullPath.length - b.fullPath.length
      })
      allFiles.filter(function (a) {
        return a.fullPath.indexOf(FILE_BLACKLIST) === -1
      })
      
      var size = 0
      for (var i=0; i<allFiles.length; i++) {
        ;(function (i) {
          allFiles[i].read(function (err, contents, stat) {
            if (err) return
            size+=contents.length
            if (size > MAX_FORWARDING_SIZE && remote.hostname === DEFAULT_HOSTNAME) {
              return alert('Project too large! Use a P2P connection.')
            }
            
            var filePath = FileUtils.getRelativeFilename(projectBasePath, allFiles[i].fullPath)
            knownDocs[toWebPath(filePath)] = true
            remote.createFile(toWebPath(filePath), contents)
            console.log('sent '+i+' of '+allFiles.length)
          })
        }(i))
      }
    })
  }
  
  function handleRemoteCreateFile (data) {
    handleRemoteChangeFile({
      filePath: data.filePath,
      change: {
        from: {line:0, ch:0},
        to: {line:0, ch:0},
        text: ''
      }
    })
  }
  
  function handleRemoteCreateDir (data) {
    // TODO
  }
  
  function handleRemoteDeleteFile (data) {
    var absPath = projectBasePath+fromWebPath(data.filePath)
    FileSystem.resolve(absPath, function (err, entry) {
      if (entry && entry.moveToTrash) {
        entry.moveToTrash()
        ProjectManager.refreshFileTree()
        console.log(absPath+' moved to trash')
      }
    })
  }
  
  function toWebPath (path) {
    return path[0] === '/' ? path : '/'+path
  }
  
  function fromWebPath (path) {
    return path[0] === '/' ? path.slice(1) : path
  }
  
  function customButton(text, isPrimary) {
    return {
      id: 'multihack-button-'+text.replace(/\s/g, ''),
      text: text,
      className: isPrimary ? 'primary' : ''
    }
  }

  AppInit.appReady(init)
})
/* jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/* global define, $, brackets, window, Mustache */

define(function (require, exports, module) {
  
  var DEFAULT_HOSTNAME = 'https://quiet-shelf-57463.herokuapp.com'
  var MAX_FORWARDING_SIZE = 5*1000*1000 // max 5mb for non-p2p (validated by server)
  var FILE_BLACKLIST = ['node_modules', '.DS_Store', '.git'] // blacklist for paths that will not be requested
  
  var AppInit = brackets.getModule('utils/AppInit')
  var PreferencesManager = brackets.getModule('preferences/PreferencesManager')
  var EditorManager = brackets.getModule('editor/EditorManager')
  var DocumentManager = brackets.getModule('document/DocumentManager')
  var ProjectManager = brackets.getModule('project/ProjectManager')
  var FileSystem = brackets.getModule('filesystem/FileSystem')
  var FileUtils = brackets.getModule('file/FileUtils')
  var Dialogs = brackets.getModule('widgets/Dialogs')
  var ExtensionUtils = brackets.getModule('utils/ExtensionUtils')
  var Mustache = brackets.getModule("thirdparty/mustache/mustache") 
        
  var prefs = PreferencesManager.getExtensionPrefs('multihack-brackets')

  var RemoteManager = require('./lib/npm/multihack-core')
  var PeerGraph = require('./lib/npm/p2p-graph')
  var Voice = require('./lib/voice')

  var remote = null
  var isSyncing = false
  var isInCall = false
  var currentEditor = null
  var editorMutexLock = false
  var projectBasePath = null
  var documentRelativePath = null
  var changeQueue = {}
  var nickname = null
  var knownDocs = {}
  var room
  
  ExtensionUtils.loadStyleSheet(module, 'widget/css/main.css')
  
  var buttonHTML = require('text!./widget/html/button.html')
  var modalHTML = require('text!./widget/html/modal.html')
  var optionsHTML = require('text!./widget/html/optionmodal.html')
  
  $('#main-toolbar .buttons').append(buttonHTML)
  
  var button = document.querySelector('#edc-multihack-btn')
  
  button.addEventListener('click', function () {
    if (isSyncing) {
      handleClick()
    } else {
      handleStart()
    }
  })

  var inited = false // Brackets sometimes tries to init multiple times
  function init () {
    if (inited) return
    inited = true
    setupPreferences()
    setupEventListeners()
  }

  function setupPreferences () {
    prefs.definePreference('hostname', 'string', DEFAULT_HOSTNAME)
    prefs.save()
  }

  function setupEventListeners () {
    projectBasePath = ProjectManager.getProjectRoot().fullPath
    ProjectManager.on('projectOpen', handleStop) // Stop sync on project open
    EditorManager.on('activeEditorChange', handleEditorChange)
    DocumentManager.on('pathDeleted', handleLocalDeleteFile)
    FileSystem.on('rename', handleLocalRename)
  }
  
  function handleVoiceJoin () {    
    if (!remote.voice) return
    remote.voice.join()
    // success listener is set in handleStart
  }
  
  
  function handleVoiceLeave () {
    if (!remote.voice) return
    remote.voice.leave()
    isInCall = false
    button.className = 'active'
  }

  function handleStart () {
    Dialogs.showModalDialog(
      '', 
      'Multihack', 
      modalHTML, 
      [customButton('Join Room', true), customButton('Cancel')]
    )
    var roomInput = document.querySelector('#multihack-room')
    roomInput.value = Math.random().toString(36).substr(2, 20)
    roomInput.select()
    
    var nicknameInput = document.querySelector('#multihack-nickname')
    
    document.querySelector('[data-button-id="multihack-button-JoinRoom"]').addEventListener('click', function () {
      
      room = roomInput.value
      if (!room) return
      nickname = nicknameInput.value || 'Guest'
      
      projectBasePath = ProjectManager.getProjectRoot().fullPath
      remote = new RemoteManager({
        hostname: 'http://localhost:6011', // TODO: prefs.get('hostname'), 
        room: room, 
        nickname: nickname,
        wrtc: null,
        voice: Voice
      })
      remote.posFromIndex = function (filePath, index, cb) {
        if (fromWebPath(filePath) === documentRelativePath) {
          cb(currentEditor._codeMirror.posFromIndex(index))
        } else {
          var absPath = projectBasePath+fromWebPath(filePath)
          DocumentManager.getDocumentForPath(absPath).then(function (doc) {
            cb(doc.posFromIndex(index))
          })
        }
      }
      
      if (remote.voice) {
        remote.voice.on('join', function () {
          button.className = 'active voice'
          isInCall = true
        })
      }
      
      remote.once('ready', function () {
        provideProject()
      })

      remote.on('changeFile', handleRemoteChangeFile)
      remote.on('changeSelection', handleRemoteSelection)
      remote.on('createFile', handleRemoteCreateFile)
      remote.on('deleteFile', handleRemoteDeleteFile)
      remote.on('renameFile', handleRemoteRename)
      remote.on('lostPeer', handleLostPeer)
      remote.on('createDir', handleRemoteCreateDir)

      isSyncing = true
      button.className='active'

      console.log('MH started')
    })
  }
  
  function handleClick () {
    
    var callText = isInCall ? 'Leave Call' : 'Join Call'

    Dialogs.showModalDialog(
      '', 
      'Multihack', 
      Mustache.render(optionsHTML, {room: room}), 
      [
        customButton('Leave Room', true),
        customButton(callText),
        customButton('Cancel')
      ]
    )
    
    var el = document.querySelector('#multihack-network')
    el.style.overflow = 'hidden'
    el.style.maxHeight = '300px'
    el.style.transform = 'translateY(-60px)'
    var graph = new PeerGraph(el)

    graph.add({
      id: 'Me',
      me: true,
      name: 'You'
    })
    
    var proxyID = remote.nop2p ? 'Server' : 'Me'
    
    if (remote.mustForward || remote.nop2p) {
      graph.add({
        id: 'Server',
        me: false,
        name: 'Server'
      })
      graph.connect('Server', 'Me')
    }
    
    for (var i=0; i<remote.peers.length;i++){
      graph.add({
        id: remote.peers[i].id,
        me: false,
        name: remote.peers[i].metadata.nickname
      })
      if (remote.peers[i].nop2p) {
        graph.connect('Server', remote.peers[i].id)
      } else {
        graph.connect(proxyID, remote.peers[i].id)
      }
    }
    
    document.querySelector('[data-button-id="multihack-button-LeaveRoom"]').addEventListener('click', function () {
      graph.destroy()
      handleStop()
    })
    
    document.querySelector('[data-button-id="multihack-button-'+callText.replace(/\s/g, '')+'"]').addEventListener('click', function () {
      graph.destroy()
      if (isInCall) {
        handleVoiceLeave()
      } else {
        handleVoiceJoin()
      }
    })
    
    document.querySelector('[data-button-id="multihack-button-Cancel"]').addEventListener('click', function () {
      graph.destroy()
    })
  }

  function handleStop () {
    if (remote) {
      remote.destroy()
      remote = null
    }
    knownDocs = {}
    
    isSyncing = false
    button.className=''
    
    console.log('MH stopped')
  }

  function handleEditorChange ($event, newEditor, oldEditor) {
    
    if (oldEditor) {
      oldEditor._codeMirror.off('change', sendLocalChange)
      oldEditor._codeMirror.off('beforeSelectionChange', sendLocalSelect)
    }

    if (newEditor) {
      currentEditor = newEditor
      documentRelativePath = FileUtils.getRelativeFilename(projectBasePath, newEditor.document.file.fullPath)
      newEditor._codeMirror.on('change', sendLocalChange)
      newEditor._codeMirror.on('beforeSelectionChange', sendLocalSelect)
      
      if (isSyncing && documentRelativePath && !knownDocs[toWebPath(documentRelativePath)]) {
        knownDocs[toWebPath(documentRelativePath)] = true
        remote.changeFile(toWebPath(documentRelativePath), {
          from: {line: 0, ch: Number.MAX_SAFE_INTEGER},
          to: { line: Number.MAX_SAFE_INTEGER, ch: Number.MAX_SAFE_INTEGER},
          text: newEditor._codeMirror.getValue(),
          origin: 'paste'
        })
      }
    }
  }
  
  function sendLocalSelect (cm, change) {
    var ranges = change.ranges.filter(function (range) {
      return range.head.ch !== range.anchor.ch || range.head.line !== range.anchor.line
    }).map(function (range) {
      var nr = JSON.parse(JSON.stringify(range))
      if (nr.head.line > nr.anchor.line || (
        nr.head.line === nr.anchor.line && nr.head.ch > nr.anchor.ch
      )) {
        var temp = nr.head
        nr.head = nr.anchor
        nr.anchor = temp
      }
      return nr
    })
    
    sendLocalChange(cm, {
      type: 'selection',
      ranges: ranges
    })
  }
  
  function sendLocalChange (cm, change) {
    if (editorMutexLock || !isSyncing) return
    if (!documentRelativePath) {
      documentRelativePath = FileUtils.getRelativeFilename(projectBasePath, EditorManager.getActiveEditor().document.file.fullPath)
      if (!documentRelativePath) {
        // Outside of project
        return
      }
    }
    remote.changeFile(toWebPath(documentRelativePath), change) // Send change to remote peers
  }
  
  function handleLocalDeleteFile (e, fullPath) {
    if (!isSyncing) return
    
    var relativePath = FileUtils.getRelativeFilename(projectBasePath, fullPath)
    if (relativePath.slice(-1) === '/') { // Brackets adds a extra '/' to directory paths
      relativePath = relativePath.slice(0,-1)
    }
    remote.deleteFile(toWebPath(relativePath))
    ProjectManager.refreshFileTree()
  }
  
  function pushChangeToDocument (absPath, data) {
    return DocumentManager.getDocumentForPath(absPath).then(function (doc) {
      editorMutexLock = true
      doc.replaceRange(data.change.text, data.change.from, data.change.to)
      editorMutexLock = false
    })
  }
  
  function buildPath (absPath, cb) {    
    // Build the path
    // HACK: Brackets doesn't offer any sort of path-builder. This is less than ideal
    var split = absPath.split('/')
    for (var i=1; i < split.length; i++) {
      var curPath = split.slice(0, -(split.length-i)).join('/')
      var name = split[i]
      if (!ProjectManager.isWithinProject(curPath+'/'+name)) continue

      var isDir = (i === split.length-1 ? false : true)
      ;(function (curPath, name, isDir) {
        FileSystem.resolve(curPath+'/'+name, function (err) {
          if (err) {
            // HACK: Workaround for adobe/brackets#13267
            if (isDir) name = name + '/'

            ProjectManager.createNewItem(curPath, name, true).then(function () {
              if (!isDir) {
                ProjectManager.refreshFileTree()
                cb() // we are done when we reach the file at the end of the path
              }
            })
          } else if (!isDir) {
            ProjectManager.refreshFileTree()
            cb()
          }
        })
      }(curPath, name, isDir))
    }
  }
  
  function handleLocalRename (e, oldPath, newPath) {
    if (!isSyncing) return
    
    console.log(oldPath, newPath)
    
    var oldFilePath = FileUtils.getRelativeFilename(projectBasePath, oldPath)
    var newFilePath = FileUtils.getRelativeFilename(projectBasePath, newPath)
    
    if (oldFilePath === documentRelativePath) {
      documentRelativePath = newFilePath
    }
    
    var changeObj = {
      type: 'rename', 
      newPath: toWebPath(newFilePath)
    }

    remote.changeFile(toWebPath(oldFilePath), changeObj)
  }
  
  function handleRemoteRename (data) {
    console.log(data)
    var absPath = projectBasePath+fromWebPath(data.filePath)
    
    FileSystem.resolve(absPath, function (err, file) {
      console.log(err, file)
      file.read(function (err, contents) {
        console.log(err, contents)
        handleRemoteChange({
          filePath: data.change.newPath,
          change: {
            from: {ch:0, line:0},
            to: {ch:0, line:0},
            text: contents,
            origin: 'paste'
          }
        })
        handleRemoteDeleteFile({
          filePath: data.filePath
        })
      })
    })
  }
  
  function handleRemoteSelection (data) {
    if (fromWebPath(data.filePath) !== documentRelativePath) return
    
    currentEditor._codeMirror.getAllMarks().forEach(function (mark) {
      mark.clear()
    })

    data.change.ranges.forEach(function (range) {
      console.log(range)
      currentEditor._codeMirror.markText(range.head, range.anchor, {
        className: 'remoteSelection'
      })
    })
  }
  
  function handleRemoteChangeFile (data) {        
    if (fromWebPath(data.filePath) === documentRelativePath) {
      editorMutexLock = true
      currentEditor._codeMirror.replaceRange(data.change.text, data.change.from, data.change.to)
      editorMutexLock = false
    } else {
      // TODO: Batch changes
      var absPath = projectBasePath+fromWebPath(data.filePath)
      if (changeQueue[absPath]) {
        changeQueue[absPath].push(data)
        return
      }

      // Push change to document (create if missing)
      pushChangeToDocument(absPath, data).fail(function (err) {
        changeQueue[absPath] = [data]
        
        buildPath(absPath, function () {
          // Empty the queue that built up
          while (changeQueue[absPath][0]) {
            pushChangeToDocument(absPath, changeQueue[absPath].shift())
          }
          delete changeQueue[absPath]
        })
      })
    }
  }
  
  function handleLostPeer(peer) {
    if (!isSyncing) return
    
    Dialogs.showModalDialog(
      '', 
      'Multihack', 
      '<p>Your connection to "'+peer.metadata.nickname+'" was lost.</p>', 
      [customButton('Ok')]
    )
  }
  
  function provideProject () {
    ProjectManager.getAllFiles().then(function (allFiles) {
      allFiles.sort(function (a, b) {
        return a.fullPath.length - b.fullPath.length
      })
      allFiles.filter(function (a) {
        return a.fullPath.indexOf(FILE_BLACKLIST) === -1
      })
      
      var size = 0
      for (var i=0; i<allFiles.length; i++) {
        ;(function (i) {
          allFiles[i].read(function (err, contents, stat) {
            if (err) return
            size+=contents.length
            if (size > MAX_FORWARDING_SIZE && remote.hostname === DEFAULT_HOSTNAME) {
              return alert('Project too large! Use a P2P connection.')
            }
            
            var filePath = FileUtils.getRelativeFilename(projectBasePath, allFiles[i].fullPath)
            knownDocs[toWebPath(filePath)] = true
            remote.createFile(toWebPath(filePath), contents)
            console.log('sent '+i+' of '+allFiles.length)
          })
        }(i))
      }
    })
  }
  
  function handleRemoteCreateFile (data) {
    handleRemoteChangeFile({
      filePath: data.filePath,
      change: {
        from: {line:0, ch:0},
        to: {line:0, ch:0},
        text: ''
      }
    })
  }
  
  function handleRemoteCreateDir (data) {
    // TODO
  }
  
  function handleRemoteDeleteFile (data) {
    var absPath = projectBasePath+fromWebPath(data.filePath)
    FileSystem.resolve(absPath, function (err, entry) {
      if (entry && entry.moveToTrash) {
        entry.moveToTrash()
        ProjectManager.refreshFileTree()
        console.log(absPath+' moved to trash')
      }
    })
  }
  
  function toWebPath (path) {
    return path[0] === '/' ? path : '/'+path
  }
  
  function fromWebPath (path) {
    return path[0] === '/' ? path.slice(1) : path
  }
  
  function customButton(text, isPrimary) {
    return {
      id: 'multihack-button-'+text.replace(/\s/g, ''),
      text: text,
      className: isPrimary ? 'primary' : ''
    }
  }

  AppInit.appReady(init)
})
/* jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/* global define, $, brackets, window, Mustache */

define(function (require, exports, module) {
  
  var DEFAULT_HOSTNAME = 'https://quiet-shelf-57463.herokuapp.com'
  var MAX_FORWARDING_SIZE = 5*1000*1000 // max 5mb for non-p2p (validated by server)
  var FILE_BLACKLIST = ['node_modules', '.DS_Store', '.git'] // blacklist for paths that will not be requested
  
  var AppInit = brackets.getModule('utils/AppInit')
  var PreferencesManager = brackets.getModule('preferences/PreferencesManager')
  var EditorManager = brackets.getModule('editor/EditorManager')
  var DocumentManager = brackets.getModule('document/DocumentManager')
  var ProjectManager = brackets.getModule('project/ProjectManager')
  var FileSystem = brackets.getModule('filesystem/FileSystem')
  var FileUtils = brackets.getModule('file/FileUtils')
  var Dialogs = brackets.getModule('widgets/Dialogs')
  var ExtensionUtils = brackets.getModule('utils/ExtensionUtils')
  var Mustache = brackets.getModule("thirdparty/mustache/mustache") 
        
  var prefs = PreferencesManager.getExtensionPrefs('multihack-brackets')

  var RemoteManager = require('./lib/npm/multihack-core')
  var PeerGraph = require('./lib/npm/p2p-graph')
  var Voice = require('./lib/voice')

  var remote = null
  var isSyncing = false
  var isInCall = false
  var currentEditor = null
  var editorMutexLock = false
  var projectBasePath = null
  var documentRelativePath = null
  var changeQueue = {}
  var nickname = null
  var knownDocs = {}
  var room
  
  ExtensionUtils.loadStyleSheet(module, 'widget/css/main.css')
  
  var buttonHTML = require('text!./widget/html/button.html')
  var modalHTML = require('text!./widget/html/modal.html')
  var optionsHTML = require('text!./widget/html/optionmodal.html')
  
  $('#main-toolbar .buttons').append(buttonHTML)
  
  var button = document.querySelector('#edc-multihack-btn')
  
  button.addEventListener('click', function () {
    if (isSyncing) {
      handleClick()
    } else {
      handleStart()
    }
  })

  var inited = false // Brackets sometimes tries to init multiple times
  function init () {
    if (inited) return
    inited = true
    setupPreferences()
    setupEventListeners()
  }

  function setupPreferences () {
    prefs.definePreference('hostname', 'string', DEFAULT_HOSTNAME)
    prefs.save()
  }

  function setupEventListeners () {
    projectBasePath = ProjectManager.getProjectRoot().fullPath
    ProjectManager.on('projectOpen', handleStop) // Stop sync on project open
    EditorManager.on('activeEditorChange', handleEditorChange)
    DocumentManager.on('pathDeleted', handleLocalDeleteFile)
    FileSystem.on('rename', handleLocalRename)
  }
  
  function handleVoiceJoin () {    
    if (!remote.voice) return
    remote.voice.join()
    // success listener is set in handleStart
  }
  
  
  function handleVoiceLeave () {
    if (!remote.voice) return
    remote.voice.leave()
    isInCall = false
    button.className = 'active'
  }

  function handleStart () {
    Dialogs.showModalDialog(
      '', 
      'Multihack', 
      modalHTML, 
      [customButton('Join Room', true), customButton('Cancel')]
    )
    var roomInput = document.querySelector('#multihack-room')
    roomInput.value = Math.random().toString(36).substr(2, 20)
    roomInput.select()
    
    var nicknameInput = document.querySelector('#multihack-nickname')
    
    document.querySelector('[data-button-id="multihack-button-JoinRoom"]').addEventListener('click', function () {
      
      room = roomInput.value
      if (!room) return
      nickname = nicknameInput.value || 'Guest'
      
      projectBasePath = ProjectManager.getProjectRoot().fullPath
      remote = new RemoteManager({
        hostname: 'http://localhost:6011', // TODO: prefs.get('hostname'), 
        room: room, 
        nickname: nickname,
        wrtc: null,
        voice: Voice
      })
      remote.posFromIndex = function (filePath, index, cb) {
        if (fromWebPath(filePath) === documentRelativePath) {
          cb(currentEditor._codeMirror.posFromIndex(index))
        } else {
          var absPath = projectBasePath+fromWebPath(filePath)
          DocumentManager.getDocumentForPath(absPath).then(function (doc) {
            console.log(doc)
            cb(doc.posFromIndex(index))
          })
        }
      }
      
      if (remote.voice) {
        remote.voice.on('join', function () {
          button.className = 'active voice'
          isInCall = true
        })
      }
      
      remote.once('ready', function () {
        provideProject()
      })

      remote.on('changeFile', handleRemoteChangeFile)
      remote.on('changeSelection', handleRemoteSelection)
      remote.on('createFile', handleRemoteCreateFile)
      remote.on('deleteFile', handleRemoteDeleteFile)
      remote.on('renameFile', handleRemoteRename)
      remote.on('lostPeer', handleLostPeer)
      remote.on('createDir', handleRemoteCreateDir)

      isSyncing = true
      button.className='active'

      console.log('MH started')
    })
  }
  
  function handleClick () {
    
    var callText = isInCall ? 'Leave Call' : 'Join Call'

    Dialogs.showModalDialog(
      '', 
      'Multihack', 
      Mustache.render(optionsHTML, {room: room}), 
      [
        customButton('Leave Room', true),
        customButton(callText),
        customButton('Cancel')
      ]
    )
    
    var el = document.querySelector('#multihack-network')
    el.style.overflow = 'hidden'
    el.style.maxHeight = '300px'
    el.style.transform = 'translateY(-60px)'
    var graph = new PeerGraph(el)

    graph.add({
      id: 'Me',
      me: true,
      name: 'You'
    })
    
    var proxyID = remote.nop2p ? 'Server' : 'Me'
    
    if (remote.mustForward || remote.nop2p) {
      graph.add({
        id: 'Server',
        me: false,
        name: 'Server'
      })
      graph.connect('Server', 'Me')
    }
    
    for (var i=0; i<remote.peers.length;i++){
      graph.add({
        id: remote.peers[i].id,
        me: false,
        name: remote.peers[i].metadata.nickname
      })
      if (remote.peers[i].nop2p) {
        graph.connect('Server', remote.peers[i].id)
      } else {
        graph.connect(proxyID, remote.peers[i].id)
      }
    }
    
    document.querySelector('[data-button-id="multihack-button-LeaveRoom"]').addEventListener('click', function () {
      graph.destroy()
      handleStop()
    })
    
    document.querySelector('[data-button-id="multihack-button-'+callText.replace(/\s/g, '')+'"]').addEventListener('click', function () {
      graph.destroy()
      if (isInCall) {
        handleVoiceLeave()
      } else {
        handleVoiceJoin()
      }
    })
    
    document.querySelector('[data-button-id="multihack-button-Cancel"]').addEventListener('click', function () {
      graph.destroy()
    })
  }

  function handleStop () {
    if (remote) {
      remote.destroy()
      remote = null
    }
    knownDocs = {}
    
    isSyncing = false
    button.className=''
    
    console.log('MH stopped')
  }

  function handleEditorChange ($event, newEditor, oldEditor) {
    
    if (oldEditor) {
      oldEditor._codeMirror.off('change', sendLocalChange)
      oldEditor._codeMirror.off('beforeSelectionChange', sendLocalSelect)
    }

    if (newEditor) {
      currentEditor = newEditor
      documentRelativePath = FileUtils.getRelativeFilename(projectBasePath, newEditor.document.file.fullPath)
      newEditor._codeMirror.on('change', sendLocalChange)
      newEditor._codeMirror.on('beforeSelectionChange', sendLocalSelect)
      
      if (isSyncing && documentRelativePath && !knownDocs[toWebPath(documentRelativePath)]) {
        knownDocs[toWebPath(documentRelativePath)] = true
        remote.changeFile(toWebPath(documentRelativePath), {
          from: {line: 0, ch: Number.MAX_SAFE_INTEGER},
          to: { line: Number.MAX_SAFE_INTEGER, ch: Number.MAX_SAFE_INTEGER},
          text: newEditor._codeMirror.getValue(),
          origin: 'paste'
        })
      }
    }
  }
  
  function sendLocalSelect (cm, change) {
    var ranges = change.ranges.filter(function (range) {
      return range.head.ch !== range.anchor.ch || range.head.line !== range.anchor.line
    }).map(function (range) {
      var nr = JSON.parse(JSON.stringify(range))
      if (nr.head.line > nr.anchor.line || (
        nr.head.line === nr.anchor.line && nr.head.ch > nr.anchor.ch
      )) {
        var temp = nr.head
        nr.head = nr.anchor
        nr.anchor = temp
      }
      return nr
    })
    
    sendLocalChange(cm, {
      type: 'selection',
      ranges: ranges
    })
  }
  
  function sendLocalChange (cm, change) {
    if (editorMutexLock || !isSyncing) return
    if (!documentRelativePath) {
      documentRelativePath = FileUtils.getRelativeFilename(projectBasePath, EditorManager.getActiveEditor().document.file.fullPath)
      if (!documentRelativePath) {
        // Outside of project
        return
      }
    }
    remote.changeFile(toWebPath(documentRelativePath), change) // Send change to remote peers
  }
  
  function handleLocalDeleteFile (e, fullPath) {
    if (!isSyncing) return
    
    var relativePath = FileUtils.getRelativeFilename(projectBasePath, fullPath)
    if (relativePath.slice(-1) === '/') { // Brackets adds a extra '/' to directory paths
      relativePath = relativePath.slice(0,-1)
    }
    remote.deleteFile(toWebPath(relativePath))
    ProjectManager.refreshFileTree()
  }
  
  function pushChangeToDocument (absPath, data) {
    return DocumentManager.getDocumentForPath(absPath).then(function (doc) {
      editorMutexLock = true
      doc.replaceRange(data.change.text, data.change.from, data.change.to)
      editorMutexLock = false
    })
  }
  
  function buildPath (absPath, cb) {    
    // Build the path
    // HACK: Brackets doesn't offer any sort of path-builder. This is less than ideal
    var split = absPath.split('/')
    for (var i=1; i < split.length; i++) {
      var curPath = split.slice(0, -(split.length-i)).join('/')
      var name = split[i]
      if (!ProjectManager.isWithinProject(curPath+'/'+name)) continue

      var isDir = (i === split.length-1 ? false : true)
      ;(function (curPath, name, isDir) {
        FileSystem.resolve(curPath+'/'+name, function (err) {
          if (err) {
            // HACK: Workaround for adobe/brackets#13267
            if (isDir) name = name + '/'

            ProjectManager.createNewItem(curPath, name, true).then(function () {
              if (!isDir) {
                ProjectManager.refreshFileTree()
                cb() // we are done when we reach the file at the end of the path
              }
            })
          } else if (!isDir) {
            ProjectManager.refreshFileTree()
            cb()
          }
        })
      }(curPath, name, isDir))
    }
  }
  
  function handleLocalRename (e, oldPath, newPath) {
    if (!isSyncing) return
    
    console.log(oldPath, newPath)
    
    var oldFilePath = FileUtils.getRelativeFilename(projectBasePath, oldPath)
    var newFilePath = FileUtils.getRelativeFilename(projectBasePath, newPath)
    
    if (oldFilePath === documentRelativePath) {
      documentRelativePath = newFilePath
    }
    
    var changeObj = {
      type: 'rename', 
      newPath: toWebPath(newFilePath)
    }

    remote.changeFile(toWebPath(oldFilePath), changeObj)
  }
  
  function handleRemoteRename (data) {
    console.log(data)
    var absPath = projectBasePath+fromWebPath(data.filePath)
    
    FileSystem.resolve(absPath, function (err, file) {
      console.log(err, file)
      file.read(function (err, contents) {
        console.log(err, contents)
        handleRemoteChange({
          filePath: data.change.newPath,
          change: {
            from: {ch:0, line:0},
            to: {ch:0, line:0},
            text: contents,
            origin: 'paste'
          }
        })
        handleRemoteDeleteFile({
          filePath: data.filePath
        })
      })
    })
  }
  
  function handleRemoteSelection (data) {
    if (fromWebPath(data.filePath) !== documentRelativePath) return
    
    currentEditor._codeMirror.getAllMarks().forEach(function (mark) {
      mark.clear()
    })

    data.change.ranges.forEach(function (range) {
      console.log(range)
      currentEditor._codeMirror.markText(range.head, range.anchor, {
        className: 'remoteSelection'
      })
    })
  }
  
  function handleRemoteChangeFile (data) {        
    if (fromWebPath(data.filePath) === documentRelativePath) {
      editorMutexLock = true
      currentEditor._codeMirror.replaceRange(data.change.text, data.change.from, data.change.to)
      editorMutexLock = false
    } else {
      // TODO: Batch changes
      var absPath = projectBasePath+fromWebPath(data.filePath)
      if (changeQueue[absPath]) {
        changeQueue[absPath].push(data)
        return
      }

      // Push change to document (create if missing)
      pushChangeToDocument(absPath, data).fail(function (err) {
        changeQueue[absPath] = [data]
        
        buildPath(absPath, function () {
          // Empty the queue that built up
          while (changeQueue[absPath][0]) {
            pushChangeToDocument(absPath, changeQueue[absPath].shift())
          }
          delete changeQueue[absPath]
        })
      })
    }
  }
  
  function handleLostPeer(peer) {
    if (!isSyncing) return
    
    Dialogs.showModalDialog(
      '', 
      'Multihack', 
      '<p>Your connection to "'+peer.metadata.nickname+'" was lost.</p>', 
      [customButton('Ok')]
    )
  }
  
  function provideProject () {
    ProjectManager.getAllFiles().then(function (allFiles) {
      allFiles.sort(function (a, b) {
        return a.fullPath.length - b.fullPath.length
      })
      allFiles.filter(function (a) {
        return a.fullPath.indexOf(FILE_BLACKLIST) === -1
      })
      
      var size = 0
      for (var i=0; i<allFiles.length; i++) {
        ;(function (i) {
          allFiles[i].read(function (err, contents, stat) {
            if (err) return
            size+=contents.length
            if (size > MAX_FORWARDING_SIZE && remote.hostname === DEFAULT_HOSTNAME) {
              return alert('Project too large! Use a P2P connection.')
            }
            
            var filePath = FileUtils.getRelativeFilename(projectBasePath, allFiles[i].fullPath)
            knownDocs[toWebPath(filePath)] = true
            remote.createFile(toWebPath(filePath), contents)
            console.log('sent '+i+' of '+allFiles.length)
          })
        }(i))
      }
    })
  }
  
  function handleRemoteCreateFile (data) {
    handleRemoteChangeFile({
      filePath: data.filePath,
      change: {
        from: {line:0, ch:0},
        to: {line:0, ch:0},
        text: ''
      }
    })
  }
  
  function handleRemoteCreateDir (data) {
    // TODO
  }
  
  function handleRemoteDeleteFile (data) {
    var absPath = projectBasePath+fromWebPath(data.filePath)
    FileSystem.resolve(absPath, function (err, entry) {
      if (entry && entry.moveToTrash) {
        entry.moveToTrash()
        ProjectManager.refreshFileTree()
        console.log(absPath+' moved to trash')
      }
    })
  }
  
  function toWebPath (path) {
    return path[0] === '/' ? path : '/'+path
  }
  
  function fromWebPath (path) {
    return path[0] === '/' ? path.slice(1) : path
  }
  
  function customButton(text, isPrimary) {
    return {
      id: 'multihack-button-'+text.replace(/\s/g, ''),
      text: text,
      className: isPrimary ? 'primary' : ''
    }
  }

  AppInit.appReady(init)
})
