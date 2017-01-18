var log = require('../logger');
var Transformer = require('../transformer');
var t = new Transformer();
var get = require('lodash.get');

module.exports = function(file, api, opts) {
  t.description = 'def() mode must return something.';

  t.find = function(file, j) {
    return j(file.source)
      .find(j.CallExpression, { callee: { callee: { property: { name: 'def', type: 'Identifier' } } } })
      .find(j.FunctionExpression)
      .filter(function(p) {
        //if (get(p, 'parentPath.parentPath.value.callee.callee.property.name') === 'def')
          //return false;

        var functionBody = p.node.body.body;
        var noReturn = function(item) {
          return item.type === 'ReturnStatement';
        };

        return functionBody.filter(noReturn).length === 0;
      });
  };

  t.replace = function(ret, j) {
    return ret.replaceWith(function(p) {
        var body = p.node.body.body;
        var len = body.length;
        var b = body[len - 1];

        if (b.type === 'ExpressionStatement' &&
            get(b, 'expression.callee.name') === 'applyCtx') {
              body[len - 1] = (j.returnStatement(b.expression));
        } else {
            body.push(j.returnStatement(j.callExpression(j.identifier('applyNext'), [])));
        }

        return j.functionExpression(p.node.id, [], p.node.body)
      });
  };

  return t.run(file, api, opts);
};
