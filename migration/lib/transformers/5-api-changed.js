var log = require('../logger');

module.exports = function(file, api, opts) {
  var j = api.jscodeshift;

    var ret = j(file.source)
    .find(j.CallExpression, {
      callee: { type: 'Identifier', name: 'require' },
      arguments: [ { type: 'Literal', value: 'bem-xjst' } ]
    });


  if (opts.lint) {
    if (ret.length === 0)
      return;

    ret.forEach(function(p) {
      log({
        descr: 'bem-xjst API changed: require(\'bem-xjst\') now returns two engines bemhtml and bemtree.',
        path: p.value,
        ret: ret,
        file: file
      });
    });

  } else {
    return ret
      .replaceWith(function(p) {
        var val = p.value;

        return j.memberExpression(val, j.identifier('bemhtml'))
      })
      .toSource({ quote: 'single' });
  }
};
