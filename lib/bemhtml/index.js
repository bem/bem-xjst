/**
 * @class Entity
 * @param {BEMXJST} bemxjst
 * @param {String} block
 * @param {String} elem
 * @param {Array} templates
 */
function Entity(bemxjst) {
  this.bemxjst = bemxjst;

  this.jsClass = null;

  // "Fast modes"
  this.tag = new Match(this, 'tag');
  this.attrs = new Match(this, 'attrs');

  BemxjstEntity.apply(this, arguments);
}

inherits(Entity, BemxjstEntity);

Entity.prototype.init = function(block, elem) {
  this.block = block;
  this.elem = elem;

  // Class for jsParams
  this.jsClass = this.bemxjst.classBuilder.build(this.block, this.elem);
};

Entity.prototype._initRest = function(key) {
  if (key === 'default') {
    this.rest[key] = this.def;
  } else if (key === 'tag' ||
    key === 'attrs' ||
    key === 'content') {
    this.rest[key] = this[key];
  } else {
    if (!this.rest.hasOwnProperty(key))
      this.rest[key] = new Match(this, key);
  }
};

Entity.prototype.defaultBody = function(context) {
  return this.bemxjst.render(context,
                             this,
                             this.tag.exec(context),

                             context.ctx.js !== false ?
                               (this.rest.js ?
                                  this.rest.js.exec(context) :
                                  context.ctx.js) :
                               undefined,

                             this.rest.bem ?
                               this.rest.bem.exec(context) :
                               context.ctx.bem,

                             this.rest.cls ?
                               this.rest.cls.exec(context) :
                               context.ctx.cls,

                             this.rest.mix ?
                               this.rest.mix.exec(context) :
                               context.ctx.mix,

                             this.attrs.exec(context),
                             this.content.exec(context));
};

function BEMHTML(options) {
  BEMXJST.apply(this, arguments);

  this._shortTagCloser = typeof options.xhtml !== 'undefined' &&
                            options.xhtml ? '/>' : '>';

  this._elemJsInstances = options.elemJsInstances;
  this._omitOptionalEndTags = options.omitOptionalEndTags;
  this._unquotedAttrs = typeof options.unquotedAttrs === 'undefined' ?
    false :
    options.unquotedAttrs;
}

inherits(BEMHTML, BEMXJST);
BEMHTML.BEMXJSTError = BEMXJSTError;
module.exports = BEMHTML;

BEMHTML.prototype.Entity = Entity;

BEMHTML.prototype.runMany = function(arr) {
  var out = '';
  var context = this.context;
  var prevPos = context.position;
  var prevNotNewList = context._notNewList;

  if (prevNotNewList) {
    context._listLength += arr.length - 1;
  } else {
    context.position = 0;
    context._listLength = arr.length;
  }
  context._notNewList = true;

  if (this.canFlush) {
    for (var i = 0; i < arr.length; i++)
      out += context._flush(this._run(arr[i]));
  } else {
    for (var i = 0; i < arr.length; i++)
      out += this._run(arr[i]);
  }

  if (!prevNotNewList)
    context.position = prevPos;

  return out;
};

