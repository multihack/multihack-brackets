/* global define, window */

define(function (require, exports, module) {
  var getusermedia = require('./npm/getusermedia')

  function VoiceCall (socket, client, room) {
    var self = this
    if (!(self instanceof VoiceCall)) return new VoiceCall()

    self.room = room
    self.ready = false
    self.stream = null
    self.peers = []
    self.socket = socket
    self.client = client
    self._handlers = {}

    socket.on('voice-discover', function (peerIDs) {
      console.log('voice peers', peerIDs)

      if (self.stream) {
        for (var i = 0; i < peerIDs.length; i++) {
          self.client.connect(peerIDs[0], {
            stream: self.stream,
            answerConstraints: {
              offerToReceiveAudio: true,
              offerToReceiveVideo: true
            },
            offerConstraints: {
              offerToReceiveAudio: true,
              offerToReceiveVideo: true
            }
          }, {
            voice: true
          })
        }
      }
    })

    self.client.on('request', function (request) {
      if (!request.metadata.voice) return
      if (!self.stream) return

      request.accept({
        stream: self.stream,
        answerConstraints: {
          offerToReceiveAudio: true,
          offerToReceiveVideo: true
        },
        offerConstraints: {
          offerToReceiveAudio: true,
          offerToReceiveVideo: true
        }
      }, {
        voice: true
      })
    })

    self.client.on('peer', function (peer) {
      if (!peer.metadata.voice) return
      self.peers.push(peer)

      var audio = document.createElement('audio')
      peer.on('stream', function (stream) {
        self._emit('join')
        console.log('stream')
        audio.setAttribute('autoplay', true)
        audio.setAttribute('src', window.URL.createObjectURL(stream))
        document.body.appendChild(audio)
      })

      peer.on('close', function () {
        document.body.removeChild(audio)
        self._removePeer(peer)
      })
    })
  }

  VoiceCall.prototype._removePeer = function (peer) {
    var self = this

    for (var i = 0; i < self.peers.length; i++) {
      if (self.peers[i].id === peer.id) {
        self.peers.splice(i, 1)
        return
      }
    }
  }

  VoiceCall.prototype.leave = function () {
    var self = this
    if (!self.ready || !self.stream) return

    console.log('voice leave')

    while (self.peers[0]) {
      self.peers[0].destroy()
      self.peers.shift()
    }
    var audioEls = document.querySelectorAll('audio')
    for (var i = 0; i < audioEls.length; i++) {
      document.body.removeChild(audioEls[i])
    }
    self.stream = null
    self.socket.emit('voice-leave')
  }

  VoiceCall.prototype.join = function () {
    var self = this
    if (!self.ready || self.stream) return

    console.log('voice join')

    getusermedia(function (err, stream) {
      if (err) {
        window.alert('No microphone access. Launch brackets with `brackets --args --enable-media-stream`')
        return console.error(err)
      }
      self.stream = stream
      self.socket.emit('voice-join')
    })
  }

  VoiceCall.prototype.toggle = function () {
    var self = this

    if (!self.stream) {
      self.join()
    } else {
      self.leave()
    }
  }

  VoiceCall.prototype._emit = function (event, data) {
    var self = this
    var fns = self._handlers[event] || []
    var fn
    var i

    for (i = 0; i < fns.length; i++) {
      fn = fns[i]
      if (fn && typeof (fn) === 'function') {
        fn(data)
      }
    }
  }

  VoiceCall.prototype.on = function (event, handler) {
    var self = this

    if (!self._handlers[event]) {
      self._handlers[event] = []
    }

    self._handlers[event].push(handler)
  }

  module.exports = VoiceCall
})
