var Tree = require('./tree').Tree;
var PropertyMatch = require('./tree').PropertyMatch;
var Entity = require('./entity').Entity;
var Context = require('./context').Context;
var utils = require('./utils');

function BEMHTML() {
  this.entities = null;
  this.defaultEnt = null;

  // Current match
  this.match = null;
  this.context = null;

  // Initialize default entity (no block/elem match)
  this.defaultEnt = new Entity(this, '', '', []);
}
module.exports = BEMHTML;

BEMHTML.locals = Tree.methods.concat('local', 'applyCtx', 'applyNext', 'apply');

BEMHTML.prototype.compile = function compile(templates) {
  var self = this;

  function applyCtx() {
    return self.run(self.context.ctx);
  }

  function applyCtxWrap(changes) {
    return self.local({ ctx: changes }, applyCtx);
  }

  function apply(mode) {
    return self.applyMode(mode);
  }

  function localWrap(changes) {
    return function(body) {
      return self.local(changes, body);
    };
  }

  var tree = new Tree({
    refs: {
      applyCtx: applyCtxWrap,
      local: localWrap
    }
  });

  var out = tree.build(templates, [
    localWrap,
    applyCtxWrap,
    function applyNextWrap() { return self.applyNext(); },
    apply
  ]);

  // Group block+elem entities into a hashmap
  var ent = this.groupEntities(out);

  // Transform entities from arrays to Entity instances
  ent = this.transformEntities(ent);

  this.entities = ent;
};

BEMHTML.prototype.groupEntities = function groupEntities(tree) {
  var res = {};
  for (var i = 0; i < tree.length; i++) {
    var template = tree[i];
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
  Object.keys(entities).forEach(function(key) {
    // TODO(indutny): pass this values over
    var parts = key.split('__', 2);
    var block = parts[0];
    var elem = parts[1];
    entities[key] = new Entity(this, block, elem, entities[key]);
  }, this);
  return entities;
};

BEMHTML.prototype.reset = function reset() {
  this.match = null;
  this.context = new Context();
};

BEMHTML.prototype.run = function run(context) {
  var res;
  if (Array.isArray(context))
    res = this.runMany(context);
  else
    res = this.runOne(context);
  return res;
};

BEMHTML.prototype.runMany = function runMany(arr) {
  var out = '';
  for (var i = 0; i < arr.length; i++)
    out += this.run(arr[i]);
  return out;
};

BEMHTML.prototype.runOne = function runOne(context) {
  if (context === undefined)
    return '';
  if (utils.isSimple(context))
    return context + '';

  var oldCtx = this.context.ctx;
  var oldBlock = this.context.block;
  var oldCurrBlock = this.context._currBlock;
  var oldElem = this.context.elem;
  var oldMods = this.context.mods;
  var oldElemMods = this.context.elemMods;

  if (context.block || context.elem)
    this.context._currBlock = '';
  else
    this.context._currBlock = this.context.block;

  this.context.ctx = context;
  if (context.block) {
    this.context.block = context.block;
    this.context.mods = context.mods;
  } else if (!context.elem) {
    this.context.block = '';
  } else if (oldCurrBlock) {
    this.context.block = oldCurrBlock;
  }

  this.context.elem = context.elem;
  this.context.elemMods = context.elemMods;

  var block = this.context.block || '';
  var elem = context.elem;
  var key;
  if (elem === undefined)
    key = block;
  else
    key = block + '__' + elem;

  var ent = this.entities[key];
  if (!ent) {
    ent = this.defaultEnt;
    ent.init(block, elem);
  }

  var res = ent.run(this.context);
  this.context.ctx = oldCtx;
  this.context.block = oldBlock;
  this.context.elem = oldElem;
  this.context.mods = oldMods;
  this.context.elemMods = oldElemMods;

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
    out += this.renderClose(tag, attrs, ctx, content);
    return out;
  }

  out += ' class="';
  if (isBEM) {
    out += entity.jsClass;
    out += this.buildModsClasses(entity.block,
                                 entity.elem,
                                 ctx.elemMods || ctx.mods);

    // TODO(indutny): support mix
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

  out += this.renderClose(tag, attrs, ctx, content);

  return out;
};

BEMHTML.prototype.renderClose = function renderClose(tag, attrs, ctx, content) {
  var out = '';

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
  } else {
    out += '>';

    // TODO(indutny): skip apply next flags
    if (content || content === 0)
      out += this.run(content);

    out += '</' + tag + '>';
  }

  return out;
};

BEMHTML.prototype.buildModsClasses = function buildModsClasses(block,
                                                               elem,
                                                               mods) {
  var res = '';

  if (mods) {
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
  }

  return res;
};

BEMHTML.prototype.renderNoTag = function renderNoTag() {
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
    self.reset();
    return self.run(context || this);
  };
};
