var log = require('../logger');
var Transformer = require('../transformer');
var t = new Transformer();

module.exports = function(file, api, opts) {
  t.description = 'We find definition of empty mode. Empty  mode(\'\') is no longer supported. Please read: https://github.com/bem/bem-xjst/wiki/Notable-changes-between-bem-xjst@1.x-and-bem-xjst@2.x#user-content-mode-no-more';

  t.find = function(file, j) {
    return j(file.source)
      .find(j.CallExpression,
            { callee: {
              type: 'CallExpression',
              arguments: [ { type: 'Literal', value: '' } ]
            } });
  };

  t.replace = function(ret, j) {
    return ret
      .replaceWith(function(p) {
        return j.callExpression(
          j.callExpression(j.identifier('mode'),
                           [ j.literal('custom-mode') ]),
                           p.node.arguments);
      });
  };

  return t.run(file, api, opts);
};
