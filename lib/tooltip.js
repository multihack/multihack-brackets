define(function (require, exports, module) {
  
  var $el = null
  
  function create (message) {
    if ($el) $el.remove()
    
    $el = $(Mustache.render(
      require("text!../widget/html/tooltip.html"),
      { "Message": message }
    ))
    
    $el.hide()
    
    
    setTimeout(function () {
      $el.fadeOut(200, function () {
        $el.remove()
      })
    }, 4000)
    
    return $el
  }
  
  module.exports = {
    create: create
  }
})