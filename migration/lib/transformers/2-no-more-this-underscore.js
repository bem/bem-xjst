var log = require('../logger');

module.exports = function(file, api, opts) {
  var j = api.jscodeshift;

  var ret = j(file.source)
    .find(j.MemberExpression)
    .filter(function(p) {
      var node = p.node;
      var property = node.object && node.object.property;

      return property &&
        property.name === '_' &&
        node.object.object &&
        node.object.object.type === 'ThisExpression';
    });

  if (opts.lint) {
    if (ret.length === 0)
      return;

    ret.forEach(function(p) {
      log({
        descr: 'All helpers have finally migrated to this from this._. From now on this._ will be undefined. Please read: https://github.com/bem/bem-xjst/wiki/Notable-changes-between-bem-xjst@1.x-and-bem-xjst@2.x#this_-no-more',
        path: p.value,
        ret: ret,
        file: file
      });
    });
  } else {
    return ret.replaceWith(function(p) {
      return j.memberExpression(
        j.thisExpression(),
        j.identifier(p.node.property.name)
      );
    })
    .toSource({ quote: 'single' });
  }
};
