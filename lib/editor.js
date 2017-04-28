define(function (require, exports, module) {
  
  var ProjectManager = brackets.getModule('project/ProjectManager')
  var EditorManager = brackets.getModule('editor/EditorManager')
  var FileUtils = brackets.getModule('file/FileUtils')
  
  var EventEmitter = require('events').EventEmitter
  var inherits = require('inherits')
  
  inherits(EditorWrapper, EventEmitter)

  function EditorWrapper () {
    var self = this

    self.currentEditor = null
    
    self._ignoreNextChange = false
    self._muteEvent = false
    self.currentFilePath = null
    
    self._onActiveEditorChange = self._onActiveEditorChange.bind(self)
    self._onDelta = self._onDelta.bind(self)
    self._onSelection = self._onSelection.bind(self)
  }
  
  EditorWrapper.prototype.setupListeners = function () {
    var self = this
    
    self.projectPath = ProjectManager.getProjectRoot().fullPath
    
    EditorManager.on('activeEditorChange', self._onActiveEditorChange)
  }
  
  EditorWrapper.prototype.removeListeners = function () {
    var self = this
    
    EditorManager.off('activeEditorChange', self._onActiveEditorChange)
    self.currentEditor._codeMirror.off('change', self._onDelta)
    self.currentEditor._codeMirror.off('beforeSelectionChange', self._onSelection)
  }
  
  EditorWrapper.prototype.highlight = function (filePath, selection) {
    var self = this
    
    if (filePath !== self.currentFilePath) return
    
    self.currentEditor._codeMirror.getAllMarks().forEach(function (mark) {
      mark.clear()
    })

    selection.ranges.forEach(function (range) {
      self.currentEditor._codeMirror.markText(range.head, range.anchor, {
        className: 'remoteSelection'
      })
    })
  }
  
  EditorWrapper.prototype.change = function (filePath, change, content) {
    var self = this  
    
    if (relativePath) === documentRelativePath) {
    
      if (self._ignoreNextChange) {
        self._ignoreNextChange = false
        return
      }
      self._muteEvent = true
      
      if (setValue) {
        console.log('set value')
        self.currentEditor._codeMirror.setValue(content)
      } else {
        console.log('replacerange')
        self.currentEditor._codeMirror.replaceRange(change.text, change.from, change.to)
      }
    } else {
      var absPath = self.currentFilePath+filePath
      FilesystemWrapper.change(absPath, change)
    }
  }
  
  EditorWrapper.prototype.open = function () {
    var self = this
    // TODO
  }
  
  EditorWrapper.prototype.close = function () {
    var self = this
    // TODO
  }
  
  EditorWrapper.prototype._onActiveEditorChange = function ($event, newEditor, oldEditor) {
    var self = this
    
    if (self.currentEditor) {
      self.currentEditor._codeMirror.off('change', self._onDelta)
      self.currentEditor._codeMirror.off('beforeSelectionChange', self._onSelection)
    }

    if (newEditor) {
      self.currentEditor = newEditor
      self.currentFilePath = FileUtils.getRelativeFilename(
        self.projectPath,
        self.currentEditor.document.file.fullPath
      )
      self.currentEditor._codeMirror.on('change', self._onDelta)
      self.currentEditor._codeMirror.on('beforeSelectionChange', self._onSelection)
    }
  }
  
  EditorWrapper.prototype._onDelta = function (change) {
    var self = this
    
    if (muteNextEvent) {
      muteNextEvent = false
      return
    }
    ignoreNextChange = true
    
    self.emit('changeFile', self.currentFilePath, change)
  }
  
  EditorWrapper.prototype._onSelection = function (selection) {
    var self = this
    
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
    
    self.emit('changeSelection', self.currentFilePath, {
      ranges: ranges
    })
  }
  
  module.exports = new EditorWrapper()
})