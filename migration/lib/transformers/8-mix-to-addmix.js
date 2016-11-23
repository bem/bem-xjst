var log = require('../logger');

module.exports = function(file, api, opts) {
  var j = api.jscodeshift;

  var ret = j(file.source)
    .find(j.CallExpression, { callee: { type: 'Identifier', name: 'mix' } });

  if (opts.lint) {
    if (ret.length === 0)
      return;

    ret.forEach(function(p) {
      log({
        descr: 'From v8.x you should use addMix() instead of mix()',
        path: p.value,
        ret: ret,
        file: file
      });
    });
  } else {
    return ret
      .replaceWith(function(p) { return j.callExpression(j.identifier('addMix'), []); })
      .toSource({ quote: 'single' });
  }
};