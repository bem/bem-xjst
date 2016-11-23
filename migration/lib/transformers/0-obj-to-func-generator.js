var log = require('../logger');

module.exports = function(file, api, opts) {
  var j = api.jscodeshift;

  var ret = j(file.source)
    .find(j.ObjectExpression)
    .filter(function(p) {
      var arg = p.value.arguments;

      var callee = p.parentPath &&
        p.parentPath.parentPath &&
        p.parentPath.parentPath.value &&
        p.parentPath.parentPath.value.callee &&
        p.parentPath.parentPath.value.callee.callee;

      if (! callee)
        return false;

      callee = callee.name || (callee.property && callee.property.name);

      return [
        'attrs',
        'addAttrs',
        'js',
        'addJs',
        'mix',
        'addMix',
        'mods',
        'addMods',
        'elemMods',
        'addElemMods'
      ].indexOf(callee) !== -1;
    });

  if (opts.lint) {
    if (ret.length === 0)
      return;

    ret.forEach(function(p) {
      log({
        descr: 'Use function generator instead (Example: `function() { return { … }; }`. ' +
          'See docs: https://github.com/bem/bem-xjst/wiki/Notable-changes-' +
          'between-bem-xjst@1.x-and-bem-xjst@2.x#static-objects-shortcuts-in-mix-content-etc',
        path: p.value,
        ret: ret,
        file: file
      });
    });

  } else {

    return ret.replaceWith(function(p) {
        return j.functionExpression(
          j.identifier(''),
          [],
          j.blockStatement([j.returnStatement(p.value)])
        );
      })
      .toSource({ quote: 'single' });

  }
};
