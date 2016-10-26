var log = require('../logger');

module.exports = function(file, api, opts) {
  var j = api.jscodeshift;

  var ret = j(file.source)
    .find(j.MemberExpression, {
      property: { type: 'Identifier', name: 'isArray' },
      object: { type: 'ThisExpression' }
    });

  if (opts.lint) {
    if (ret.length === 0)
      return;

    ret.forEach(function(p) {
      log({
        descr: 'this.isArray() is deprecated. Please use Array.isArray().',
        path: p.value,
        ret: ret,
        file: file
      });
    });
  } else {
    return ret.replaceWith(function(p) {
        return 'Array.isArray';
      })
      .toSource({ quote: 'single' });
  }
};