BEMHTML.prototype.render = function(context,
                                   entity,
                                   tag,
                                   js,
                                   bem,
                                   cls,
                                   mix,
                                   attrs,
                                   content) {
  if (tag === undefined)
    tag = 'div';
  else if (!tag)
    return (content || content === 0) ? this._run(content) : '';

  var ctx = context.ctx;
  var out = '<' + tag;

  var isBEM = !!(typeof bem !== 'undefined' ?
    bem : entity.block || entity.elem);

  if (!isBEM && !cls)
    return this.renderClose(out, context, tag, attrs, isBEM, ctx, content);

  var ctxJS = ctx.js;
  if (ctxJS !== false) {
    if (js === true)
      js = {};

    if (js && js !== ctx.js) {
      if (ctxJS !== true)
        js = utils.extend(ctxJS, js);
    }  else if (ctxJS === true) {
      js = {};
    }
  }

  var jsParams;
  if (js) {
    jsParams = {};
    jsParams[entity.jsClass] = js;
  }

  var addJSInitClass = jsParams && (
    this._elemJsInstances ?
      (entity.block || entity.elem) :
      (entity.block && !entity.elem)
  );

  out += ' class=';
  var classValue = '';
  if (isBEM) {
    classValue += entity.jsClass + this.buildModsClasses(entity.block,
                                                         entity.elem,
                                                         entity.elem ?
                                                           context.elemMods :
                                                           context.mods);

    if (ctx.mix && mix && mix !== ctx.mix)
      mix = [].concat(mix, ctx.mix);

    if (mix) {
      var m = this.renderMix(entity, mix, jsParams, addJSInitClass);
      classValue += m.out;
      jsParams = m.jsParams;
      addJSInitClass = m.addJSInitClass;
    }

    if (cls)
      classValue += ' ' + (typeof cls === 'string' ?
                    utils.attrEscape(cls).trim() : cls);
  } else {
    classValue += typeof cls === 'string' ?
      utils.attrEscape(cls).trim() :
      cls;
  }

  if (addJSInitClass)
    classValue += ' i-bem';

  out += this._unquotedAttrs && utils.isUnquotedAttr(classValue) ?
    classValue :
    ('"' + classValue + '"');

  if (isBEM && jsParams)
    out += ' data-bem=\'' + utils.jsAttrEscape(JSON.stringify(jsParams)) + '\'';

  return this.renderClose(out, context, tag, attrs, isBEM, ctx, content);
};

var OPTIONAL_END_TAGS = {
  // https://www.w3.org/TR/html4/index/elements.html
  html: 1, head: 1, body: 1, p: 1, li: 1, dt: 1, dd: 1,
  colgroup: 1, thead: 1, tbody: 1, tfoot: 1, tr: 1, th: 1, td: 1, option: 1,

  // html5 https://www.w3.org/TR/html5/syntax.html#optional-tags
  /* dl — Neither tag is omissible */ rb: 1, rt: 1, rtc: 1, rp: 1, optgroup: 1
};

BEMHTML.prototype.renderClose = function(prefix,
                                         context,
                                         tag,
                                         attrs,
                                         isBEM,
                                         ctx,
                                         content) {
  var out = prefix;

  out += this.renderAttrs(attrs, ctx);

  if (utils.isShortTag(tag)) {
    out += this._shortTagCloser;
    if (this.canFlush)
      out = context._flush(out);
  } else {
    out += '>';
    if (this.canFlush)
      out = context._flush(out);

    // TODO(indutny): skip apply next flags
    if (content || content === 0)
      out += this.renderContent(content, isBEM);

    if (!this._omitOptionalEndTags || !OPTIONAL_END_TAGS.hasOwnProperty(tag))
      out += '</' + tag + '>';
  }

  if (this.canFlush)
    out = context._flush(out);
  return out;
};

var isObj = function(val) {
  return val && typeof val === 'object' && !Array.isArray(val) &&
    val !== null;
};

BEMHTML.prototype.renderAttrs = function(attrs, ctx) {
  var out = '';

  // NOTE: maybe we need to make an array for quicker serialization
  if (isObj(attrs) || isObj(ctx.attrs)) {
    attrs = utils.extend(attrs, ctx.attrs);

    /* jshint forin : false */
    for (var name in attrs) {
      var attr = attrs[name];
      if (attr === undefined || attr === false || attr === null)
        continue;

      if (attr === true) {
        out += ' ' + name;
      } else {
        var attrVal = utils.isSimple(attr) ? attr : this.context.reapply(attr);
        out += ' ' + name + '=';

        out += this._unquotedAttrs && utils.isUnquotedAttr(attrVal) ?
          attrVal :
          ('"' + utils.attrEscape(attrVal) + '"');
      }
    }
  }

  return out;
};

