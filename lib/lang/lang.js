define(function (require, exports, module) {
   
  var translations = JSON.parse(require('text!./translations.json'))

  function Lang () {
    var self = this
    if (!(self instanceof Lang)) return new Lang()

    self.lang = brackets.app.language
    // TODO: locale support
  }

  Lang.prototype.get = function (key, data) {
    var self = this

    data = data || {}

    return Mustache.render(translations[self.lang][key], data) || Mustache.render(translations['en'][key], data)
  }

  module.exports = new Lang()
})