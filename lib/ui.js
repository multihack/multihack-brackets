/* global define, brackets, window */

define(function (require, exports, module) {
  
  var PeerGraph = require('./npm/p2p-graph')
  
  var Dialogs = brackets.getModule('widgets/Dialogs')
  var buttonHTML = require('text!./../widget/html/button.html')
  var modalHTML = require('text!./../widget/html/modal.html')
  var optionsHTML = require('text!./../widget/html/optionmodal.html')

  var EventEmitter = require('./npm/events').EventEmitter
  var inherits = require('./npm/inherits')
  
  inherits(UI, EventEmitter)
  
  function UI () {
    var self = this
  }
  
  UI.prototype.injectButton = function () {
    $('#main-toolbar .buttons').append(buttonHTML)
  }
  
  UI.prototype.getRoomAndNickname = function (cb) {
    var self = this
    
    var room = null
    var nickname = 'Guest'
    
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
    nickname = nicknameInput.value || 'Guest'
    
    document.querySelector(
      '[data-button-id="multihack-button-JoinRoom"]'
    ).addEventListener('click', function () {
      room = roomInput.value
      cb(room, nickname)
    })
  }
  
  function customButton(text, isPrimary) {
    return {
      id: 'multihack-button-'+text.replace(/\s/g, ''),
      text: text,
      className: isPrimary ? 'primary' : ''
    }
  }
  
  UI.prototype.showLostConnection = function (nickname) {
    Dialogs.showModalDialog(
      '', 
      'Multihack', 
      '<p>Your connection to "'+nickname+'" was lost.</p>', 
      [customButton('Ok')]
    )
  }
  
  UI.prototype.showModal = function (isInCall, room, peers) {
    var self = this
     
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
      self.emit('stop')
    })
    
    document.querySelector('[data-button-id="multihack-button-'+callText.replace(/\s/g, '')+'"]').addEventListener('click', function () {
      graph.destroy()
      self.emit('voiceToggle')
    })
    
    document.querySelector('[data-button-id="multihack-button-Cancel"]').addEventListener('click', function () {
      graph.destroy()
    })
  }
    
  module.exports = new UI()
  
})