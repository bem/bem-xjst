module.exports = function(match, block, elem, mod, elemMod, oninit, xjstOptions, wrap, replace, extend, mode, def, content, appendContent, prependContent, attrs, addAttrs, js, addJs, mix, addMix, mods, addMods, addElemMods, elemMods, tag, cls, bem, local, applyCtx, applyNext, apply) {

var stringify = function(v) {
  var cache = [];
  return JSON.stringify(v, function(key, value) {
    if (typeof value === 'object' && value !== null) {
      if (cache.indexOf(value) !== -1) {
        // Circular reference found, discard key
        return;
      }
      cache.push(value);
    }
    return value;
  });
};

var collectMixes = function collectMixes(item, res, context) {
  res = res || [];
  if (!item)
    return res;

  context = context || {
    block: item.block,
    elem: item.elem,
    mods: item.mods,
    elemMods: item.elemMods
  };

  if (item.block || item.mods) {
    res.push({
      block: item.block || context.block,
      mods: item.mods,
      js: item.js
    });
    if (item.block)
      context = { block: item.block, mods: item.mods };
  }

  if (item.elem || (item.elemMods && context.elem)) {
    res.push({
      block: item.block || context.block,
      elem: item.elem || context.elem,
      elemMods: item.elemMods,
      js: item.js
    });
    if (item.elem)
      context = {
        block: item.block || context.block,
        mods: item.mods || context.mods,
        elem: item.elem,
        elemMods: item.elemMods
      };
  }

  if (typeof item === 'string')
    res.push({ block: item });

  if (item.mix) {
    if (!Array.isArray(item.mix)) item.mix = [ item.mix ];
    item.mix.map(function(mix) { return collectMixes(mix, res, context); });
  }

  return res;
};

var checkMixes = function checkMixes(mix, ctx, mixesFromTmpls) {
    if (mix.length) {
      var hash = {};
      mix.forEach(function(mixItem) {
        if (!mixItem.elem) {
          if (!hash[mixItem.block])
            hash[mixItem.block] = {};

          if (mixItem.mods) {
            Object.keys(mixItem.mods).forEach(function(modName) {
              var b = hash[mixItem.block];

              if (!b[modName]) {
                b[modName] = true;
              } else {
                console.warn(
                  '\nBEM-XJST WARNING: you’re trying to mix block with mods to the same block with the same mods. ' +
                  '\nctx: ' + stringify(ctx) +
                  (mixesFromTmpls ? '\nmixes from templates: ' + stringify(mixesFromTmpls) : '')
                );
              }
            });
          }
        } else {
          var key = mixItem.block + '__' + mixItem.elem;
          if (!hash[key])
            hash[key] = {};

          if (mixItem.elemMods) {
            Object.keys(mixItem.elemMods).forEach(function(modName) {
              var b = hash[key];

              if (!b[modName]) {
                b[modName] = true;
              } else {
                console.warn(
                  '\nBEM-XJST WARNING: you’re trying to mix block with mods to the same block with the same mods. ' +
                  '\nctx: ' + stringify(ctx) +
                  (mixesFromTmpls ? '\nmixes from templates: ' + stringify(mixesFromTmpls) : '')
                );
              }
            });
          }
        }
      });
    }
};

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
            stringify(ctx)
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
          stringify(ctx)
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

    if (stringify(before) !== stringify(after)) {
        console.warn(
          '\nBEM-XJST WARNING: looks like someone changed ctx.mods in BEMJSON: ' +
          stringify(ctx) +
          '\nold value of ctx.mods was: ' + stringify(before) +
          '\nnew value of ctx.mods was: ' + stringify(after) +
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
          '\nctx: ' + stringify(ctx) +
          '\nattrs: ' + stringify(attrs)
        );
    }


    if (attrs['data-bem']) {
        console.warn(
          '\nBEM-XJST WARNING: looks like you’re trying to set data-bem attribute from attrs field in BEMJSON. ' +
          'Please use js() mode for it. See documentation: https://github.com/bem/bem-xjst/blob/master/docs/en/5-templates-syntax.md#js' +
          '\nctx: ' + stringify(ctx) +
          '\nattrs: ' + stringify(attrs)
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
  }),

  def()(function() {
    var ctx = this.extend({}, this.ctx);
    var mix = collectMixes(ctx, []);

    if (ctx.mods || ctx.elemMods)
      checkMixes(mix, ctx);

    return applyNext();
  }),

  mix()(function() {
    var ctx = this.extend({}, this.ctx);
    var mixesFromTmpls = applyNext();
    var mix;

    if (!this.elem) {
      mix = collectMixes({
        block: this.block,
        mods: this.mods,
        mix: mixesFromTmpls
      }, []);
    } else {
      mix = collectMixes({
        block: this.block,
        elem: this.elem,
        elemMods: this.elemMods,
        mix: mixesFromTmpls
      }, []);
    }

    if (mixesFromTmpls && mixesFromTmpls.length)
      checkMixes(mix, ctx, mixesFromTmpls);

    return applyNext();
  }),

  // Check naming:
  def()(function() {
    var _this = this;
    var cb = this._bemxjst.classBuilder;
    var ctx = this.ctx;

    var check = function check(str) {
      if (!str)
        return;

      str = String(str);

      return str.indexOf(cb.modDelim) !== -1 ||
        str.indexOf(cb.elemDelim) !== -1;
    };

    if (check(this.block)) {
      console.warn(
        '\nBEM-XJST WARNING: wrong block name. ' +
        '\nBlock name can not contain modifier delimeter nor elem delimeter. ' +
        '\nblock: ' + this.block +
        '\nctx: ' + stringify(ctx)
      );
    }

    if (check(this.elem)) {
      console.warn(
        '\nBEM-XJST WARNING: wrong elem name. ' +
        '\nElement name can not contain modifier delimeter nor elem delimeter. ' +
        '\nelem: ' + this.elem +
        '\nctx: ' + stringify(ctx)
      );
    }

    Object.keys(_this.mods).forEach(function(modName) {
      // modName
      if (check(modName)) {
        console.warn(
          '\nBEM-XJST WARNING: wrong modifier name. ' +
          '\nModifier name can not contain modifier delimeter nor elem delimeter. ' +
          '\nmods: ' + stringify(_this.mods) +
          '\nctx: ' + stringify(ctx)
        );
      }

      // modVal
      if (check(_this.mods[modName])) {
        console.warn(
          '\nBEM-XJST WARNING: wrong modifier value. ' +
          '\nModifier value can not contain modifier delimeter nor elem delimeter. ' +
          '\nmods: ' + stringify(_this.mods) +
          '\nctx: ' + stringify(ctx)
        );
      }
    });

    // elemMods
    Object.keys(_this.elemMods).forEach(function(modName) {
      // modName
      if (check(modName)) {
        console.warn(
          '\nBEM-XJST WARNING: wrong element modifier name. ' +
          '\nModifier name can not contain modifier delimeter nor elem delimeter. ' +
          '\nelemMods: ' + stringify(_this.elemMods) +
          '\nctx: ' + stringify(ctx)
        );
      }

      // modVal
      if (check(_this.elemMods[modName])) {
        console.warn(
          '\nBEM-XJST WARNING: wrong element modifier value. ' +
          '\nModifier value can not contain modifier delimeter nor elem delimeter. ' +
          '\nelemMods: ' + stringify(_this.elemMods) +
          '\nctx: ' + stringify(ctx)
        );
      }
    });

    return applyNext();
  }),

  def()(function(node, ctx) {
    console.log(ctx);

    if (ctx.mods) {
      var mods = ctx.mods;

      Object.keys(mods).forEach(function(mod) {
        var val = mods[mod];

        if (Array.isArray(val)) {
          console.warn(
            '\nBEM-XJST WARNING: wrong modifier value. ' +
            '\nModifier value can be undefined, null, String, Number or Boolean. ' +
            '\nctx: ' + stringify(ctx)
          );
        }
      });
    }

    if (ctx.elemMods) {
      var elemMods = ctx.elemMods;

      Object.keys(elemMods).forEach(function(mod) {
        var val = elemMods[mod];

        if (Array.isArray(val)) {
          console.warn(
            '\nBEM-XJST WARNING: wrong element modifier value. ' +
            '\nModifier value can be undefined, null, String, Number or Boolean. ' +
            '\nctx: ' + stringify(ctx)
          );
        }
      });
    }

    return applyNext();
  })
);

};
