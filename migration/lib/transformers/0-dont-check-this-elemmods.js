var log = require('../logger');
var Transformer = require('../transformer');
var t = new Transformer();

module.exports = function(file, api, opts) {
  t.description = 'this.elemMods always exists. You don’t need to check it.';

  t.find = function(file, j) {
    return j(file.source)
      .find(j.LogicalExpression, {
        left: {
          type: 'MemberExpression',
          object: { type: 'ThisExpression' },
          property: { name: 'elemMods' }
        }
      });
  };

  t.replace = function(ret, j) {
    return ret.map(function(item) {
      return item.replace(item.value.right);
    });
  };

  return t.run(file, api, opts);
};
