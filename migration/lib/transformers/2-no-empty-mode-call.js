var log = require('../logger');
var Transformer = require('../transformer');
var t = new Transformer();

module.exports = function(file, api, opts) {
  t.description = 'We find a call of empty mode. Empty mode mode(\'\') is no longer supported. Please read: https://github.com/bem/bem-xjst/wiki/Notable-changes-between-bem-xjst@1.x-and-bem-xjst@2.x#user-content-mode-no-more';

  t.find = function(file, j) {
    return j(file.source)
        .find(j.CallExpression, { callee: { type: 'Identifier', name: 'apply' } })
        .filter(function(p) {
          return p.value.arguments.filter(function(arg) {
            return arg.value === '';
          }).length !== 0;
      });
  };

  t.replace = function(ret, j) {
    return ret
      .replaceWith(function(p) {
        var args = p.node.arguments;
        args[0] = j.literal('custom-mode');

        return j.callExpression(j.identifier('apply'), args);
      });
  };

  return t.run(file, api, opts);
};
