var log = require('../logger');
var get = require('lodash.get');
var Transformer = require('../transformer');
var t = new Transformer();

module.exports = function(file, api, opts) {
  t.description = 'Use function generator instead (Example: `function() { return []; }`. ' +
      'See docs: https://github.com/bem/bem-xjst/wiki/Notable-changes-' +
      'between-bem-xjst@1.x-and-bem-xjst@2.x#static-objects-shortcuts-in-mix-content-etc'

  t.find = function(file, j) {
    return j(file.source)
      .find(j.ArrayExpression)
      .filter(function(p) {
        var arg = p.value.arguments;
        var callee = get(p, 'parentPath.parentPath.value.callee.callee');

        if (! callee)
          return false;

        callee = callee.name || (callee.property && callee.property.name);

        return [
          'js',
          'mix',
          'content',
          'def',
          'addMix',
          'appendContent',
          'prependContent'
        ].indexOf(callee) !== -1;
      });
  };

  t.replace = function(ret, j) {
    return ret.replaceWith(function(p) {
        return j.functionExpression(
          j.identifier(''),
          [],
          j.blockStatement([j.returnStatement(p.value)])
        );
      });
  };

  return t.run(file, api, opts);
};
