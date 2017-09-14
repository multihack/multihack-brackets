/* global define, brackets, window */

define(function (require, exports, module) {
  var AppInit = brackets.getModule('utils/AppInit')
  var EditorManager = brackets.getModule('editor/EditorManager')
  var ProjectManager = brackets.getModule('project/ProjectManager')
  var ExtensionUtils = brackets.getModule('utils/ExtensionUtils')

  var PreferencesManager = brackets.getModule('preferences/PreferencesManager')
  var prefs = PreferencesManager.getExtensionPrefs('multihack-brackets')
  var DEFAULT_HOSTNAME = 'https://quiet-shelf-57463.herokuapp.com'
  var DEFAULT_ROOM = '$%#NONE/RANDOM#%$'
  var DEFAULT_REMOTE_SELECTION_COLOR = '#3f5d38'
  var DEFAULT_REMOTE_CARET_COLOR = '#7fb971'

  var RemoteManager = require('./lib/npm/multihack-core')
  var EditorWrapper = require('./lib/editor')
  var FileSystemWrapper = require('./lib/filesystem')
  var UI = require('./lib/ui')(prefs)
  var Voice = require('./lib/voice')

  var remote = null

  var isSyncing = false
  var isInCall = false

  ExtensionUtils.loadStyleSheet(module, 'widget/css/main.css')

  UI.injectButton()
  UI.on('voiceToggle', handleVoiceToggle)
  UI.on('stop', handleStop)

  var button = document.querySelector('#edc-multihack-btn')

  button.addEventListener('click', function () {
    console.log('click')
    if (isSyncing) {
      UI.openModal(isInCall, remote)
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
    prefs.definePreference('lastRoom', 'string', DEFAULT_ROOM)
    prefs.definePreference('remoteSelectionColor', 'string', DEFAULT_REMOTE_SELECTION_COLOR)
    prefs.definePreference('remoteCaretColor', 'string', DEFAULT_REMOTE_CARET_COLOR)
    prefs.save()
    
    ExtensionUtils.addEmbeddedStyleSheet(
      '.remoteSelection { background-color: ' + prefs.get('remoteSelectionColor')+'; }' +
      '.remoteCaret { background-color: ' + prefs.get('remoteCaretColor') + '; }'
    )
  }

  function setupEventListeners () {
    FileSystemWrapper.on('createFile', handleLocalCreateFile)
    FileSystemWrapper.on('renameFile', handleLocalRenameFile)
    FileSystemWrapper.on('deleteFile', handleLocalDeleteFile)
    
    EditorWrapper.on('changeFile', handleLocalChangeFile)
    EditorWrapper.on('changeSelection', handleLocalSelection)
    
    ProjectManager.on('projectOpen', handleStop) // Stop sync on project open
  }

  function handleVoiceToggle () {
    if (isInCall) {
      handleVoiceLeave()
    } else {
      handleVoiceJoin()
    }
  }

  function handleVoiceJoin () {
    if (!remote.voice) return
    remote.voice.join()
  }

  function handleVoiceLeave () {
    if (!remote.voice) return
    remote.voice.leave()
    isInCall = false
    button.className = 'active'
  }

  function handleStart () {
    console.log('handleStart')
    UI.getRoomAndNickname(function (room, nickname) {
      console.log(room, nickname)
      if (!room) return

      remote = new RemoteManager({
        hostname: prefs.get('hostname'),
        room: room,
        nickname: nickname,
        wrtc: null,
        voice: Voice
      })
      remote.posFromIndex = function (filePath, index, cb) {
        EditorWrapper.posFromIndex(fromWebPath(filePath), index, cb)
      }

      // setup remote listeners
      remote.once('voice', function () {
        console.log('voice')
        remote.voice.on('join', function () {
          console.log('voice join')
          button.className = 'active voice'
          isInCall = true
        })
      })

      remote.once('ready', function () {
        console.log('yjs ready')
        FileSystemWrapper.getProject(function (filePath, content, status) {
          debugger;
          UI.showSyncProgress(button, status)
          handleLocalCreateFile(toWebPath(filePath), content)
        })
      })
      remote.on('changeFile', handleRemoteChangeFile)
      remote.on('changeSelection', handleRemoteSelection)
      
      remote.on('createFile', handleRemoteCreateFile)
      remote.on('createDir', handleRemoteCreateDir)
      remote.on('deleteFile', handleRemoteDeleteFile)
      
      remote.on('lostPeer', handleLostPeer)
      remote.on('gotPeer', handleGotPeer)

      isSyncing = true
      button.className = 'active'

      EditorWrapper.setupListeners()
      FileSystemWrapper.setupListeners()

      console.log('MH started')
    })
  }

  function handleStop () {
    isSyncing = false
    button.className = ''
    
    if (remote) {
      console.log(remote)
      remote.destroy()
      remote = null
    }

    EditorWrapper.removeListeners()
    FileSystemWrapper.removeListeners()

    console.log('MH stopped')
  }

  /* Local Listeners */

  function handleLocalSelection (filePath, selection) {
    console.log('local selection')
    remote.changeSelection({
      filePath: toWebPath(filePath),
      change: selection
    })
  }
  
  function handleLocalChangeFile (filePath, change) {
    console.log('local change')
    console.log(filePath, change)
    remote.changeFile(toWebPath(filePath), change)
  }

  function handleLocalCreateFile (filePath, content) {
    console.log('local create file')
    // destroy any useless save messages
    remote.createFile(toWebPath(filePath), content)
  }
  
  function handleLocalCreateDir (path) {
    console.log('local create dir')
    // TODO remote.createDir(path)
  }
  
  function handleLocalRenameFile (oldPath, newPath) {
    console.log('local rename file')
    // TODO remote.renameFile(toWebPath(filePath), toWebPath(newPath))
  }

  function handleLocalDeleteFile (filePath) {
    console.log('local delete file')
    remote.deleteFile(toWebPath(filePath))
  }

  /* Remote listeners */

  function handleRemoteChangeFile (data) {
    console.log('remote change', FileSystemWrapper._mutex)
    EditorWrapper.change(fromWebPath(data.filePath), data.change)
  }

  function handleRemoteSelection (selections) {
    console.log('remote seleciton')
    EditorWrapper.highlight(selections)
  }

  function handleRemoteCreateFile (data) {
    console.log('remote create file')
    EditorWrapper.createFile(fromWebPath(data.filePath), data.content)
  }
  
  function handleRemoteCreateDir (data) {
    console.log('remote create dir')
    EditorWrapper.createDirectory(fromWebPath(data.filePath))
  }
  
  function handleRemoteDeleteFile (data) {
    console.log('remote delete file')
    EditorWrapper.deleteFile(fromWebPath(data.filePath))
  }

  function handleLostPeer (peer) {
    if (!isSyncing) return

    UI.showLostConnection(button, peer.metadata.nickname)
  }
  
  function handleGotPeer (peer) {
    if (!isSyncing) return
    // TODO
  }

  /* Utilities to convert path formats */

  function toWebPath (path) {
    return path[0] === '/' ? path : '/' + path
  }

  function fromWebPath (path) {
    return path[0] === '/' ? path.slice(1) : path
  }
  
  function noop () {}

  AppInit.appReady(init)
})
