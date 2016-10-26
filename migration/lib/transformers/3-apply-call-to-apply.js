var log = require('../logger');

module.exports = function(file, api, opts) {
  var j = api.jscodeshift;
  var member = [];

  var ret = j(file.source)
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
        member.push(o.object.name);
      } else if (isApply(o)){
        member.push(false);
      }

      return isApply(o) || isMember(o);
    });

  if (opts.lint) {
    if (ret.length === 0)
      return;

    ret.forEach(function(p) {
      log({
        descr: 'Since v3.x apply.call(bemjson) must be apply(bemjson)',
        path: p.value,
        ret: ret,
        file: file
      });
    });
  } else {

    ret = ret.map(function(item, i) {
      return item.replace(member[i] ?
                          j.memberExpression(j.identifier(member[i]), j.identifier('apply'))
                          : j.identifier('apply'));
    });

    return ret.toSource({ quote: 'single' });
  }
};
