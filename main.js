/* jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/* global define, brackets, window */

define(function (require, exports, module) {
  var DEFAULT_HOSTNAME = 'https://quiet-shelf-57463.herokuapp.com'

  var AppInit = brackets.getModule('utils/AppInit')
  var PreferencesManager = brackets.getModule('preferences/PreferencesManager')
  var EditorManager = brackets.getModule('editor/EditorManager')
  var ProjectManager = brackets.getModule('project/ProjectManager')
  var ExtensionUtils = brackets.getModule('utils/ExtensionUtils')

  var prefs = PreferencesManager.getExtensionPrefs('multihack-brackets')

  var RemoteManager = require('./lib/npm/multihack-core')
  var EditorWrapper = require('./lib/editor')
  var FileSystemWrapper = require('./lib/filesystem')
  var UI = require('./lib/ui')
  var Voice = require('./lib/voice')

  var remote = null

  var isSyncing = false
  var isInCall = false

  ExtensionUtils.loadStyleSheet(module, 'widget/css/main.css')

  UI.injectButton()
  UI.on('voiceToggle', handleVoiceToggle)

  var button = document.querySelector('#edc-multihack-btn')

  button.addEventListener('click', function () {
    console.log('click')
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
    FileSystemWrapper.on('createFile', handleLocalCreateFile)
    FileSystemWrapper.on('renameFile', handleLocalDeleteFile)
    FileSystemWrapper.on('deleteFile', handleLocalDeleteFile)
    EditorWrapper.on('changeFile', handleLocalChangeFile)
    EditorManager.on('changeSelection', handleLocalSelection)
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
        hostname: 'http://localhost:6011', // TODO: prefs.get('hostname'),
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
        FileSystemWrapper.getProject(function (filePath, content) {
          console.log('got project')
          remote.createFile(toWebPath(filePath), content)
        })
      })
      remote.on('changeFile', handleRemoteChangeFile)
      remote.on('changeSelection', handleRemoteSelection)
      remote.on('createFile', handleRemoteCreateFile)
      remote.on('deleteFile', handleRemoteDeleteFile)
      // remote.on('renameFile', handleRemoteRename)
      remote.on('lostPeer', handleLostPeer)
      // remote.on('gotPeer', handleLostPeer)
      // remote.on('createDir', handleRemoteCreateDir)

      isSyncing = true
      button.className = 'active'

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
    button.className = ''

    EditorWrapper.removeListeners()
    FileSystemWrapper.removeListeners()

    console.log('MH stopped')
  }

  /* Local Listeners */

  function handleLocalChangeFile (filePath, change) {
    console.log('local change')
    remote.changeFile(toWebPath(filePath), change)
  }

  function handleLocalSelection (filePath, selection) {
    console.log('local selection')
    remote.changeSelection({
      filePath: toWebPath(filePath),
      change: selection
    })
  }

  function handleLocalCreateFile (filePath, content) {
    console.log('local create file')
    remote.createFile(toWebPath(filePath), content)
  }

  function handleLocalDeleteFile (filePath) {
    console.log('local delete file')
    remote.deleteFile(toWebPath(filePath))
  }

  /* Remote listeners */

  function handleRemoteChangeFile (data) {
    console.log('remote change')
    EditorWrapper.change(fromWebPath(data.filePath), data.change)
  }

  function handleRemoteSelection (data) {
    console.log('remote seleciton')
    EditorWrapper.highlight(fromWebPath(data.filePath), data.change)
  }

  function handleRemoteCreateFile (data) {
    console.log('remote create file')
    FileSystemWrapper.createFile(fromWebPath(data.filePath), data.content)
  }

  function handleRemoteDeleteFile (data) {
    console.log('remote delete file')
    FileSystemWrapper.deleteFile(fromWebPath(data.filePath))
  }

  function handleLostPeer (peer) {
    if (!isSyncing) return

    UI.showLostConnection(peer.metadata.nickname)
  }

  /* Utilities to convert path formats */

  function toWebPath (path) {
    return path[0] === '/' ? path : '/' + path
  }

  function fromWebPath (path) {
    return path[0] === '/' ? path.slice(1) : path
  }

  AppInit.appReady(init)
})
