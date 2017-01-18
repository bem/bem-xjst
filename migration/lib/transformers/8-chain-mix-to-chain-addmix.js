var log = require('../logger');
var Transformer = require('../transformer');
var t = new Transformer();

module.exports = function(file, api, opts) {
  t.description = 'From v8.x you should use addMix() instead of mix()';

  t.find = function(file, j) {
    return j(file.source)
      .find(j.MemberExpression, {
        property: { type: 'Identifier' },
        object: { callee: { type: 'Identifier', name: 'block' }}
      })
      .find(j.Identifier, { name: 'mix' });
  };

  t.replace = function(ret, j) {
    return ret.replaceWith(function(p) {
      return j.identifier('addMix');
    });
  };

  return t.run(file, api, opts);
};
