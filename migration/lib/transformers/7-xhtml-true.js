var log = require('../logger');
var Transformer = require('../transformer');
var t = new Transformer();

module.exports = function(file, api, opts) {
  t.description = 'For backward capability use option `xhtml:true`'

  t.find = function(file, j) {
    return j(file.source)
      .find(j.CallExpression, {
        callee: { property: { type: 'Identifier', name: 'compile' }
      }});
  };

  t.replace = function(ret, j) {
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
      });
  };

  return t.run(file, api, opts);
};
