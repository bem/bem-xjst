var log = require('../logger');

module.exports = function(file, api, opts) {
  var j = api.jscodeshift;

  var ret = j(file.source)
    .find(j.Identifier, { name: 'elemMatch' });

  if (opts.lint) {
    if (ret.length === 0)
      return;

    ret.forEach(function(p) {
      log({
        descr: 'elemMatch is deprecated. Please use elem(\'*\').match(function() { … })',
        path: p.value,
        ret: ret,
        file: file
      });
    });
  } else {

    return ret
      .replaceWith(
          j.memberExpression(
            j.callExpression(j.identifier('elem'), [ j.literal('*') ]),
            j.identifier('match')
          )
      )
      .toSource({ quote: 'single' });
  }
};
