var log = require('../logger');
var get = require('lodash.get');
var Transformer = require('../transformer');
var t = new Transformer();

module.exports = function(file, api, opts) {
  t.description = 'Modifier value must be a string type';

  t.find = function(file, j) {
    return j(file.source)
      .find(j.Literal)
      .filter(function(p) {
        var arg = p.value.arguments;

        if (typeof p.value.rawValue === 'number') {
          var callee = get(p, 'parentPath.parentPath.value.callee');

          if (!callee)
            return false;

          if (callee.property && callee.property.type === 'Identifier' &&
            (callee.property.name === 'mod' || callee.property.name === 'elemMod')) {
            callee = callee.property;
          }

          return callee.name === 'mod' || callee.name === 'elemMod';
        }

        return false;
      });
  };

  t.replace = function(ret, j) {
    return ret.replaceWith(function(p) {
      return j.literal(p.value.rawValue.toString());
    });
  };

  return t.run(file, api, opts);
};
