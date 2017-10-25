/* global define, brackets, window */

define(function (require, exports, module) {
  
  var lang = require('./lang/lang')
  var lg = lang.get.bind(lang)
  
  var PeerGraph = require('./npm/p2p-graph')
  var Mustache = brackets.getModule("thirdparty/mustache/mustache")
  
  var Dialogs = brackets.getModule('widgets/Dialogs')
  var buttonHTML = require('text!./../widget/html/button.html')
  var modalHTML = Mustache.render(require('text!./../widget/html/modal.html'), {
    choose_room_prompt: lg('choose_room_prompt'),
    room_placeholder: lg('room_placeholder'),
    nickname_prompt: lg('nickname_prompt'),
    nickname_placeholder: lg('nickname_placeholder'),
    optional: lg('optional')
  })
  var optionsHTML = require('text!./../widget/html/optionmodal.html')
  var Tooltip = require('./tooltip')

  var EventEmitter = require('./npm/events').EventEmitter
  var inherits = require('./npm/inherits')
  
  var prefs = null
  var DEFAULT_ROOM = '$%#NONE/RANDOM#%$'
  var roomID = ''
  
  inherits(UI, EventEmitter)
  
  function UI (newPrefs) {
    var self = this
    
    prefs = newPrefs
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
      [customButton(lg('choose_room_title'), true), customButton(lg('cancel'))]
    )
    
    var roomInput = document.querySelector('#multihack-room')
    var lastRoom = prefs.get('lastRoom')
    if (!lastRoom || lastRoom === DEFAULT_ROOM) {
      lastRoom = Math.random().toString(36).substr(2, 20)
    }
    roomInput.value = lastRoom
    roomInput.select()
    
    var nicknameInput = document.querySelector('#multihack-nickname')
    
    document.querySelector(
      '[data-button-id="multihack-button-JoinRoom"]'
    ).addEventListener('click', function () {
      nickname = nicknameInput.value || lg('default_nickname')
      room = roomInput.value
      if (room) prefs.set('lastRoom', room)
      roomID = room
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
  
  UI.prototype.showAlert = function (button, alert) {
    var $tooltip = Tooltip.create(lg(alert))
    
    $tooltip.css('top', $(button).offset().top + "px")
    $tooltip.css('right', $('#main-toolbar').width())
    
    $tooltip.show()
      
    $(document.body).prepend($tooltip)
  }
  
  UI.prototype.showLostConnection = function (button, nickname) {
    var $tooltip = Tooltip.create(lg('sync', {nickname:nickname}))
    
    $tooltip.css('top', $(button).offset().top + "px")
    $tooltip.css('right', $('#main-toolbar').width())
    
    $tooltip.show()
      
    $(document.body).prepend($tooltip)
  }
  
  UI.prototype.showSyncProgress = function (button, status) {
    var $tooltip = Tooltip.create(lg('sync_progress', status))
    
    $tooltip.css('top', $(button).offset().top + "px")
    $tooltip.css('right', $('#main-toolbar').width())
    
    $tooltip.show()
      
    $(document.body).prepend($tooltip)
  }
  
  UI.prototype.openModal = function (isInCall, remote) {
    var self = this
    
    var room = remote.room
    var peers = remote.peers
    console.log(peers)
     
    var callText = isInCall ? lg('leave_call') : lg('join_call')

    Dialogs.showModalDialog(
      '', 
      'Multihack', 
      Mustache.render(optionsHTML, {
        room_lang: lg('room'),
        room: roomID
      }), 
      [
        customButton(lg('leave_room'), true),
        customButton(callText),
        customButton(lg('cancel'))
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
      name: lg('you')
    })
    
    var proxyID = remote.nop2p ? 'Server' : 'Me'
    
    if (remote.mustForward || remote.nop2p) {
      graph.add({
        id: 'Server',
        me: false,
        name: lg('server')
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
    
  module.exports = function (prefs) {
    return new UI(prefs)
  }
})