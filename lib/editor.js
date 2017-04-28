/* global define, brackets, window */

define(function (require, exports, module) {
  var FileSystemWrapper = require('./filesystem')

  var ProjectManager = brackets.getModule('project/ProjectManager')
  var EditorManager = brackets.getModule('editor/EditorManager')
  var FileUtils = brackets.getModule('file/FileUtils')
  var DocumentManager = brackets.getModule('document/DocumentManager')

  var EventEmitter = require('./npm/events').EventEmitter
  var inherits = require('./npm/inherits')

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
    self.recomputePath()
  }

  EditorWrapper.prototype.removeListeners = function () {
    var self = this

    EditorManager.off('activeEditorChange', self._onActiveEditorChange)
    if (!self.currentEditor) return
    self.currentEditor._codeMirror.off('change', self._onDelta)
    self.currentEditor._codeMirror.off('beforeSelectionChange', self._onSelection)
  }

  EditorWrapper.prototype.recomputePath = function () {
    var self = this

    self.currentEditor = EditorManager.getActiveEditor()
    if (!self.currentEditor) return
    self.currentFilePath = FileUtils.getRelativeFilename(
      self.projectPath,
      self.currentEditor.document.file.fullPath
    )
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

    if (filePath === self.currentFilePath) {
      if (self._ignoreNextChange) {
        self._ignoreNextChange = false
        return
      }
      self._muteEvent = true

      self.currentEditor._codeMirror.replaceRange(change.text, change.from, change.to)
    } else {
      var absPath = self.projectPath + filePath
      FileSystemWrapper.change(absPath, change)
    }
  }

  EditorWrapper.prototype.open = function () {
    // var self = this
    // TODO: Needed?
  }

  EditorWrapper.prototype.close = function () {
    // var self = this
    // TODO: Needed?
  }

  EditorWrapper.prototype.posFromIndex = function (filePath, index, cb) {
    var self = this

    if (filePath === self.currentFilePath) {
      cb(self.currentEditor._codeMirror.posFromIndex(index))
    } else {
      var absPath = self.projectPath + filePath
      DocumentManager.getDocumentForPath(absPath).then(function (doc) {
        doc._ensureMasterEditor()
        cb(doc._masterEditor._codeMirror.posFromIndex(index))
      })
    }
  }

  EditorWrapper.prototype._onActiveEditorChange = function ($event, newEditor, oldEditor) {
    var self = this

    if (self.currentEditor) {
      self.currentEditor._codeMirror.off('change', self._onDelta)
      self.currentEditor._codeMirror.off('beforeSelectionChange', self._onSelection)
    }

    if (newEditor) {
      self.recomputePath()
      self.currentEditor._codeMirror.on('change', self._onDelta)
      self.currentEditor._codeMirror.on('beforeSelectionChange', self._onSelection)
    }
  }

  EditorWrapper.prototype._onDelta = function (change) {
    var self = this

    if (self._muteNextEvent) {
      self._muteNextEvent = false
      return
    }
    self._ignoreNextChange = true

    self.emit('changeFile', self.currentFilePath, change)
  }

  EditorWrapper.prototype._onSelection = function (selection) {
    var self = this

    var ranges = selection.ranges.filter(function (range) {
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
