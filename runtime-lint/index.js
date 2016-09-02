// true/false in attributes
block('*').def()(function() {
  var ret = applyNext();

  var ctx = this.ctx;
  var attrs = ctx.attrs;
  if (attrs) {
    Object.keys(attrs).forEach(function(key) {
      if (typeof attrs[key] === 'boolean') {
        console.warn(
          '\nBEM-XJST WARNING: boolean attribute value: ' +
          attrs[key] +
          ' in BEMJSON: ' +
          JSON.stringify(ctx)
        );
        console.warn('Notice what bem-xjst behaviour changed: https://github.com/bem/bem-xjst/releases/tag/v4.3.3');
      }
    });
  }

  return ret;
});

// mods with elem (instead of elemMods)
block('*').def()(function() {
  var ret = applyNext();

  var ctx = this.ctx;
  if (ctx.mods && ctx.elem && !ctx.elemMods) {
      console.warn(
        '\nBEM-XJST WARNING: mods for elem in BEMJSON: ' +
        JSON.stringify(ctx)
      );
      console.warn('Notice what bem-xjst behaviour changed: https://github.com/bem/bem-xjst/releases/tag/v5.0.0');
  }

  return ret;
});

// Changes in ctx.mods
block('*').def()(function() {
  var ret;
  var extend = this.extend;

  var getMods = function(mods) { return extend({}, mods); };

  var ctx = this.ctx;
  var mods = ctx.mods;

  var before = getMods(mods);
  ret = applyNext();
  var after = getMods(mods);

  if (JSON.stringify(before) !== JSON.stringify(after)) {
      console.warn(
        '\nBEM-XJST WARNING: looks like someone changed ctx.mods in BEMJSON: ' +
        JSON.stringify(ctx) +
        '\nold value of ctx.mods was: ' + JSON.stringify(before) +
        '\nnew value of ctx.mods was: ' + JSON.stringify(after) +
        '\nNotice that you should change this.mods instead of this.ctx.mods in templates'
      );
  }

  return ret;
});
