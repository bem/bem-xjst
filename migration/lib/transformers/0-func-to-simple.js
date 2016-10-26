var log = require('../logger');

module.exports = function(file, api, opts) {
  var j = api.jscodeshift;

  var ret = j(file.source)
    .find(j.FunctionExpression)
    .filter(function(p) {
      var body = p.node.body.body;
      return body.length === 1 &&
        body[0].type === 'ReturnStatement' &&
        body[0].argument.type === 'Literal';
    });

  if (opts.lint) {
    if (ret.length === 0)
      return;

    ret.forEach(function(p) {
      log({
        descr: 'Function that returns a literal can be replaced with literal itself.',
        path: p.value,
        ret: ret,
        file: file
      });
    });
  } else {
    return ret.replaceWith(function(p) {
      return j.literal(p.node.body.body[0].argument.value);
    })
    .toSource({ quote: 'single' });
  }
};
