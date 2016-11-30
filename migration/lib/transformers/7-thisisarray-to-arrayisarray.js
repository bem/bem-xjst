var log = require('../logger');
var Transformer = require('../transformer');
var t = new Transformer();

module.exports = function(file, api, opts) {
  t.description = 'this.isArray() is deprecated. Please use Array.isArray().';

  t.find = function(file, j) {
    return j(file.source)
      .find(j.MemberExpression, {
        property: { type: 'Identifier', name: 'isArray' },
        object: { type: 'ThisExpression' }
      });
  };

  t.replace = function(ret, j) {
    return ret.replaceWith(function(p) {
      return 'Array.isArray';
    });
  };

  return t.run(file, api, opts);
};
