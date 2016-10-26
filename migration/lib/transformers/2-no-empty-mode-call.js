var log = require('../logger');

module.exports = function(file, api, opts) {
  var j = api.jscodeshift;

  var ret = j(file.source)
      .find(j.CallExpression, { callee: { type: 'Identifier', name: 'apply' } })
      .filter(function(p) {
        return p.value.arguments.filter(function(arg) {
          return arg.value === '';
        }).length !== 0;
    });

  if (opts.lint) {
    if (ret.length === 0)
      return;

    ret.forEach(function(p) {
      log({
        descr: 'We find a call of ampty mode. Empty mode mode(\'\') is no longer supported. Please read: https://github.com/bem/bem-xjst/wiki/Notable-changes-between-bem-xjst@1.x-and-bem-xjst@2.x#user-content-mode-no-more',
        path: p.value,
        ret: ret,
        file: file
      });
    });
  } else {
    return ret
      .replaceWith(function(p) {
        var args = p.node.arguments;
        args[0] = j.literal('custom-mode');

        return j.callExpression(j.identifier('apply'), args);
      })
      .toSource({ quote: 'single' });
  }

};
