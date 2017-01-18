var log = require('../logger');
var Transformer = require('../transformer');
var t = new Transformer();

module.exports = function(file, api, opts) {
  t.description = 'elemMatch is deprecated. Please use elem(\'*\').match(function() { … })';

  t.find = function(file, j) {
    return j(file.source)
    .find(j.Identifier, { name: 'elemMatch' });
  };

  t.replace = function(ret, j) {
    return ret
      .replaceWith(
          j.memberExpression(
            j.callExpression(j.identifier('elem'), [ j.literal('*') ]),
            j.identifier('match'))
      );
  };

  return t.run(file, api, opts);
};
