var log = require('../logger');
var Transformer = require('../transformer');

module.exports = function(file, api, opts) {
  Transformer.prototype.init = function() {
    this.member = [];
  };

  var t = new Transformer();
  t.description = 'Since v3.x apply.call(bemjson) must be apply(bemjson)';

  t.find = function(file, j) {
    var transformer = this;

    return j(file.source)
      .find(j.MemberExpression, {
        property: { type: 'Identifier', name: 'call' }
      })
      .filter(function(p) {
        var isApply = function(o) {
          return o.type === 'Identifier' && o.name === 'apply'
        };
        var isMember = function(o) {
          return o.type === 'MemberExpression' && isApply(o.property);
        }

        var o = p.value.object;

        if (isMember(o)) {
          transformer.member.push(o.object.name);
        } else if (isApply(o)){
          transformer.member.push(false);
        }

        return isApply(o) || isMember(o);
      });
  };

  t.replace = function(ret, j) {
    var transformer = this;

    return ret.map(function(item, i) {
      return item.replace(transformer.member[i] ?
                          j.memberExpression(
                            j.identifier(transformer.member[i]),
                            j.identifier('apply')
                          )
                          : j.identifier('apply'));
    });
  };

  return t.run(file, api, opts);
};
