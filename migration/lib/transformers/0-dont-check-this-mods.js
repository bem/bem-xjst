var log = require('../logger');

module.exports = function(file, api, opts) {
  var j = api.jscodeshift;

  var ret = j(file.source)
    .find(j.LogicalExpression, {
      left: {
        type: 'MemberExpression',
        object: { type: 'ThisExpression' },
        property: { name: 'mods' }
      }
    });

  if (opts.lint) {
    if (ret.length === 0)
      return;

    ret.forEach(function(p) {
      log({
        descr: 'this.mods always exists. You don’t need to check it.',
        path: p.value,
        ret: ret,
        file: file
      });
    });
  } else {
     ret = ret.map(function(item) { return item.replace(item.value.right); });

    return ret.toSource();
  }
};
