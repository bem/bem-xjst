var log = require('../logger');

module.exports = function(file, api, opts) {
  var j = api.jscodeshift;

  var ret = j(file.source)
    .find(j.CallExpression, { callee: { type: 'Identifier', name: 'attrs' } });

  if (opts.lint) {
    if (ret.length === 0)
      return;

    ret.forEach(function(p) {
      log({
        descr: 'From v8.x you should use addAttrs() instead of attrs()',
        path: p.value,
        ret: ret,
        file: file
      });
    });
  } else {
    return ret
      .replaceWith(function(p) { return j.callExpression(j.identifier('addAttrs'), []); })
      .toSource({ quote: 'single' });
  }
};
