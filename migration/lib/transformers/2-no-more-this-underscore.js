var log = require('../logger');
var Transformer = require('../transformer');
var t = new Transformer();

module.exports = function(file, api, opts) {
  t.description = 'All helpers have finally migrated to this from this._. From now on this._ will be undefined. Please read: https://github.com/bem/bem-xjst/wiki/Notable-changes-between-bem-xjst@1.x-and-bem-xjst@2.x#this_-no-more';

  t.find = function(file, j) {
    return j(file.source)
      .find(j.MemberExpression)
      .filter(function(p) {
        var node = p.node;
        var property = node.object && node.object.property;

        return property &&
          property.name === '_' &&
          node.object.object &&
          node.object.object.type === 'ThisExpression';
      });
  };

  t.replace = function(ret, j) {
    return ret.replaceWith(function(p) {
      return j.memberExpression(
        j.thisExpression(),
        j.identifier(p.node.property.name)
      );
    });
  };

  return t.run(file, api, opts);
};
