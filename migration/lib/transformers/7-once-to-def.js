var log = require('../logger');
var Transformer = require('../transformer');
var t = new Transformer();

module.exports = function(file, api, opts) {
  t.description = 'once() is deprecated. Please use def().';

  t.find = function(file, j) {
    return j(file.source)
      .find(j.MemberExpression, {
        property: { type: 'Identifier' },
        object: { callee: { type: 'Identifier', name: 'block' }}
      })
      .find(j.Identifier, { name: 'once' });
  };

  t.replace = function(ret, j) {
    return ret.replaceWith(function(p) { return j.identifier('def'); });
  };

  return t.run(file, api, opts);
};
