var log = require('../logger');

module.exports = function(file, api, opts) {
  var j = api.jscodeshift;

  var ret = j(file.source)
    .find(j.Literal)
    .filter(function(p) {
      var arg = p.value.arguments;

      if (typeof p.value.rawValue === 'number') {
        var callee = p.parentPath &&
          p.parentPath.parentPath &&
          p.parentPath.parentPath.value &&
          p.parentPath.parentPath.value.callee;

        if (!callee) {
          return false;
        }

        if (callee.property && callee.property.type === 'Identifier' &&
          (callee.property.name === 'mod' || callee.property.name === 'elemMod')) {
          callee = callee.property;
        }

        return callee.name === 'mod' || callee.name === 'elemMod';
      }

      return false;
    });

    if (opts.lint) {
      if (ret.length === 0)
        return;

      ret.forEach(function(p) {
        log({
          descr: 'Modifier value must be a string type',
          path: p.value,
          ret: ret,
          file: file
        });
      });
    } else {
      return ret.replaceWith(function(p) {
        return j.literal(p.value.rawValue.toString());
      })
      .toSource({ quote: 'single' });
    }
};