var BEMHTMLSet = typeof Set !== 'undefined' ?
  Set :
  (function() {
    var MiniSet = function() {
      this._storage = {};
    };

    MiniSet.prototype.add = function(item) {
      this._storage[item] = true;
    };

    MiniSet.prototype.has = function(item) {
      return this._storage[item] || false;
    };

    return MiniSet;
  })();

BEMHTML.prototype.renderMix = function(entity, mix, jsParams, addJSInitClass) {
  var visited = new BEMHTMLSet();
  var context = this.context;
  var js = jsParams;
  var addInit = addJSInitClass;

  visited.add(entity.jsClass);

  // Transform mix to the single-item array if it's not array
  if (!Array.isArray(mix))
    mix = [ mix ];

  var classBuilder = this.classBuilder;

  var out = '';
  for (var i = 0; i < mix.length; i++) {
    var item = mix[i];
    if (!item)
      continue;
    if (typeof item === 'string')
      item = { block: item, elem: undefined };

    var hasItem = false;

    if (item.elem) {
      hasItem = item.elem !== entity.elem && item.elem !== context.elem ||
        item.block && item.block !== entity.block;
    } else if (item.block) {
      hasItem = !(item.block === entity.block && item.mods) ||
        item.mods && entity.elem;
    }

    var block = item.block || item._block || context.block;
    var elem = item.elem || item._elem || context.elem;
    var key = classBuilder.build(block, elem);

    var classElem = item.elem ||
                    item._elem ||
                    (item.block ? undefined : context.elem);
    if (hasItem)
      out += ' ' + classBuilder.build(block, classElem);

    out += this.buildModsClasses(block, classElem,
      (item.elem || !item.block && (item._elem || context.elem)) ?
        item.elemMods : item.mods);

    if (item.js) {
      if (!js)
        js = {};

      js[classBuilder.build(block, item.elem)] =
          item.js === true ? {} : item.js;
      if (!addInit)
        addInit = block && !item.elem;
    }

    // Process nested mixes from templates
    if (!hasItem || visited.has(key))
      continue;

    visited.add(key);
    var nestedEntity = this.entities[key];
    if (!nestedEntity)
      continue;

    var oldBlock = context.block;
    var oldElem = context.elem;
    var nestedMix = nestedEntity.rest.mix &&
      nestedEntity.rest.mix.exec(context);
    context.elem = oldElem;
    context.block = oldBlock;

    if (!nestedMix)
      continue;

    for (var j = 0; j < nestedMix.length; j++) {
      var nestedItem = nestedMix[j];
      if (!nestedItem) continue;

      if (!nestedItem.block &&
          !nestedItem.elem ||
          !visited.has(classBuilder.build(nestedItem.block, nestedItem.elem))) {
        if (nestedItem.block) continue;

        nestedItem._block = block;
        nestedItem._elem = elem;
        // make a copy, do not modify original array
        mix = mix.slice(0, i + 1).concat(
          nestedItem,
          mix.slice(i + 1)
        );
      }
    }
  }

  return {
    out: out,
    jsParams: js,
    addJSInitClass: addInit
  };
};

BEMHTML.prototype.buildModsClasses = function(block, elem, mods) {
  if (!mods)
    return '';

  var res = '';

  /*jshint -W089 */
  for (var modName in mods) {
    if (!mods.hasOwnProperty(modName) || modName === '')
      continue;

    var modVal = mods[modName];
    if (!modVal && modVal !== 0) continue;
    if (typeof modVal !== 'boolean')
      modVal += '';

    var builder = this.classBuilder;
    res += ' ' + (elem ?
                  builder.buildElemClass(block, elem, modName, modVal) :
                  builder.buildBlockClass(block, modName, modVal));
  }

  return res;
};
