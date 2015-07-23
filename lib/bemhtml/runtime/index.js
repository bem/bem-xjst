var inherits = require('inherits');

var Tree = require('./tree').Tree;
var PropertyMatch = require('./tree').PropertyMatch;
var Entity = require('./entity').Entity;
var Context = require('./context').Context;
var utils = require('./utils');

function BEMHTML() {
  this.entities = null;
  this.defaultEnt = null;

  // Current tree
  this.tree = null;

  // Current match
  this.match = null;

  // Create new Context constructor for overriding prototype
  this.contextConstructor = function ContextChild(bemhtml) {
    Context.call(this, bemhtml);
  };
  inherits(this.contextConstructor, Context);
  this.context = null;

  // Execution depth, used to invalidate `applyNext` bitfields
  this.depth = 0;

  // Do not call `_flush` on overridden `def()` mode
  this.canFlush = false;

  // oninit templates
  this.oninit = null;

  // Initialize default entity (no block/elem match)
  this.defaultEnt = new Entity(this, '', '', []);
}
module.exports = BEMHTML;

BEMHTML.locals = Tree.methods.concat('local', 'applyCtx', 'applyNext', 'apply');

BEMHTML.prototype.compile = function compile(code) {
  var self = this;

  function applyCtx() {
    return self._run(self.context.ctx);
  }

  function applyCtxWrap(ctx, changes) {
    // Fast case
    if (!changes)
      return self.local({ ctx: ctx }, applyCtx);

    return self.local(changes, function() {
      return self.local({ ctx: ctx }, applyCtx);
    });
  }

  function apply(mode) {
    return self.applyMode(mode);
  }

  function localWrap(changes) {
    return function localBody(body) {
      return self.local(changes, body);
    };
  }

  var tree = new Tree({
    refs: {
      applyCtx: applyCtxWrap,
      local: localWrap
    }
  });

  // Yeah, let people pass functions to us!
  var templates = code.toString().replace(/^function[^{]+{|}$/g, '');
  templates = new Function(BEMHTML.locals.join(', '), templates);

  var out = tree.build(templates, [
    localWrap,
    applyCtxWrap,
    function applyNextWrap(changes) {
      if (changes)
        return self.local(changes, applyNextWrap);
      return self.applyNext();
    },
    apply
  ]);

  // Concatenate templates with existing ones
  // TODO(indutny): it should be possible to incrementally add templates
  if (this.tree) {
    out = {
      templates: out.templates.concat(this.tree.templates),
      oninit: this.tree.oninit.concat(out.oninit)
    };
  }
  this.tree = out;

  // Group block+elem entities into a hashmap
  var ent = this.groupEntities(out.templates);

  // Transform entities from arrays to Entity instances
  ent = this.transformEntities(ent);

  this.entities = ent;
  this.oninit = out.oninit;
};

BEMHTML.prototype.groupEntities = function groupEntities(tree) {
  var res = {};
  for (var i = 0; i < tree.length; i++) {
    // Make sure to change only the copy, the original is cached in `this.tree`
    var template = tree[i].clone();
    var block = null;
    var elem;

    elem = undefined;
    for (var j = 0; j < template.predicates.length; j++) {
      var pred = template.predicates[j];
      if (!(pred instanceof PropertyMatch))
        continue;

      if (pred.key === 'block')
        block = pred.value;
      else if (pred.key === 'elem')
        elem = pred.value;
      else
        continue;

      // Remove predicate, we won't much against it
      template.predicates.splice(j, 1);
      j--;
    }

    // TODO(indutny): print out the template itself
    if (block === null)
      throw new Error('block("...") not found in one of the templates');

    var key;
    if (elem === undefined)
      key = block;
    else
      key = block + '__' + elem;

    if (!res[key])
      res[key] = [];
    res[key].push(template);
  }
  return res;
};

BEMHTML.prototype.transformEntities = function transformEntities(entities) {
  var keys = Object.keys(entities);
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];

    // TODO(indutny): pass this values over
    var parts = key.split('__', 2);
    var block = parts[0];
    var elem = parts[1];
    entities[key] = new Entity(this, block, elem, entities[key]);
  }

  // Merge wildcard templates
  if (entities.hasOwnProperty('*')) {
    var wildcard = entities['*'];
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      if (key === '*')
        continue;

      entities[key].prepend(wildcard);
    }
    this.defaultEnt.prepend(wildcard);
  }

  // Set default templates after merging with wildcard
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    entities[key].setDefaults();
    this.defaultEnt.setDefaults();
  }

  return entities;
};

