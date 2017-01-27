var log = require('../logger');
var Transformer = require('../transformer');
var t = new Transformer();

module.exports = function(file, api, opts) {
  t.description = 'Use UTF-8 symbols instead of HTML entities. If you turn on escaping this code will be broken. With non visible UTF-8 symbols like non breaking space you can leave verbose comment in code.';

  t.find = function(file, j) {
    return j(file.source)
      .find(j.Literal)
      .filter(function(p) {
        return /\&[\w\D]+;/.test(p.value.value);
      });
  };

  return t.run(file, api, opts);
};
