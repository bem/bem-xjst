var inherits = require('inherits');
var utils = require('../bemxjst/utils');
var Entity = require('./entity').Entity;
var BEMXJST = require('../bemxjst');

function BEMHTML(options) {
  BEMXJST.apply(this, arguments);

  var xhtml = typeof options.xhtml === 'undefined' ? false : options.xhtml;
  this._shortTagCloser = xhtml ? '/>' : '>';

  this._elemJsInstances = options.elemJsInstances;
}

inherits(BEMHTML, BEMXJST);
module.exports = BEMHTML;

BEMHTML.prototype.Entity = Entity;

BEMHTML.prototype.runMany = function runMany(arr) {
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

BEMHTML.prototype.render = function render(context,
                                           entity,
                                           tag,
                                           js,
                                           bem,
                                           cls,
                                           mix,
                                           attrs,
                                           content) {
  var ctx = context.ctx;

  if (tag === undefined)
    tag = 'div';

  if (!tag)
    return this.renderNoTag(context, js, bem, cls, mix, attrs, content);

  var out = '<' + tag;

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

  var isBEM = bem;
  if (isBEM === undefined) {
    if (ctx.bem === undefined)
      isBEM = entity.block || entity.elem;
    else
      isBEM = ctx.bem;
  }
  isBEM = !!isBEM;

  if (cls === undefined)
    cls = ctx.cls;

  var isJsInitNeeded = jsParams && (
    this._elemJsInstances ?
      (entity.block || entity.elem) :
      (entity.block && !entity.elem)
  );

  if (!isBEM && !cls) {
    return this.renderClose(out, context, tag, attrs, isBEM, ctx, content);
  }

  out += ' class="';
  if (isBEM) {
    var mods = entity.elem ? context.elemMods : context.mods;

    out += entity.jsClass;
    out += this.buildModsClasses(entity.block, entity.elem, mods);

    if (ctx.mix && mix && mix !== ctx.mix)
      mix = [].concat(mix, ctx.mix);

    if (mix) {
      var m = this.renderMix(entity, mix, jsParams, isJsInitNeeded);
      out += m.out;
      jsParams = m.jsParams;
      isJsInitNeeded = m.isJsInitNeeded;
      mix = m.mix;
    }

    if (cls)
      out += ' ' + (typeof cls === 'string' ?
                    utils.attrEscape(cls).trim() : cls);
  } else {
    if (cls)
      out += cls.trim ? utils.attrEscape(cls).trim() : cls;
  }

  if (isJsInitNeeded)
    out += ' i-bem"';
  else
    out += '"';

  if (isBEM && jsParams)
    out += ' data-bem=\'' + utils.jsAttrEscape(JSON.stringify(jsParams)) + '\'';

  return this.renderClose(out, context, tag, attrs, isBEM, ctx, content);
};

BEMHTML.prototype.renderClose = function renderClose(prefix,
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

    out += '</' + tag + '>';
  }

  if (this.canFlush)
    out = context._flush(out);
  return out;
};

BEMHTML.prototype.renderAttrs = function renderAttrs(attrs, ctx) {
  var out = '';

  // NOTE: maybe we need to make an array for quicker serialization
  if (utils.isObj(attrs) || utils.isObj(ctx.attrs)) {
    attrs = utils.extend(attrs, ctx.attrs);

    /* jshint forin : false */
    for (var name in attrs) {
      var attr = attrs[name];
      if (attr === undefined || attr === false || attr === null)
        continue;

      if (attr === true)
        out += ' ' + name;
      else
        out += ' ' + name + '="' +
          utils.attrEscape(utils.isSimple(attr) ?
                           attr :
                           this.context.reapply(attr)) +
                           '"';
    }
  }

  return out;
};

BEMHTML.prototype.renderMix = function renderMix(entity,
                                                 mix,
                                                 jsParams,
                                                 isJsInitNeeded) {
  var visited = {};
  var ret = {
    out: '',
    jsParams: jsParams,
    isJsInitNeeded: isJsInitNeeded,
    mix: Array.isArray(mix) ? mix : [ mix ]
  };

  visited[entity.jsClass] = true;

  for (var i = 0; i < ret.mix.length; i++)
    this.renderMixItem(i, visited, this.context, entity, ret);

  return ret;
};

BEMHTML.prototype.renderMixItem = function renderMixItem(i, visited,
                                                       context, entity, ret) {
  var classBuilder = this.classBuilder;
  var item = ret.mix[i];

  if (!item)
    return ret;

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
    ret.out += ' ' + classBuilder.build(block, classElem);

  ret.out += this.buildModsClasses(block, classElem,
    (item.elem || !item.block && (item._elem || context.elem)) ?
      item.elemMods : item.mods);

  if (item.js) {
    if (!ret.jsParams)
      ret.jsParams = {};

    ret.jsParams[classBuilder.build(block, item.elem)] =
        item.js === true ? {} : item.js;
    if (!ret.isJsInitNeeded)
      ret.isJsInitNeeded = block && !item.elem;
  }

  // Process nested mixes
  if (!hasItem || visited[key])
    return ret;

  return this.renderNestedMix(ret, key, context, visited, i, block, elem);
};

BEMHTML.prototype.renderNestedMix = function renderNestedMix(ret, key, context,
                                                visited, i, block, elem) {
  visited[key] = true;

  var nestedEntity = this.entities[key];
  if (!nestedEntity)
    return ret;

  var oldBlock = context.block;
  var oldElem = context.elem;
  var nestedMix = nestedEntity.mix.exec(context);
  context.elem = oldElem;
  context.block = oldBlock;

  if (!nestedMix)
    return ret;

  var nestedItem;

  for (var j = 0; j < nestedMix.length; j++) {
    nestedItem = nestedMix[j];
    if (!nestedItem) continue;
    ret = this.renderNestedMixItem(ret, nestedItem, visited, i, block, elem);
  }

  return ret;
};

BEMHTML.prototype.renderNestedMixItem = function renderNestedMixItem(ret,
                             nestedItem, visited, i, block, elem) {
  if (!nestedItem.block &&
      !nestedItem.elem ||
      !visited[this.classBuilder.build(nestedItem.block, nestedItem.elem)]) {
    if (nestedItem.block)
      return ret;
    nestedItem._block = block;
    nestedItem._elem = elem;
    ret.mix = ret.mix.slice(0, i + 1).concat(
      nestedItem,
      ret.mix.slice(i + 1)
    );
  }
  return ret;
};

BEMHTML.prototype.buildModsClasses = function buildModsClasses(block,
                                                               elem,
                                                               mods) {
  if (!mods)
    return '';

  var res = '';

  var modName;

  /*jshint -W089 */
  for (modName in mods) {
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

BEMHTML.prototype.renderNoTag = function renderNoTag(context,
                                                     js,
                                                     bem,
                                                     cls,
                                                     mix,
                                                     attrs,
                                                     content) {

  // TODO(indutny): skip apply next flags
  if (content || content === 0)
    return this._run(content);
  return '';
};