BEMHTML.prototype._run = function _run(context) {
  var res;
  if (!context)
    res = this.runEmpty();
  else if (utils.isArray(context))
    res = this.runMany(context);
  else if (utils.isSimple(context))
    res = this.runSimple(context);
  else
    res = this.runOne(context);
  return res;
};

BEMHTML.prototype.run = function run(json) {
  var match = this.match;
  var context = this.context;

  this.match = null;
  this.context = new this.contextConstructor(this);
  this.canFlush = this.context._flush !== null;
  this.depth = 0;
  var res = this._run(json);

  if (this.canFlush)
    res = this.context._flush(res);

  this.match = match;
  this.context = context;

  return res;
};


BEMHTML.prototype.runEmpty = function runEmpty() {
  this.context._listLength--;
  return '';
};

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

BEMHTML.prototype.runSimple = function runSimple(context) {
  this.context._listLength--;
  var res = '';
  if (context && context !== true || context === 0)
    res += context;
  return res;
};

BEMHTML.prototype.runOne = function runOne(json) {
  var context = this.context;

  var oldCtx = context.ctx;
  var oldBlock = context.block;
  var oldCurrBlock = context._currBlock;
  var oldElem = context.elem;
  var oldMods = context.mods;
  var oldElemMods = context.elemMods;

  if (json.block || json.elem)
    context._currBlock = '';
  else
    context._currBlock = context.block;

  context.ctx = json;
  if (json.block) {
    context.block = json.block;

    // TODO(indutny): allocating object might be a performance hit, consider it
    context.mods = json.mods || {};
  } else {
    if (!json.elem)
      context.block = '';
    else if (oldCurrBlock)
      context.block = oldCurrBlock;
  }

  context.elem = json.elem;
  context.elemMods = json.elemMods;

  var block = context.block || '';
  var elem = context.elem;

  // Control list position
  if (block || elem)
    context.position++;
  else
    context._listLength--;

  // To invalidate `applyNext` flags
  this.depth++;

  var key;
  if (elem === undefined)
    key = block;
  else
    key = block + '__' + elem;

  var restoreFlush = false;
  var ent = this.entities[key];
  if (ent) {
    if (this.canFlush && !ent.canFlush) {
      // Entity does not support flushing, do not flush anything nested
      restoreFlush = true;
      this.canFlush = false;
    }
  } else {
    // No entity - use default one
    ent = this.defaultEnt;
    ent.init(block, elem);
  }

  var res = ent.run(context);
  context.ctx = oldCtx;
  context.block = oldBlock;
  context.elem = oldElem;
  context.mods = oldMods;
  context.elemMods = oldElemMods;
  this.depth--;
  if (restoreFlush)
    this.canFlush = true;

  return res;
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

    if (js) {
      if (ctxJS !== true)
        js = utils.extend(ctxJS, js);
    }  else if (ctxJS === true) {
      js = {};
    } else {
      js = ctxJS;
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

  if (cls === undefined)
    cls = ctx.cls;

  var addJSInitClass = entity.block && jsParams && !entity.elem;
  if (!isBEM && !cls) {
    return this.renderClose(out, context, tag, attrs, isBEM, ctx, content);
  }

  out += ' class="';
  if (isBEM) {
    var mods = ctx.elemMods || ctx.mods;
    if (!mods && ctx.block)
      mods = context.mods;

    out += entity.jsClass;
    out += this.buildModsClasses(entity.block, entity.elem, mods);

    var totalMix = mix;
    if (ctx.mix) {
      if (totalMix)
        totalMix = [].concat(totalMix, ctx.mix);
      else
        totalMix = ctx.mix;
    }

    if (totalMix) {
      var m = this.renderMix(entity, totalMix, jsParams, addJSInitClass);
      out += m.out;
      jsParams = m.jsParams;
      addJSInitClass = m.addJSInitClass;
    }

    if (cls)
      out += ' ' + cls;
  } else {
    if (cls)
      out += cls;
  }

  if (addJSInitClass)
    out += ' i-bem"';
  else
    out += '"';

  if (isBEM && jsParams)
    out += ' data-bem="' + utils.attrEscape(JSON.stringify(jsParams)) + '"';

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

  // NOTE: maybe we need to make an array for quicker serialization
  attrs = utils.extend(attrs, ctx.attrs);
  if (attrs) {
    var name; // TODO: do something with OmetaJS and YUI Compressor
    /* jshint forin : false */
    for (name in attrs) {
      var attr = attrs[name];
      if (attr === undefined)
        continue;

      // TODO(indutny): support `this.reapply()`
      out += ' ' + name + '="' +
        utils.attrEscape(utils.isSimple(attr) ?
                         attr :
                         this.reapply(attr)) +
                         '"';
    }
  }

  if (utils.isShortTag(tag)) {
    out += '/>';
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

BEMHTML.prototype.renderMix = function renderMix(entity,
                                                 mix,
                                                 jsParams,
                                                 addJSInitClass) {
  var visited = {};
  var context = this.context;
  var json = context.ctx;
  var js = jsParams;
  var addInit = addJSInitClass;

  visited[entity.jsClass] = true;

  // Transform mix to the single-item array if it's not array
  if (!utils.isArray(mix))
    mix = [ mix ];

  var out = '';
  for (var i = 0; i < mix.length; i++) {
    var item = mix[i];
    if (item === undefined)
      continue;
    if (typeof item === 'string')
      item = { block: item, elem: undefined };

    var hasItem = (item.block &&
                   (context.block !== json.block ||
                    item.block !== context.block)) ||
                  item.elem;
    var block = item.block || item._block || context.block;
    var elem = item.elem || item._elem || context.elem;
    var key = Entity.key(block, elem);

    var classElem = item.elem ||
                    item._elem ||
                    (item.block ? undefined : context.elem);
    if (hasItem)
      out += ' ' + Entity.key(block, classElem);

    out += this.buildModsClasses(block, classElem, item.elemMods || item.mods);

    if (item.js) {
      if (!js)
        js = {};

      js[key] = item.js === true ? {} : item.js;
      if (!addInit)
        addInit = block && !item.elem;
    }

    // Process nested mixes
    if (!hasItem || visited[key])
      continue;

    visited[key] = true;
    var nestedEntity = this.entities[key];
    if (!nestedEntity)
      continue;

    var oldBlock = context.block;
    var oldElem = context.elem;
    var nestedMix = nestedEntity.mix.exec(context);
    context.elem = oldElem;
    context.block = oldBlock;

    if (!nestedMix)
      continue;

    for (var j = 0; j < nestedMix.length; j++) {
      var nestedItem = nestedMix[j];
      if (!nestedItem.block &&
          !nestedItem.elem ||
          !visited[Entity.key(nestedItem.block, nestedItem.elem)]) {
        nestedItem._block = block;
        nestedItem._elem = elem;
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

BEMHTML.prototype.buildModsClasses = function buildModsClasses(block,
                                                               elem,
                                                               mods) {
  if (!mods)
    return '';

  var res = '';

  var modName;
  for (modName in mods) {
    if (!mods.hasOwnProperty(modName))
      continue;

    var modVal = mods[modName];
    if (!modVal && modVal !== 0) continue;
    if (typeof modVal !== 'boolean')
      modVal += '';

    res += ' ' + (elem ?
                  utils.buildElemClass(block, elem, modName, modVal) :
                  utils.buildBlockClass(block, modName, modVal));
  }

  return res;
};

BEMHTML.prototype.renderContent = function renderContent(content, isBEM) {
  var context = this.context;
  var oldPos = context.position;
  var oldListLength = context._listLength;
  var oldNotNewList = context._notNewList;

  context._notNewList = false;
  if (isBEM) {
    context.position = 1;
    context._listLength = 1;
  }

  var res = this._run(content);

  if (isBEM) {
    context.position = oldPos;
    context._listLength = oldListLength;
  }
  context._notNewList = oldNotNewList;

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

BEMHTML.prototype.local = function local(changes, body) {
  var keys = Object.keys(changes);
  var restore = [];
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    var parts = key.split('.');

    var value = this.context;
    for (var j = 0; j < parts.length - 1; j++)
      value = value[parts[j]];

    restore.push({
      parts: parts,
      value: value[parts[j]]
    });
    value[parts[j]] = changes[key];
  }

  var res = body.call(this.context);

  for (var i = 0; i < restore.length; i++) {
    var parts = restore[i].parts;
    var value = this.context;
    for (var j = 0; j < parts.length - 1; j++)
      value = value[parts[j]];

    value[parts[j]] = restore[i].value;
  }

  return res;
};

BEMHTML.prototype.applyNext = function applyNext() {
  return this.match.exec(this.context);
};

BEMHTML.prototype.applyMode = function applyMode(mode) {
  var match = this.match.entity.rest[mode];
  if (!match)
    return;

  return match.exec(this.context);
};

BEMHTML.prototype.exportApply = function exportApply(exports) {
  var self = this;
  exports.apply = function apply(context) {
    return self.run(context || this);
  };

  // Add templates at run time
  exports.compile = function compile(templates) {
    return self.compile(templates);
  };

  var sharedContext = {};

  exports.BEMContext = this.contextConstructor;
  sharedContext.BEMContext = exports.BEMContext;

  for (var i = 0; i < this.oninit.length; i++) {
    var oninit = this.oninit[i];

    oninit(exports, sharedContext);
  }
};
