// true/false in attributes
block('*')(

  def()(function() {
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
  }),

  // mods with elem (instead of elemMods)
  def()(function() {
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
  }),

  // Changes in ctx.mods
  def()(function() {
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
  }),

  mode('check-attrs')(function() {
    var ctx = this.ctx;
    var attrs = this.check;

    if (attrs.class) {
        console.warn(
          '\nBEM-XJST WARNING: looks like you’re trying to set HTML class from attrs field in BEMJSON. ' +
          'Please use cls() mode for it. See documentation: https://github.com/bem/bem-xjst/blob/master/docs/en/5-templates-syntax.md#cls' +
          '\nctx: ' + JSON.stringify(ctx) +
          '\nattrs: ' + JSON.stringify(attrs)
        );
    }


    if (attrs['data-bem']) {
        console.warn(
          '\nBEM-XJST WARNING: looks like you’re trying to set data-bem attribute from attrs field in BEMJSON. ' +
          'Please use js() mode for it. See documentation: https://github.com/bem/bem-xjst/blob/master/docs/en/5-templates-syntax.md#js' +
          '\nctx: ' + JSON.stringify(ctx) +
          '\nattrs: ' + JSON.stringify(attrs)
        );
    }
  }),

  attrs()(function() {
    var attrs = applyNext();
    if (attrs)
      apply('check-attrs', { check: attrs });

    return attrs;
  }),

  def()(function() {
    if (this.ctx.attrs)
      apply('check-attrs', { check: this.ctx.attrs });

    return applyNext();
  })
);
