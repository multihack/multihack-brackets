/* jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/* global define, $, brackets, window, Mustache */

define(function (require, exports, module) {
  
  var DEFAULT_HOSTNAME = 'https://quiet-shelf-57463.herokuapp.com'
  var FILE_BLACKLIST = ['node_modules'] // blacklist for paths that will not be synced
  
  var AppInit = brackets.getModule('utils/AppInit')
  var PreferencesManager = brackets.getModule('preferences/PreferencesManager')
  var EditorManager = brackets.getModule('editor/EditorManager')
  var DocumentManager = brackets.getModule('document/DocumentManager')
  var ProjectManager = brackets.getModule('project/ProjectManager')
  var FileUtils = brackets.getModule('file/FileUtils')
  var Dialogs = brackets.getModule('widgets/Dialogs')
  var ExtensionUtils = brackets.getModule('utils/ExtensionUtils')
  var Mustache = brackets.getModule("thirdparty/mustache/mustache") 
        
  var prefs = PreferencesManager.getExtensionPrefs('multihack-brackets')

  var RemoteManager = require('./lib/npm/multihack-core')
  var EditorWrapper = require('./lib/editor')
  var FileSystemWrapper = require('./lib/filesystem')
  var UI = require('./lib/ui')
  var PeerGraph = require('./lib/npm/p2p-graph')
  var Voice = require('./lib/voice')

  var remote = null
  var room = null
  var nickname = null
  
  var isSyncing = false
  var isInCall = false
  
  var currentEditor = null
  var muteNextEvent = false
  var ignoreNextChange = false
  
  var projectBasePath = null
  var documentRelativePath = null
  
  ExtensionUtils.loadStyleSheet(module, 'widget/css/main.css')
  
  UI.injectButton()
  
  var button = document.querySelector('#edc-multihack-btn')
  
  button.addEventListener('click', function () {
    if (isSyncing) {
      UI.openModal()
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
    // FileSystemWrapper.on('createFile', handleLocalDeleteFile)
    // FileSystemWrapper.on('renameFile', handleLocalDeleteFile)
    FileSystemWrapper.on('deleteFile', handleLocalDeleteFile)
    EditorWrapper.on('changeFile', handleLocalChangeFile)
    EditorManager.on('changeSelection', handleLocalSelection)
    ProjectManager.on('projectOpen', handleStop) // Stop sync on project open
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
    UI.getRoomAndNickname(function (room, nickname) {
      if (!room) return
      
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
      
      // setup remote listeners
      remote.voice.on('join', function () {
        button.className = 'active voice'
        isInCall = true
      })
      remote.once('ready', function () {
        FileSystemWrapper.getProject(function (filePath, content) {
          remote.createFile(toWebPath(filePath), content)
        })
      })
      remote.on('changeFile', handleRemoteChangeFile)
      remote.on('changeSelection', handleRemoteSelection)
      remote.on('createFile', handleRemoteCreateFile)
      remote.on('deleteFile', handleRemoteDeleteFile)
      //remote.on('renameFile', handleRemoteRename)
      remote.on('lostPeer', handleLostPeer)
      //remote.on('gotPeer', handleLostPeer)
      //remote.on('createDir', handleRemoteCreateDir)

      isSyncing = true
      button.className='active'
      
      EditorWrapper.setupListeners()
      FileSystemWrapper.setupListeners()

      console.log('MH started')
    })
  }
  
  function handleStop () {
    if (remote) {
      remote.destroy()
      remote = null
    }
    
    isSyncing = false
    button.className=''
    
    EditorWrapper.removeListeners()
    FileSystemWrapper.removeListeners()
    
    console.log('MH stopped')
  }
  
  /* Local Listeners */
  
  function handleLocalDeleteFile (filePath) {
    remote.deleteFile(toWebPath(filePath))
  }
  
  function handleLocalCreateFile (filePath, content) {
    remote.createFile(toWebPath(filePath), change)
  }
  
  function handleLocalSelection (filePath, selection) {
    remote.changeSelection({
      filePath: toWebPath(filePath),
      change: selection
    })
  }
  
  function handleLocalChangeFile (filePath, change) {
    remote.changeFile(toWebPath(filePath), change)
  }
  
  /* Remote listeners */
  
  function handleRemoteChangeFile (data) {
    EditorWrapper.change(fromWebPath(data.filePath), data.change)
  }
  
  function handleRemoteSelection (data) {
    EditorWrapper.highlight(fromWebPath(data.filePath), data.change)
  }
  
  function handleRemoteCreateFile (data) {
    FileSystemWrapper.createFile(fromWebPath(data.filePath), data.content)
  }
  
  function handleRemoteDeleteFile (data) {
    FileSystemWrapper.deleteFile(fromWebPath(data.filePath)
  }
  
  function handleLostPeer(peer) {
    if (!isSyncing) return
    
    UI.showLostConnection(peer.metadata.nickname)
  }
  
  /* Utilities to convert path formats */
  
  function toWebPath (path) {
    return path[0] === '/' ? path : '/'+path
  }
  
  function fromWebPath (path) {
    return path[0] === '/' ? path.slice(1) : path
  }

  AppInit.appReady(init)
})