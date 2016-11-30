var log = require('../logger');
var Transformer = require('../transformer');
var t = new Transformer();

module.exports = function(file, api, opts) {
  t.description = 'Function that returns a literal can be replaced with literal itself.';

  t.find = function(file, j) {
    return j(file.source)
      .find(j.FunctionExpression)
      .filter(function(p) {
        var body = p.node.body.body;
        return body.length === 1 &&
          body[0].type === 'ReturnStatement' &&
          body[0].argument.type === 'Literal';
      });
  };

  t.replace = function(ret, j) {
    return ret.replaceWith(function(p) {
      return j.literal(p.node.body.body[0].argument.value);
    });
  };

  return t.run(file, api, opts);
};
