/* jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/* global define, $, brackets, window, Mustache */

define(function (require, exports, module) {
  
  var START_COMMAND_ID = 'rationalcoding.multihack.start'
  var STOP_COMMAND_ID = 'rationalcoding.multihack.stop'
  var DEFAULT_HOSTNAME = 'https://quiet-shelf-57463.herokuapp.com'
  
  var AppInit = brackets.getModule('utils/AppInit')
  var CommandManager = brackets.getModule('command/CommandManager')
  var Menus = brackets.getModule('command/Menus')
  var PreferencesManager = brackets.getModule('preferences/PreferencesManager')
  var EditorManager = brackets.getModule('editor/EditorManager')
  var DocumentManager = brackets.getModule('document/DocumentManager')
  var ProjectManager = brackets.getModule('project/ProjectManager')
  var FileSystem = brackets.getModule('filesystem/FileSystem')
  var FileUtils = brackets.getModule('file/FileUtils')
  var Dialogs = brackets.getModule("widgets/Dialogs")
        
  var fileMenu = Menus.getMenu(Menus.AppMenuBar.FILE_MENU)
  var prefs = PreferencesManager.getExtensionPrefs('multihack-brackets')

  var RemoteManager = require('lib/remote')

  var remote = null
  var isSyncing = false
  var currentEditor = null
  var editorMutexLock = false
  var projectBasePath = null
  var documentRelativePath = null

  CommandManager.register('Start MultiHack', START_COMMAND_ID, handleStart)
  CommandManager.register('Stop MultiHack', STOP_COMMAND_ID, handleStop)

  function init () {
    setupPreferences()
    addMenuItem()
    setupEventListeners()
  }

  function setupPreferences () {
    prefs.definePreference('hostname', 'string', DEFAULT_HOSTNAME)
    prefs.save()
  }

  function addMenuItem () {
    fileMenu.addMenuItem(START_COMMAND_ID)
  }

  function setupEventListeners () {
    projectBasePath = ProjectManager.getProjectRoot().fullPath
    ProjectManager.on('projectOpen', handleStop) // Stop sync on project open
    EditorManager.on('activeEditorChange', handleLocalChange)
    DocumentManager.on('pathDeleted', handleLocalDeleteFile)
  }

  function handleStart () {
    console.log('hs')
    Dialogs.showModalDialog(
      '', 
      'Multihack', 
      '<p>Enter the ID for the room you want to join.</p><input id="multihack-room" placeholder="roomID" type="text"></input>', 
      [customButton('Join Room', true), customButton('Cancel')]
    )
    document.querySelector('#multihack-room').focus()
    
    document.querySelector('[data-button-id="multihack-button-JoinRoom"]').addEventListener('click', function () {  
      var room = document.querySelector('#multihack-room').value
      if (!room) return
      
      console.log(room)
      remote = new RemoteManager(prefs.get('hostname'), room)

      remote.on('change', handleRemoteChange)
      remote.on('deleteFile', handleRemoteDeleteFile)

      fileMenu.removeMenuItem(START_COMMAND_ID)
      fileMenu.addMenuItem(STOP_COMMAND_ID)
      isSyncing = true

      console.log('MH started')
    })
  }

  function handleStop () {
    if (remote) {
      remote.destroy()
      remote = null
    }
    
    fileMenu.removeMenuItem(STOP_COMMAND_ID)
    fileMenu.addMenuItem(START_COMMAND_ID)
    isSyncing = false
    
    console.log('MH stopped')
  }

  function handleLocalChange ($event, newEditor, oldEditor) {
    if (oldEditor) {
      oldEditor._codeMirror.off('change', sendLocalChange)
    }

    if (newEditor) {
      currentEditor = newEditor
      documentRelativePath = FileUtils.getRelativeFilename(projectBasePath, newEditor.document.file._path)
      newEditor._codeMirror.on('change', sendLocalChange)
    }
  }
  
  function sendLocalChange (cm, change) {
    if (editorMutexLock || !isSyncing) return
    remote.change(documentRelativePath, change) // Send change to remote peers
  }
  
  function handleLocalDeleteFile (e, fullPath) {
    var relativePath = FileUtils.getRelativeFilename(projectBasePath, fullPath)
    remote.deleteFile(relativePath)
  }
  
  function handleRemoteChange (data) {
    if (data.filePath === documentRelativePath) {
      editorMutexLock = true
      currentEditor._codeMirror.replaceRange(data.change.text, data.change.from, data.change.to)
      editorMutexLock = false
    } else {
      // TODO: Batch changes
      console.log(projectBasePath+data.filePath)

      DocumentManager.getDocumentForPath(projectBasePath+data.filePath).then(function (doc) {
        doc.replaceRange(data.change.text, data.change.from, data.change.to)
        doc.addRef()
      })
    }
  }
  
  function handleRemoteDeleteFile (data) {
    var absPath = projectBasePath+data.filePath
    FileSystem.resolve(absPath, function (entry) {
      if (entry && entry.moveToTrash) {
        entry.moveToTrash()
      }
    })
  }
  
  // File creation sync is handled by changes being made to non-existent files
  
  function customButton(text, isPrimary) {
    return {
      id: 'multihack-button-'+text.replace(/\s/g, ''),
      text: text,
      className: isPrimary ? 'primary' : ''
    }
  }

  AppInit.appReady(init)
})
