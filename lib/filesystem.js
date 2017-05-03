/* global define, brackets, window */

define(function (require, exports, module) {
  var FILE_BLACKLIST = ['node_modules'] // blacklist for paths that will not be synced

  var ProjectManager = brackets.getModule('project/ProjectManager')
  var FileSystem = brackets.getModule('filesystem/FileSystem')
  var DocumentManager = brackets.getModule('document/DocumentManager')
  var CommandManager = brackets.getModule('command/CommandManager')
  var Commands = brackets.getModule('command/Commands')
  var FileUtils = brackets.getModule('file/FileUtils')

  var EditorWrapper = require('./editor')

  var EventEmitter = require('./npm/events').EventEmitter
  var inherits = require('./npm/inherits')

  inherits(FileSystemWrapper, EventEmitter)

  function FileSystemWrapper () {
    var self = this

    self.changeQueues = {}

    self._onDelete = self._onDelete.bind(self)
    self._onRename = self._onRename.bind(self)
  }

  FileSystemWrapper.prototype.getProject = function (cb) {
    ProjectManager.getAllFiles().then(function (allFiles) {
      allFiles.sort(function (a, b) {
        return a.fullPath.length - b.fullPath.length
      })
      allFiles.filter(function (a) {
        return a.fullPath.indexOf(FILE_BLACKLIST) === -1
      })

      for (var i = 0; i < allFiles.length; i++) {
        ;(function (i) {
          allFiles[i].read(function (err, contents, stat) {
            var filePath = FileUtils.getRelativeFilename(
              EditorWrapper.projectPath,
              allFiles[i].fullPath
            )
            console.log('created', filePath)
            cb(filePath, contents)
            console.log('sent ' + i + ' of ' + allFiles.length)
          })
        }(i))
      }
    })
  }

  FileSystemWrapper.prototype.setupListeners = function () {
    var self = this

    EditorWrapper.projectPath = ProjectManager.getProjectRoot().fullPath
    DocumentManager.on('pathDeleted', self._onDelete)
    FileSystem.on('rename', self._onRename)
  }

  FileSystemWrapper.prototype.removeListeners = function () {
    var self = this

    DocumentManager.off('pathDeleted', self._onDelete)
    FileSystem.off('rename', self._onRename)
  }

  FileSystemWrapper.prototype.deleteFile = function (absPath) {
    // var self = this

    FileSystem.resolve(absPath, function (err, entry) {
      if (err) return
      if (entry && entry.moveToTrash) {
        entry.moveToTrash()
        ProjectManager.refreshFileTree()
        console.log(absPath + ' moved to trash')
      }
    })
  }

  FileSystemWrapper.prototype.createFile = function (absPath, content) {
    var self = this
    
    var change = {
      content: content
    }
    self._callFunctionOnDoc('setValue', absPath, change, true)
  }
  
  FileSystemWrapper.prototype.createDirectory = function (absPath) {
    var self = this
    
    self._buildPath(absPath, true, noop, true)
  }

  FileSystemWrapper.prototype.change = function (absPath, change) {
    var self = this
    
    self._callFunctionOnDoc('replaceRange', absPath, change, true)
  }
  
  FileSystemWrapper.prototype._callFunctionOnDoc = function (fn, absPath, change, saveAfter) {
    var self = this
    
    change.fn = fn
    change.saveAfter = saveAfter

    if (self.changeQueues[absPath]) {
      self.changeQueues[absPath].push(change)
      return
    }

    // Push change to document (create if missing)
    self._pushChangeToDocument(absPath, change).fail(function (err) {
      self.changeQueues[absPath] = [change]

      self._buildPath(absPath, false, function () {
        // Empty the queue that built up
        while (self.changeQueues[absPath][0]) {
          self._pushChangeToDocument(absPath, self.changeQueues[absPath].shift())
        }
        delete self.changeQueues[absPath]
      })
    })
  }

  FileSystemWrapper.prototype._onDelete = function (e, absPath) {
    var self = this

    var relativePath = FileUtils.getRelativeFilename(EditorWrapper.projectPath, absPath)
    if (relativePath.slice(-1) === '/') { // Brackets adds a extra '/' to directory paths
      relativePath = relativePath.slice(0, -1)
    }
    ProjectManager.refreshFileTree()

    self.emit('deleteFile', relativePath)
  }

  FileSystemWrapper.prototype._onRename = function (e, oldPath, newPath) {
    var self = this

    var oldFilePath = FileUtils.getRelativeFilename(EditorWrapper.currentFilePath, oldPath)
    var newFilePath = FileUtils.getRelativeFilename(EditorWrapper.currentFilePath, newPath)

    if (oldFilePath === EditorWrapper.currentFilePath) {
      EditorWrapper.recomputePath() // TODO: Is this even needed?
    }

    self.emit('renameFile', oldFilePath, newFilePath)
  }

  FileSystemWrapper.prototype._pushChangeToDocument = function (absPath, change, saveAfter) {
    var self = this

    return DocumentManager.getDocumentForPath(absPath).then(function (doc) {
      console.log(change.fn)
      if (change.fn === 'setValue') {
        doc._ensureMasterEditor()
        doc._masterEditor._codeMirror.setValue(change.content)
      } else if (change.fn === 'replaceRange') {
        doc.replaceRange(change.text, change.from, change.to)
      } else {
        console.error('Multihack: Unexpected Codemirror operation.', change.fn)
      }
      
      if (change.saveAfter) {
        CommandManager.execute(Commands.FILE_SAVE, {doc: doc}).then(noop).fail(noop)
        ProjectManager.refreshFileTree()
      }
    })
  }

  FileSystemWrapper.prototype._buildPath = function (absPath, makeDir, cb) {
    // Build a path
    var split = absPath.split('/')
    for (var i = 1; i < split.length; i++) {
      var curPath = split.slice(0, -(split.length - i)).join('/')
      var name = split[i]
      if (!ProjectManager.isWithinProject(curPath + '/' + name)) continue

      var isLast = i === (split.length - 1)
      var isDir = !isLast || makeDir
      ;(function (curPath, name, isLast, isDir) {
        FileSystem.resolve(curPath + '/' + name, function (err) {
          if (err) {
            // HACK: Workaround for adobe/brackets#13267
            if (isDir) name = name + '/'

            ProjectManager.createNewItem(curPath, name, true).then(function () {
              if (isLast) {
                ProjectManager.refreshFileTree()
                cb() // we are done when we reach the file at the end of the path
              }
            })
          } else if (isLast) {
            ProjectManager.refreshFileTree()
            cb()
          }
        })
      }(curPath, name, isLast, isDir))
    }
  }
  
  function noop () {}

  module.exports = new FileSystemWrapper()
})
