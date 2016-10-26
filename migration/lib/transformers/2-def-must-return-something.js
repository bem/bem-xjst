var log = require('../logger');

module.exports = function(file, api, opts) {
  var j = api.jscodeshift;

  var ret = j(file.source)
    .find(j.CallExpression, { callee: { callee: { property: { name: 'def', type: 'Identifier' } } } })
    .find(j.FunctionExpression)
    .filter(function(p) {
      var functionBody = p.node.body.body;
      var noReturn = function(item) {
        return item.type === 'ReturnStatement';
      };

      return functionBody.filter(noReturn).length === 0;
    });

    if (opts.lint) {
      if (ret.length === 0)
        return;

      ret.forEach(function(p) {
        log({
          descr: 'def() mode must return something.',
          path: p.value,
          ret: ret,
          file: file
        });
      });
    } else {
      return ret.replaceWith(function(p) {
        p.node.body.body.push(j.returnStatement(j.callExpression(j.identifier('applyNext'), [])));

        return j.functionExpression(p.node.id, [], p.node.body)
      })
      .toSource({ quote: 'single' });
    }
};
