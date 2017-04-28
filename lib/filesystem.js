/* global define, brackets, window */

define(function (require, exports, module) {
  var FILE_BLACKLIST = ['node_modules'] // blacklist for paths that will not be synced

  var ProjectManager = brackets.getModule('project/ProjectManager')
  var FileSystem = brackets.getModule('filesystem/FileSystem')
  var DocumentManager = brackets.getModule('document/DocumentManager')
  var FileUtils = brackets.getModule('file/FileUtils')

  var EditorWrapper = require('./editor')

  var EventEmitter = require('./npm/events').EventEmitter
  var inherits = require('./npm/inherits')

  inherits(FilesystemWrapper, EventEmitter)

  function FilesystemWrapper () {
    var self = this

    self.changeQueues = {}

    self.getProject = null
    self._onDelete = self._onDelete.bind(self)
    self._onRename = self._onRename.bind(self)
  }

  FilesystemWrapper.prototype.getProject = function (cb) {
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
            if (err) return

            var filePath = FileUtils.getRelativeFilename(
              EditorWrapper.projectPath,
              allFiles[i].fullPath
            )
            console.log('created', filePath, contents)
            cb(filePath, contents)
            console.log('sent ' + i + ' of ' + allFiles.length)
          })
        }(i))
      }
    })
  }

  FilesystemWrapper.prototype.setupListeners = function () {
    var self = this

    EditorWrapper.projectPath = ProjectManager.getProjectRoot().fullPath
    DocumentManager.on('pathDeleted', self._onDelete)
    FileSystem.on('rename', self._onRename)
  }

  FilesystemWrapper.prototype.removeListeners = function () {
    var self = this

    DocumentManager.off('pathDeleted', self._onDelete)
    FileSystem.off('rename', self._onRename)
  }

  FilesystemWrapper.prototype.deleteFile = function (absPath) {
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

  FilesystemWrapper.prototype.createFile = function () {
    // var self = this
    // TODO
  }

  FilesystemWrapper.prototype.change = function (absPath, change) {
    var self = this

    if (self.changeQueues[absPath]) {
      self.changeQueues[absPath].push(change)
      return
    }

    // Push change to document (create if missing)
    self._pushChangeToDocument(absPath, change).fail(function (err) {
      if (err) return
      self.changeQueues[absPath] = [change]

      self._buildPath(absPath, function () {
        // Empty the queue that built up
        while (self.changeQueues[absPath][0]) {
          self._pushChangeToDocument(absPath, self.changeQueues[absPath].shift())
        }
        delete self.changeQueues[absPath]
      })
    })
  }

  FilesystemWrapper.prototype._onDelete = function (e, absPath) {
    var self = this

    var relativePath = FileUtils.getRelativeFilename(self.projectPath, absPath)
    if (relativePath.slice(-1) === '/') { // Brackets adds a extra '/' to directory paths
      relativePath = relativePath.slice(0, -1)
    }
    ProjectManager.refreshFileTree()

    self.emit('deleteFile', relativePath)
  }

  FilesystemWrapper.prototype._onRename = function (e, oldPath, newPath) {
    var self = this

    var oldFilePath = FileUtils.getRelativeFilename(EditorWrapper.currentFilePath, oldPath)
    var newFilePath = FileUtils.getRelativeFilename(EditorWrapper.currentFilePath, newPath)

    if (oldFilePath === EditorWrapper.currentFilePath) {
      EditorWrapper.recomputePath() // TODO: Is this even needed?
    }

    self.emit('renameFile', oldFilePath, newFilePath)
  }

  FilesystemWrapper.prototype._pushChangeToDocument = function (absPath, data, setValue) {
    // var self = this

    return DocumentManager.getDocumentForPath(absPath).then(function (doc) {
      if (setValue) {
        console.log('set value')
        doc.setValue(data.content)
      } else {
        console.log('replace range')
        doc.replaceRange(data.change.text, data.change.from, data.change.to)
      }
    })
  }

  FilesystemWrapper.prototype._buildPath = function (absPath, cb) {
    // Build a path
    var split = absPath.split('/')
    for (var i = 1; i < split.length; i++) {
      var curPath = split.slice(0, -(split.length - i)).join('/')
      var name = split[i]
      if (!ProjectManager.isWithinProject(curPath + '/' + name)) continue

      var isDir = i !== (split.length - 1)
      ;(function (curPath, name, isDir) {
        FileSystem.resolve(curPath + '/' + name, function (err) {
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

  module.exports = new FilesystemWrapper()
})
