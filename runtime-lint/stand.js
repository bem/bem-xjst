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

  block('class-attr-tmpl').attrs()(function() {
    return { class: 'wrong' };
  });

  block('databem-attr-tmpl').attrs()(function() {
    return { 'data-bem': 'wrong' };
  });

  block('mix-mod-tmpl').mix()(function() {
    return [ applyNext(), { mods: { color: 'green' } } ];
  });

  block('mix-elemmod-tmpl').elem('e').mix()(function() {
    return [ applyNext(), { elemMods: { color: 'green' } } ];
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
  { block: 'mods-changes2', mods: { one: '1', two: '2' } },

  // class in attrs
  { block: 'class-attr-bemjson', attrs: { id: 'test', class: 'jquery' } },
  { block: 'class-attr-tmpl' },

  // 'data-bem' in attrs
  { block: 'databem-attr-bemjson', attrs: { 'data-bem': { block: 'a', js: true } } },
  { block: 'databem-attr-tmpl' },

  // mix the same mod
  { block: 'mix-mod', mods: { m: 1 }, mix: { mods: { m: 2 } } },
  { block: 'mix-mod', mix: [ { mods: { type: 'test' } }, { mods: { type: 'shmest' } } ] },
  // mix the same mod from templates
  { block: 'mix-mod-tmpl', mods: { color: 'red' } },

  { block: 'mix-elemmod', elem: 'e', elemMods: { m: 1 }, mix: { elemMods: { m: 2 } } },
  { block: 'mix-elemmod', elem: 'e', mix: [ { elemMods: { type: 'test' } }, { elemMods: { type: 'shmest' } } ] },
  // mix the same mod from templates
  { block: 'mix-elemmod-tmpl', elem: 'e', elemMods: { color: 'red' } },

  // Wrong names
  { block: 'bad__name' },
  { block: 'bad_name' },
  { block: 'b', elem: 'e_e' },
  { block: 'b', elem: 'e__e' },
  { block: 'b', mods: { mod_name: 'bad' } },
  { block: 'b', mods: { mod__name: 'bad' } },
  { block: 'b', mods: { modName: 'very_bad' } },
  { block: 'b', mods: { modName: 'very__bad' } },

  { block: 'b', elem: 'e', elemMods: { mod_name: 'bad' } },
  { block: 'b', elem: 'e', elemMods: { mod__name: 'bad' } },
  { block: 'b', elem: 'e', elemMods: { modName: 'very_bad' } },
  { block: 'b', elem: 'e', elemMods: { modName: 'very__bad' } },

  // Wrong mods/elemMods types
  { block: 'b', mods: { test: [ 'a', 'b' ] } },
  { block: 'b', elem: 'e', elemMods: { test: [ 'a', 'b' ] } }
]);

console.log(html);
