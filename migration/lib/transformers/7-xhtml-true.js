var log = require('../logger');

module.exports = function(file, api, opts) {
  var j = api.jscodeshift;

  var ret = j(file.source)
    .find(j.CallExpression, {
      callee: { property: { type: 'Identifier', name: 'compile' }
    }});

  if (opts.lint) {
    if (ret.length === 0)
      return;

    ret.forEach(function(p) {
      log({
        descr: 'once() is deprecated. Please use def().',
        path: p.value,
        ret: ret,
        file: file
      });
    });

  } else {

    return ret
      .replaceWith(function(p) {
        var val = p.value;
        var args = val.arguments;

        if (args.length === 1) {
          args.push(
            j.objectExpression(
              [ j.property('init', j.identifier('xhtml'), j.literal(true)) ]
          )
          );
        } else if (args.length === 2) {
          args[1].properties = args[1].properties.filter(function(p) {
            return p.key.name !== 'xhtml';
          });
          args[1].properties.push(j.property('init', j.identifier('xhtml'), j.literal(true)))
        }

        return j.callExpression(
          j.memberExpression(j.identifier(val.callee.object.name), j.identifier('compile')),
          args)
      })
      .toSource({ quote: 'single' });

  }
};
