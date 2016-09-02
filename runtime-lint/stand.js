var bemxjst = require('../');
var bemhtml = bemxjst.bemhtml;

var templates = bemhtml.compile(function() {
  block('b').content()('yay');
   block('mods-changes').def()(function() {
    this.ctx.mods.one = 2;
    return applyNext();
  });
   block('mods-changes2').def()(function() {
    this.ctx.mods.three = 3;
    return applyNext();
  });
}, { runtimeLint: true });

var html = templates.apply([
  { block: 'b' },

  // boolean attributes
  { block: 'b', attrs: { one: true, two: 'true' } },

  // mods for elem
  { block: 'c', elem: 'e', mods: { test: 'opa' } },

  // changes in ctx.mods
  { block: 'mods-changes', mods: { one: '1', two: '2' } },

  // additions in ctx.mods
  { block: 'mods-changes2', mods: { one: '1', two: '2' } }
]);

console.log(html);
