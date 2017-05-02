define(function (require, exports, module) {
  
  var create = function (message) {
    var $el = $(Mustache.render(
      require("text!../widget/html/tooltip.html"),
      { "Message": message}))
    
    setTimeout(function () {
      $el.remove()
    }, 4000)
    return $el
  }
  
  module.exports = {
    create: create
  }
})