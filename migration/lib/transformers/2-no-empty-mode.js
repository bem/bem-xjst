var log = require('../logger');

module.exports = function(file, api, opts) {
  var j = api.jscodeshift;

  var ret = j(file.source)
    .find(j.CallExpression,
          { callee: { type: 'CallExpression', arguments: [ { type: 'Literal', value: '' } ] } });

  if (opts.lint) {
    if (ret.length === 0)
      return;

    ret.forEach(function(p) {
      log({
        descr: 'We find defenition of empty mode. Empty mode mode(\'\') is no longer supported. Please read: https://github.com/bem/bem-xjst/wiki/Notable-changes-between-bem-xjst@1.x-and-bem-xjst@2.x#user-content-mode-no-more',
        path: p.value,
        ret: ret,
        file: file
      });
    });
  } else {
    return ret.replaceWith(function(p) {
        return j.callExpression(
          j.callExpression(j.identifier('mode'), [ j.literal('custom-mode') ]), p.node.arguments);
    })
    .toSource({ quote: 'single' });
  }
};
