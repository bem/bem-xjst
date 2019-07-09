(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.bemtree = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var inherits = require('inherits');
var BemxjstEntity = require('../bemxjst/entity').Entity;

function Entity() {
  BemxjstEntity.apply(this, arguments);
}

inherits(Entity, BemxjstEntity);
exports.Entity = Entity;

Entity.prototype.defaultBody = function(context) {
  context.mods = this.mods.exec(context);
  if (context.ctx.elem) context.elemMods = this.elemMods.exec(context);

  return this.bemxjst.render(context,
                             this,
                             this.content.exec(context),
                             this.js.exec(context),
                             this.mix.exec(context),
                             context.mods,
                             context.elemMods);
};

},{"../bemxjst/entity":5,"inherits":11}],2:[function(require,module,exports){
var inherits = require('inherits');
var BEMXJST = require('../bemxjst');
var Entity = require('./entity').Entity;
var utils = require('../bemxjst/utils');

function BEMTREE() {
  BEMXJST.apply(this, arguments);
}

inherits(BEMTREE, BEMXJST);
module.exports = BEMTREE;

BEMTREE.prototype.Entity = Entity;

BEMTREE.prototype.runMany = function(arr) {
  var out = [];
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
      out += context._flush(this._run(arr[i])); // TODO: fixme!
  } else {
    for (var i = 0; i < arr.length; i++)
      out.push(this._run(arr[i]));
  }

  if (!prevNotNewList)
    context.position = prevPos;

  return out;
};

BEMTREE.prototype.render = function(context, entity, content, js, mix, mods,
                                                                    elemMods) {
  var ctx = utils.extend({}, context.ctx);
  var isBEM = !!(ctx.block || ctx.elem || ctx.bem);

  if (typeof js !== 'undefined')
    ctx.js = js;

  if (typeof mix !== 'undefined')
    ctx.mix = mix;

  if (!entity.elem && mods && Object.keys(mods).length > 0)
    ctx.mods = utils.extend(ctx.mods || {}, mods);

  if (entity.elem && elemMods && Object.keys(elemMods).length > 0)
    ctx.elemMods = utils.extend(ctx.elemMods || {}, elemMods);

  if (typeof content === 'undefined')
    return ctx;

  ctx.content = this.renderContent(content, isBEM);

  return ctx;
};

BEMTREE.prototype._run = function(context) {
  if (!context || context === true) return context;
  return BEMXJST.prototype._run.call(this, context);
};

BEMTREE.prototype.runUnescaped = function(context) {
  this.context._listLength--;
  return context;
};

},{"../bemxjst":7,"../bemxjst/utils":10,"./entity":1,"inherits":11}],3:[function(require,module,exports){
function ClassBuilder(options) {
  this.elemDelim = options.elem || '__';

  this.modDelim = typeof options.mod === 'string' ?
    {
      name: options.mod || '_',
      val: options.mod || '_'
    } :
    {
      name: options.mod && options.mod.name || '_',
      val: options.mod && options.mod.val || '_'
    };
}

exports.ClassBuilder = ClassBuilder;

ClassBuilder.prototype.build = function(block, elem) {
  if (!elem)
    return block;
  else
    return block + this.elemDelim + elem;
};

ClassBuilder.prototype.buildModPostfix = function(modName, modVal) {
  var res = this.modDelim.name + modName;
  if (modVal !== true) res += this.modDelim.val + modVal;
  return res;
};

ClassBuilder.prototype.buildBlockClass = function(name, modName, modVal) {
  var res = name;
  if (modVal) res += this.buildModPostfix(modName, modVal);
  return res;
};

ClassBuilder.prototype.buildElemClass = function(block, name, modName, modVal) {
  return this.buildBlockClass(block) +
    this.elemDelim +
    name +
    this.buildModPostfix(modName, modVal);
};

ClassBuilder.prototype.split = function(key) {
  return key.split(this.elemDelim, 2);
};

},{}],4:[function(require,module,exports){
var utils = require('./utils');

function Context(bemxjst) {
  this._bemxjst = bemxjst;

  this.ctx = null;
  this.block = '';

  // Save current block until the next BEM entity
  this._currBlock = '';

  this.elem = null;
  this.mods = {};
  this.elemMods = {};

  this.position = 0;
  this._listLength = 0;
  this._notNewList = false;

  this.escapeContent = bemxjst.options.escapeContent !== false;
}
exports.Context = Context;

Context.prototype._flush = null;

Context.prototype.isSimple = utils.isSimple;

Context.prototype.isShortTag = utils.isShortTag;
Context.prototype.extend = utils.extend;
Context.prototype.identify = utils.identify;

Context.prototype.xmlEscape = utils.xmlEscape;
Context.prototype.attrEscape = utils.attrEscape;
Context.prototype.jsAttrEscape = utils.jsAttrEscape;

Context.prototype.onError = function(context, e) {
  console.error('bem-xjst rendering error:', {
    block: context.ctx.block,
    elem: context.ctx.elem,
    mods: context.ctx.mods,
    elemMods: context.ctx.elemMods
  }, e);
};

Context.prototype.isFirst = function() {
  return this.position === 1;
};

Context.prototype.isLast = function() {
  return this.position === this._listLength;
};

Context.prototype.generateId = function() {
  return utils.identify(this.ctx);
};

Context.prototype.reapply = function(ctx) {
  return this._bemxjst.run(ctx);
};

},{"./utils":10}],5:[function(require,module,exports){
var utils = require('./utils');
var Match = require('./match').Match;
var tree = require('./tree');
var Template = tree.Template;
var PropertyMatch = tree.PropertyMatch;
var CompilerOptions = tree.CompilerOptions;

function Entity(bemxjst, block, elem, templates) {
  this.bemxjst = bemxjst;

  this.block = null;
  this.elem = null;

  // Compiler options via `xjstOptions()`
  this.options = {};

  // `true` if entity has just a default renderer for `def()` mode
  this.canFlush = true;

  // "Fast modes"
  this.def = new Match(this);
  this.mix = new Match(this, 'mix');
  this.js = new Match(this, 'js');
  this.mods = new Match(this, 'mods');
  this.elemMods = new Match(this, 'elemMods');
  this.content = new Match(this, 'content');

  // "Slow modes"
  this.rest = {};

  // Initialize
  this.init(block, elem);
  this.initModes(templates);
}
exports.Entity = Entity;

Entity.prototype.init = function(block, elem) {
  this.block = block;
  this.elem = elem;
};

Entity.prototype._keys = {
  content: 1,
  mix: 1,
  js: 1,
  mods: 1,
  elemMods: 1
};

Entity.prototype._initRest = function(key) {
  if (key === 'default') {
    this.rest[key] = this.def;
  } else if (this._keys[key]) {
    this.rest[key] = this[key];
  } else {
    this.rest[key] = this.rest[key] || new Match(this, key);
  }
};

Entity.prototype.initModes = function(templates) {
  /* jshint maxdepth : false */
  for (var i = 0; i < templates.length; i++) {
    var template = templates[i];

    for (var j = template.predicates.length - 1; j >= 0; j--) {
      var pred = template.predicates[j];
      if (!(pred instanceof PropertyMatch))
        continue;

      if (pred.key !== '_mode')
        continue;

      template.predicates.splice(j, 1);
      this._initRest(pred.value);

      // All templates should go there anyway
      this.rest[pred.value].push(template);
      break;
    }

    if (j === -1)
      this.def.push(template);

    // Merge compiler options
    for (var j = template.predicates.length - 1; j >= 0; j--) {
      var pred = template.predicates[j];
      if (!(pred instanceof CompilerOptions))
        continue;

      this.options = utils.extend(this.options, pred.options);
    }
  }
};

Entity.prototype.prepend = function(other) {
  // Prepend to the slow modes, fast modes are in this hashmap too anyway
  var keys = Object.keys(this.rest);
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    if (!other.rest[key])
      continue;

    this.rest[key].prepend(other.rest[key]);
  }

  // Add new slow modes
  keys = Object.keys(other.rest);
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    if (this.rest[key])
      continue;

    this._initRest(key);
    this.rest[key].prepend(other.rest[key]);
  }
};

// NOTE: This could be potentially compiled into inlined invokations
Entity.prototype.run = function(context) {
  if (this.def.count !== 0)
    return this.def.exec(context);

  return this.defaultBody(context);
};


function contentMode() {
  return this.ctx.content;
}

Entity.prototype.setDefaults = function() {
  // Default .content() template for applyNext()
  if (this.content.count !== 0)
    this.content.push(new Template([], contentMode));

  // .def() default
  if (this.def.count !== 0) {
    this.canFlush = this.options.flush || false;
    var self = this;
    this.def.push(new Template([], function defaultBodyProxy() {
      return self.defaultBody(this);
    }));
  }
};

},{"./match":8,"./tree":9,"./utils":10}],6:[function(require,module,exports){
function BEMXJSTError(msg, func) {
  this.name = 'BEMXJSTError';
  this.message = msg;

  if (Error.captureStackTrace)
    Error.captureStackTrace(this, func || this.constructor);
  else
    this.stack = (new Error()).stack;
}

BEMXJSTError.prototype = Object.create(Error.prototype);
BEMXJSTError.prototype.constructor = BEMXJSTError;

exports.BEMXJSTError = BEMXJSTError;

},{}],7:[function(require,module,exports){
var inherits = require('inherits');

var Tree = require('./tree').Tree;
var PropertyMatch = require('./tree').PropertyMatch;
var AddMatch = require('./tree').AddMatch;
var Context = require('./context').Context;
var ClassBuilder = require('./class-builder').ClassBuilder;
var utils = require('./utils');

function BEMXJST(options) {
  this.options = options;

  this.entities = null;
  this.defaultEnt = null;

  // Current tree
  this.tree = null;

  // Current match
  this.match = null;

  // Create new Context constructor for overriding prototype
  this.contextConstructor = function ContextChild(bemxjst) {
    Context.call(this, bemxjst);
  };
  inherits(this.contextConstructor, Context);
  this.context = null;

  this.classBuilder = new ClassBuilder(this.options.naming || {});

  // Execution depth, used to invalidate `applyNext` bitfields
  this.depth = 0;

  // Do not call `_flush` on overridden `def()` mode
  this.canFlush = false;

  // oninit templates
  this.oninit = null;

  // Initialize default entity (no block/elem match)
  this.defaultEnt = new this.Entity(this, '', '', []);
  this.defaultElemEnt = new this.Entity(this, '', '', []);
}
module.exports = BEMXJST;

BEMXJST.prototype.locals = Tree.methods
    .concat('local', 'applyCtx', 'applyNext', 'apply', 'flushProcessedEntities');

BEMXJST.prototype.runOninit = function(oninits, ret) {
  var self = ret || this;

  self.BEMContext = this.contextConstructor;
  for (var i = 0; i < oninits.length; i++) {
    // NOTE: oninit has global context instead of BEMXJST
    var oninit = oninits[i];
    oninit(self, { BEMContext: self.BEMContext });
  }
};

BEMXJST.prototype.compile = function(code) {
  var self = this;

  function applyCtx() {
    return self.run(self.context.ctx);
  }

  function _applyCtx() {
    return self._run(self.context.ctx);
  }

  function applyCtxWrap(ctx, changes) {
    // Fast case
    if (!changes)
      return self.local({ ctx: ctx }, applyCtx);

    return self.local(changes, function() {
      return self.local({ ctx: ctx }, _applyCtx);
    });
  }

  function _applyCtxWrap(ctx, changes) {
    // Fast case
    if (!changes)
      return self.local({ ctx: ctx }, _applyCtx);

    return self.local(changes, function() {
      return self.local({ ctx: ctx }, applyCtx);
    });
  }

  function apply(mode, changes) {
    return self.applyMode(mode, changes);
  }

  function localWrap(changes) {
    return function localBody(body) {
      return self.local(changes, body);
    };
  }

  function flushProcessedEntities() {
    var entities = self._entitiesProcessed;

    self._entitiesProcessed = {};

    return entities;
  }

  var tree = new Tree({
    refs: {
      applyCtx: applyCtxWrap,
      _applyCtx: _applyCtxWrap,
      apply: apply,
      flushProcessedEntities: flushProcessedEntities
    }
  });

  // Yeah, let people pass functions to us!
  var templates = this.recompileInput(code);

  var out = tree.build(templates, [
    localWrap,
    applyCtxWrap,
    function applyNextWrap(changes) {
      if (changes)
        return self.local(changes, applyNextWrap);
      return self.applyNext();
    },
    apply,
    flushProcessedEntities
  ]);

  // Concatenate templates with existing ones
  // TODO(indutny): it should be possible to incrementally add templates
  if (this.tree) {
    this.runOninit(out.oninit);

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

BEMXJST.prototype.getTemplate = function(code, options) {
  this.compile(code, options);

  return this.exportApply();
};

BEMXJST.prototype.recompileInput = function(code) {
  var args = BEMXJST.prototype.locals;
  // Reuse function if it already has right arguments
  if (typeof code === 'function' && code.length === args.length)
    return code;

  return new Function(args.join(', '), utils.fnToString(code));
};

BEMXJST.prototype.groupEntities = function(tree) {
  var res = {};
  for (var i = 0; i < tree.length; i++) {
    // Make sure to change only the copy, the original is cached in `this.tree`
    var template = tree[i].clone();
    var block = null;
    var elem;

    elem = undefined;
    for (var j = 0; j < template.predicates.length; j++) {
      var pred = template.predicates[j];
      if (!(pred instanceof PropertyMatch) &&
        !(pred instanceof AddMatch))
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

    if (block === null) {
      var msg = 'block(…) subpredicate is not found.\n' +
      '    See template with subpredicates:\n     * ';

      for (var j = 0; j < template.predicates.length; j++) {
        var pred = template.predicates[j];

        if (j !== 0)
          msg += '\n     * ';

        if (pred.key === '_mode') {
          msg += pred.value + '()';
        } else {
          if (Array.isArray(pred.key)) {
            msg += pred.key[0].replace('mods', 'mod')
              .replace('elemMods', 'elemMod') +
              '(\'' + pred.key[1] + '\', \'' + pred.value + '\')';
          } else {
            msg += 'match(…)';
          }
        }
      }

      msg += '\n    And template body: \n    (' +
        (typeof template.body === 'function' ?
          template.body :
          JSON.stringify(template.body)) + ')';

      if (typeof BEMXJSTError === 'undefined') {
        BEMXJSTError = require('./error').BEMXJSTError;
      }

      throw new BEMXJSTError(msg);
    }

    var key = this.classBuilder.build(block, elem);

    if (!res[key])
      res[key] = [];
    res[key].push(template);
  }
  return res;
};

BEMXJST.prototype.transformEntities = function(entities) {
  var wildcardElems = [];

  var keys = Object.keys(entities);
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];

    // TODO(indutny): pass this values over
    var parts = this.classBuilder.split(key);
    var block = parts[0];
    var elem = parts[1];

    if (elem === '*')
      wildcardElems.push(block);

    entities[key] = new this.Entity(
      this, block, elem, entities[key]);
  }

  // Merge wildcard block templates
  if (entities.hasOwnProperty('*')) {
    var wildcard = entities['*'];
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      if (key === '*')
        continue;

      entities[key].prepend(wildcard);
    }
    this.defaultEnt.prepend(wildcard);
    this.defaultElemEnt.prepend(wildcard);
  }

  // Merge wildcard elem templates
  for (var i = 0; i < wildcardElems.length; i++) {
    var block = wildcardElems[i];
    var wildcardKey = this.classBuilder.build(block, '*');
    var wildcard = entities[wildcardKey];
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      if (key === wildcardKey)
        continue;

      var entity = entities[key];
      if (entity.block !== block || entity.elem === undefined)
        continue;

      entities[key].prepend(wildcard);
    }
    this.defaultElemEnt.prepend(wildcard);
  }

  // Set default templates after merging with wildcard
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    entities[key].setDefaults();
    this.defaultEnt.setDefaults();
    this.defaultElemEnt.setDefaults();
  }

  return entities;
};

BEMXJST.prototype._run = function(context) {
  if (context === undefined || context === '' || context === null)
    return this.runEmpty();
  else if (Array.isArray(context))
    return this.runMany(context);
  else if (
    typeof context.html === 'string' &&
    !context.tag &&
    typeof context.block === 'undefined' &&
    typeof context.elem === 'undefined' &&
    typeof context.cls === 'undefined' &&
    typeof context.attrs === 'undefined'
  )
    return this.runUnescaped(context);
  else if (utils.isSimple(context))
    return this.runSimple(context);

  return this.runOne(context);
};

BEMXJST.prototype.run = function(json) {
  var match = this.match;
  var context = this.context;
  var depth = this.depth;

  this.match = null;
  this.context = new this.contextConstructor(this);
  this.canFlush = this.context._flush !== null;
  this.depth = 0;
  var res = this._run(json);

  if (this.canFlush)
    res = this.context._flush(res);

  this.match = match;
  this.context = context;
  this.depth = depth;

  return res;
};

BEMXJST.prototype.runEmpty = function() {
  this.context._listLength--;
  return '';
};

BEMXJST.prototype.runUnescaped = function(context) {
  this.context._listLength--;
  return '' + context.html;
};

BEMXJST.prototype.runSimple = function(simple) {
  this.context._listLength--;
  if (!simple && simple !== 0 || simple === true)
    return '';

  return typeof simple === 'string' && this.context.escapeContent ?
      utils.xmlEscape(simple) :
      simple;
};

BEMXJST.prototype.runOne = function(json) {
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

    if (json.mods)
      context.mods = json.mods;
    else if (json.block !== oldBlock || !json.elem)
      context.mods = {};
  } else {
    if (!json.elem)
      context.block = '';
    else if (oldCurrBlock)
      context.block = oldCurrBlock;
  }

  context.elem = json.elem;
  context.elemMods = json.elemMods || {};

  var block = context.block || '';
  var elem = context.elem;

  // Control list position
  if (block || elem)
    context.position++;
  else
    context._listLength--;

  // To invalidate `applyNext` flags
  this.depth++;

  var restoreFlush = false;
  var ent = this.entities[this.classBuilder.build(block, elem)];
  if (ent) {
    if (this.canFlush && !ent.canFlush) {
      // Entity does not support flushing, do not flush anything nested
      restoreFlush = true;
      this.canFlush = false;
    }
  } else {
    // No entity - use default one
    ent = this.defaultEnt;
    if (elem !== undefined)
      ent = this.defaultElemEnt;
    ent.init(block, elem);
  }

  var res = this.options.production === true ?
    this.tryRun(context, ent) :
    ent.run(context);

  context.ctx = oldCtx;
  context.block = oldBlock;
  context.elem = oldElem;
  context.mods = oldMods;
  context.elemMods = oldElemMods;
  context._currBlock = oldCurrBlock;
  this.depth--;
  if (restoreFlush)
    this.canFlush = true;

  return res;
};

BEMXJST.prototype.tryRun = function(context, ent) {
  try {
    return ent.run(context);
  } catch (e) {
    return context.onError(context, e) || '';
  }
};

BEMXJST.prototype.renderContent = function(content, isBEM) {
  var context = this.context;
  var oldPos = context.position;
  var oldListLength = context._listLength;
  var oldNotNewList = context._notNewList;

  context._notNewList = false;
  if (isBEM) {
    context.position = 0;
    context._listLength = 1;
  }

  var res = this._run(content);

  context.position = oldPos;
  context._listLength = oldListLength;
  context._notNewList = oldNotNewList;

  return res;
};

BEMXJST.prototype.local = function(changes, body) {
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

BEMXJST.prototype.applyNext = function() {
  return this.match.exec(this.context);
};

BEMXJST.prototype.applyMode = function(mode, changes) {
  var match = this.match;

  if (!match) {
    var key = this.classBuilder.build(this.context.block, this.context.elem);
    match = this.entities[key].rest[mode];
  } else {
    match = match.entity.rest[mode];
  }

  if (!match) {
    if (mode === 'mods')
      return this.context.mods;

    if (mode === 'elemMods')
      return this.context.elemMods;

    return this.context.ctx[mode];
  }

  if (!changes)
    return match.exec(this.context);

  var self = this;

  // Allocate function this way, to prevent allocation at the top of the
  // `applyMode`
  var localBody = function() {
    return match.exec(self.context);
  };
  return this.local(changes, localBody);
};

BEMXJST.prototype.exportApply = function(exports) {
  var self = this;
  var ret = exports || {};

  ret.apply = function(context) {
    return self.run(context);
  };

  // Add templates at run time
  ret.compile = function(templates) {
    self.compile(templates);
    return ret;
  };

  this.runOninit(self.oninit, ret);

  return ret;
};

},{"./class-builder":3,"./context":4,"./error":6,"./tree":9,"./utils":10,"inherits":11}],8:[function(require,module,exports){
var tree = require('./tree');
var PropertyMatch = tree.PropertyMatch;
var AddMatch = tree.AddMatch;
var WrapMatch = tree.WrapMatch;
var ExtendMatch = tree.ExtendMatch;
var CustomMatch = tree.CustomMatch;

function MatchNested(template, pred) {
  this.template = template;
  this.keys = pred.key;
  this.value = pred.value;
}

MatchNested.prototype.exec = function(context) {
  var val = context;
  var keys = this.keys;

  for (var i = 0; i < keys.length - 1; i++) {
    val = val[keys[i]];
    if (!val)
      return false;
  }

  val = val[keys[i]];

  if (this.value === true)
    return val !== undefined && val !== '' && val !== false && val !== null;

  return String(val) === this.value;
};

function MatchCustom(template, pred) {
  this.template = template;
  this.body = pred.body;
}

MatchCustom.prototype.exec = function(context) {
  return this.body.call(context, context, context.ctx);
};

function MatchWrap(template) {
  this.template = template;
  this.wrap = null;
}

MatchWrap.prototype.exec = function(context) {
  var res = this.wrap !== context.ctx;
  this.wrap = context.ctx;
  return res;
};

function MatchExtend(template) {
  this.template = template;
  this.wrap = null;
}

MatchExtend.prototype.exec = function(context) {
  var res = this.ext !== context.ctx;
  this.ext = context.ctx;
  return res;
};

function AddWrap(template, pred) {
  this.template = template;
  this.key = pred.key;
  this.value = pred.value;
}

AddWrap.prototype.exec = function(context) {
  return context[this.key] === this.value;
};

function MatchTemplate(mode, template) {
  this.mode = mode;
  this.predicates = new Array(template.predicates.length);
  this.body = template.body;

  var postpone = [];

  for (var i = 0, j = 0; i < this.predicates.length; i++, j++) {
    var pred = template.predicates[i];
    if (pred instanceof PropertyMatch) {
      this.predicates[j] = new MatchNested(this, pred);
    } else if (pred instanceof ExtendMatch) {
      j--;
      postpone.push(new MatchExtend(this));
    } else if (pred instanceof AddMatch) {
      this.predicates[j] = new AddWrap(this, pred);
    } else if (pred instanceof CustomMatch) {
      this.predicates[j] = new MatchCustom(this, pred);

      // Push MatchWrap later, they should not be executed first.
      // Otherwise they will set flag too early, and body might not be executed
    } else if (pred instanceof WrapMatch) {
      j--;
      postpone.push(new MatchWrap(this));
    } else {
      // Skip
      j--;
    }
  }

  // Insert late predicates
  for (var i = 0; i < postpone.length; i++, j++)
    this.predicates[j] = postpone[i];

  if (this.predicates.length !== j)
    this.predicates.length = j;
}
exports.MatchTemplate = MatchTemplate;

function Match(entity, modeName) {
  this.entity = entity;
  this.modeName = modeName;
  this.bemxjst = this.entity.bemxjst;
  this.templates = [];

  // applyNext mask
  this.mask = [ 0 ];

  // We are going to create copies of mask for nested `applyNext()`
  this.maskSize = 0;
  this.maskOffset = 0;

  this.count = 0;
  this.depth = -1;

  this.thrownError = null;
}
exports.Match = Match;

Match.prototype.prepend = function(other) {
  this.templates = other.templates.concat(this.templates);
  this.count += other.count;

  while (Math.ceil(this.count / 31) > this.mask.length)
    this.mask.push(0);

  this.maskSize = this.mask.length;
};

Match.prototype.push = function(template) {
  this.templates.push(new MatchTemplate(this, template));
  this.count++;

  if (Math.ceil(this.count / 31) > this.mask.length)
    this.mask.push(0);

  this.maskSize = this.mask.length;
};

Match.prototype.tryCatch = function(fn, ctx) {
  try {
    return fn.call(ctx, ctx, ctx.ctx);
  } catch (e) {
    this.thrownError = e;
    if (this.modeName) {
      this.thrownError.ctx = ctx;
      this.thrownError.name = 'BEMXJST ERROR';
      var classBuilder = this.entity.bemxjst.classBuilder;

      var cause = e.stack.split('\n')[1];
      this.thrownError.message = 'Template error in mode ' +
            this.modeName + ' in block ' +
            classBuilder.build(ctx.ctx.block, ctx.ctx.elem) +
            '\n    ' + e.message + '\n';
      this.thrownError.stack = this.thrownError.name + ': ' +
            this.thrownError.message + ' ' + cause + '\n' + e.stack;
    }
  }
};

Match.prototype.exec = function(context) {
  var save = this.checkDepth();

  var template;
  var bitIndex = this.maskOffset;
  var mask = this.mask[bitIndex];
  var bit = 1;
  for (var i = 0; i < this.count; i++) {
    if ((mask & bit) === 0) {
      template = this.templates[i];
      for (var j = 0; j < template.predicates.length; j++) {
        var pred = template.predicates[j];

        /* jshint maxdepth : false */
        if (!pred.exec(context))
          break;
      }

      // All predicates matched!
      if (j === template.predicates.length)
        break;
    }

    if (bit === 0x40000000) {
      bitIndex++;
      mask = this.mask[bitIndex];
      bit = 1;
    } else {
      bit <<= 1;
    }
  }

  if (i === this.count) {
    this.restoreDepth(save);

    if (this.modeName === 'mods')
      return context.mods;

    if (this.modeName === 'elemMods')
      return context.elemMods;

    return context.ctx[this.modeName];
  }

  var oldMask = mask;
  var oldMatch = this.bemxjst.match;
  this.mask[bitIndex] |= bit;
  this.bemxjst.match = this;

  this.thrownError = null;

  var out;
  if (typeof template.body === 'function')
    out = this.tryCatch(template.body, context);
  else
    out = template.body;

  this.mask[bitIndex] = oldMask;
  this.bemxjst.match = oldMatch;
  this.restoreDepth(save);

  var e = this.thrownError;
  if (e !== null) {
    this.thrownError = null;
    throw e;
  }

  return out;
};

Match.prototype.checkDepth = function() {
  if (this.depth === -1) {
    this.depth = this.bemxjst.depth;
    return -1;
  }

  if (this.bemxjst.depth === this.depth)
    return this.depth;

  var depth = this.depth;
  this.depth = this.bemxjst.depth;

  this.maskOffset += this.maskSize;

  while (this.mask.length < this.maskOffset + this.maskSize)
    this.mask.push(0);

  return depth;
};

Match.prototype.restoreDepth = function(depth) {
  if (depth !== -1 && depth !== this.depth)
    this.maskOffset -= this.maskSize;
  this.depth = depth;
};

},{"./tree":9}],9:[function(require,module,exports){
var inherits = require('inherits');
var utils = require('./utils');

function Template(predicates, body) {
  this.predicates = predicates;

  this.body = body;
}
exports.Template = Template;

Template.prototype.wrap = function() {
  var body = this.body;
  for (var i = 0; i < this.predicates.length; i++) {
    var pred = this.predicates[i];
    body = pred.wrapBody(body);
  }
  this.body = body;
};

Template.prototype.clone = function() {
  return new Template(this.predicates.slice(), this.body);
};

function MatchBase() {
}
exports.MatchBase = MatchBase;

MatchBase.prototype.wrapBody = function(body) {
  return body;
};

function Item(tree, children) {
  this.conditions = [];
  this.children = [];

  for (var i = children.length - 1; i >= 0; i--) {
    var arg = children[i];
    if (arg instanceof MatchBase)
      this.conditions.push(arg);
    else if (arg === tree.boundBody)
      this.children[i] = tree.queue.pop();
    else
      this.children[i] = arg;
  }
}

function WrapMatch(refs) {
  MatchBase.call(this);

  this.refs = refs;
}
inherits(WrapMatch, MatchBase);
exports.WrapMatch = WrapMatch;

WrapMatch.prototype.wrapBody = function(body) {
  var _applyCtx = this.refs._applyCtx;

  if (typeof body !== 'function') {
    return function() {
      return _applyCtx(body);
    };
  }

  return function() {
    return _applyCtx(body.call(this, this, this.ctx));
  };
};

function ReplaceMatch(refs) {
  MatchBase.call(this);

  this.refs = refs;
}
inherits(ReplaceMatch, MatchBase);
exports.ReplaceMatch = ReplaceMatch;

ReplaceMatch.prototype.wrapBody = function(body) {
  var applyCtx = this.refs.applyCtx;

  if (typeof body !== 'function') {
    return function() {
      return applyCtx(body, { position: this.position - 1 });
    };
  }

  return function() {
    return applyCtx(body.call(this, this, this.ctx),
                    { position: this.position - 1 });
  };
};

function ExtendMatch(refs) {
  MatchBase.call(this);

  this.refs = refs;
}
inherits(ExtendMatch, MatchBase);
exports.ExtendMatch = ExtendMatch;

ExtendMatch.prototype.wrapBody = function(body) {
  var refs = this.refs;
  var applyCtx = refs.applyCtx;

  if (typeof body !== 'function') {
    return function() {
      var changes = {};

      var keys = Object.keys(body);
      for (var i = 0; i < keys.length; i++)
        changes[keys[i]] = body[keys[i]];

      return applyCtx(this.ctx, changes);
    };
  }

  return function() {
    var changes = {};

    var obj = body.call(this, this, this.ctx);
    var keys = Object.keys(obj);
    for (var i = 0; i < keys.length; i++)
      changes[keys[i]] = obj[keys[i]];

    return applyCtx(this.ctx, changes);
  };
};

function AddMatch(mode, refs) {
  MatchBase.call(this);

  this.mode = mode;
  this.refs = refs;
}
inherits(AddMatch, MatchBase);
exports.AddMatch = AddMatch;

AddMatch.prototype.wrapBody = function(body) {
  return this[this.mode + 'WrapBody'](body);
};

AddMatch.prototype.appendContentWrapBody = function(body) {
  var apply = this.refs.apply;

  if (typeof body !== 'function') {
    return function() {
      return [ apply('content') , body ];
    };
  }

  return function() {
    return [ apply('content'), body.call(this, this, this.ctx) ];
  };
};

AddMatch.prototype.prependContentWrapBody = function(body) {
  var apply = this.refs.apply;

  if (typeof body !== 'function') {
    return function() {
      return [ body, apply('content') ];
    };
  }

  return function() {
    return [ body.call(this, this, this.ctx), apply('content') ];
  };
};

AddMatch.prototype.mixWrapBody = function(body) {
  var apply = this.refs.apply;

  if (typeof body !== 'function') {
    return function() {
      var ret = apply('mix');
      /* istanbul ignore else */
      if (!Array.isArray(ret)) ret = [ ret ];
      return ret.concat(body);
    };
  }

  return function() {
    var ret = apply('mix');
    if (!Array.isArray(ret)) ret = [ ret ];
    return ret.concat(body.call(this, this, this.ctx));
  };
};

[ 'attrs', 'js', 'mods', 'elemMods' ].forEach(function(method) {
  AddMatch.prototype[ method + 'WrapBody'] = function(body) {
    var apply = this.refs.apply;

    return typeof body !== 'function' ?
      function() {
        return (this[method] = utils.extend(apply(method) || {}, body));
      } :
      function() {
        return (this[method] = utils.extend(apply(method) || {},
                               body.call(this, this, this.ctx)));
      };
  };
});

function CompilerOptions(options) {
  MatchBase.call(this);
  this.options = options;
}
inherits(CompilerOptions, MatchBase);
exports.CompilerOptions = CompilerOptions;

function PropertyMatch(key, value) {
  MatchBase.call(this);

  this.key = key;
  this.value = value;
}
inherits(PropertyMatch, MatchBase);
exports.PropertyMatch = PropertyMatch;

function CustomMatch(body) {
  MatchBase.call(this);

  this.body = body;
}
inherits(CustomMatch, MatchBase);
exports.CustomMatch = CustomMatch;

function Tree(options) {
  this.options = options;
  this.refs = this.options.refs;

  this.boundBody = this.body.bind(this);

  var methods = this.methods('body');
  for (var i = 0; i < methods.length; i++) {
    var method = methods[i];
    // NOTE: method.name is empty because of .bind()
    this.boundBody[Tree.methods[i]] = method;
  }

  this.queue = [];
  this.templates = [];
  this.initializers = [];
}
exports.Tree = Tree;

Tree.methods = [
  // Subpredicates:
  'match', 'block', 'elem', 'mod', 'elemMod',
  // Runtime related:
  'oninit', 'xjstOptions',
  // Output generators:
  'wrap', 'replace', 'extend', 'mode', 'def',
  'content', 'appendContent', 'prependContent',
  'attrs', 'addAttrs', 'js', 'addJs', 'mix', 'addMix',
  'mods', 'addMods', 'addElemMods', 'elemMods',
  'tag', 'cls', 'bem'
];

Tree.prototype.build = function(templates, apply) {
  var methods = this.methods('global').concat(apply);
  methods[0] = this.match.bind(this);

  templates.apply({}, methods);

  return {
    templates: this.templates.slice().reverse(),
    oninit: this.initializers
  };
};

function methodFactory(self, kind, name) {
  var method = self[name];
  var boundBody = self.boundBody;

  if (kind !== 'body') {
    if (name === 'replace' || name === 'extend' || name === 'wrap') {
      return function() {
        return method.apply(self, arguments);
      };
    }

    return function() {
      method.apply(self, arguments);
      return boundBody;
    };
  }

  return function() {
    var res = method.apply(self, arguments);

    // Insert body into last item
    var child = self.queue.pop();
    var last = self.queue[self.queue.length - 1];
    last.conditions = last.conditions.concat(child.conditions);
    last.children = last.children.concat(child.children);

    if (name === 'replace' || name === 'extend' || name === 'wrap')
      return res;
    return boundBody;
  };
}

Tree.prototype.methods = function(kind) {
  var out = new Array(Tree.methods.length);

  for (var i = 0; i < out.length; i++) {
    var name = Tree.methods[i];
    out[i] = methodFactory(this, kind, name);
  }

  return out;
};

// Called after all matches
Tree.prototype.flush = function(conditions, item) {
  var subcond = item.conditions ?
    conditions.concat(item.conditions) :
    item.conditions;

  for (var i = 0; i < item.children.length; i++) {
    var arg = item.children[i];

    // Go deeper
    if (arg instanceof Item) {
      this.flush(subcond, item.children[i]);

    // Body
    } else {
      if (this.isShortcutAllowed(arg, conditions)) {
        var keys = Object.keys(arg);
        for (var n = 0; n < keys.length; n++)
          this.addTemplate(
            conditions.concat(this.createMatch(keys[n])),
            arg[keys[n]]
          );
      } else {
        this.addTemplate(conditions, arg);
      }
    }
  }
};

Tree.prototype.createMatch = function(modeName) {
  switch (modeName) {
    case 'addAttrs':
      return [
        new PropertyMatch('_mode', 'attrs'),
        new AddMatch('attrs', this.refs)
      ];
    case 'addJs':
      return [
        new PropertyMatch('_mode', 'js'),
        new AddMatch('js', this.refs)
      ];
    case 'addMix':
      return [
        new PropertyMatch('_mode', 'mix'),
        new AddMatch('mix', this.refs)
      ];
    case 'addMods':
      return [
        new PropertyMatch('_mode', 'mods'),
        new AddMatch('mods', this.refs)
      ];
    case 'addElemMods':
      return [
        new PropertyMatch('_mode', 'elemMods'),
        new AddMatch('elemMods', this.refs)
      ];
    case 'appendContent':
    case 'prependContent':
      return [
        new PropertyMatch('_mode', 'content'),
        new AddMatch(modeName, this.refs)
      ];

    case 'wrap':
      return new WrapMatch(this.refs);

    case 'replace':
      return new ReplaceMatch(this.refs);

    case 'extend':
      return new ExtendMatch(this.refs);

    case 'def':
      return new PropertyMatch('_mode', 'default');

    default:
      return new PropertyMatch('_mode', modeName);
  }
};

Tree.prototype.addTemplate = function(conditions, arg) {
  var template = new Template(conditions, arg);
  template.wrap();
  this.templates.push(template);
};

Tree.prototype.body = function() {
  var children = new Array(arguments.length);
  for (var i = 0; i < arguments.length; i++)
    children[i] = arguments[i];

  var child = new Item(this, children);
  this.queue[this.queue.length - 1].children.push(child);

  if (this.queue.length === 1)
    this.flush([], this.queue.shift());

  return this.boundBody;
};

Tree.modsCheck = { mods: 1, elemMods: 1 };

Tree.checkConditions = function(conditions) {
  for (var i = 0; i < conditions.length; i++) {
    var condition = conditions[i];
    if (condition.key === 'block' ||
      condition.key === 'elem' ||
      (Array.isArray(condition.key) && Tree.modsCheck[condition.key[0]]) ||
      condition instanceof CustomMatch) continue;
    return false;
  }

  return true;
};

Tree.prototype.isShortcutAllowed = function(arg, conditions) {
  return typeof arg === 'object' &&
    arg !== null &&
    !Array.isArray(arg) &&
    Tree.checkConditions(conditions);
};

Tree.prototype.match = function() {
  var children = new Array(arguments.length);

  if (!arguments.length)
    throw new Error('.match() must have argument');

  for (var i = 0; i < arguments.length; i++) {
    var arg = arguments[i];
    if (typeof arg === 'function')
      arg = new CustomMatch(arg);

    if (!(arg instanceof MatchBase))
      throw new Error('Wrong .match() argument');

    children[i] = arg;
  }

  this.queue.push(new Item(this, children));

  return this.boundBody;
};

Tree.prototype.applyMode = function(args, mode) {
  if (args.length) {
    throw new Error('Predicate should not have arguments but ' +
      JSON.stringify(args) + ' passed');
  }

  return this.mode(mode);
};

Tree.prototype.xjstOptions = function(options) {
  this.queue.push(new Item(this, [
    new CompilerOptions(options)
  ]));
  return this.boundBody;
};

[ 'mode', 'elem', 'block' ].forEach(function(method) {
  Tree.prototype[method] = function(name) {
    return this.match(new PropertyMatch(
      method === 'mode' ? '_mode' : method, name));
  };
});

[ 'mod', 'elemMod' ].forEach(function(method) {
  Tree.prototype[method] = function(name, value) {
    return this.match(new PropertyMatch([ method + 's', name ],
                                  value === undefined ? true : String(value)));
  };
});

Tree.prototype.def = function() {
  return this.applyMode(arguments, 'default');
};

[
  'content', 'mix', 'bem', 'js', 'cls', 'attrs', 'tag', 'elemMods', 'mods'
].forEach(function(method) {
  Tree.prototype[method] = function() {
    return this.applyMode(arguments, method);
  };
});

[ 'appendContent', 'prependContent' ].forEach(function(method) {
  Tree.prototype[method] = function() {
    return this.content.apply(this, arguments)
      .match(new AddMatch(method, this.refs));
  };
});

function capitalize(s) {
  return s[0].toUpperCase() + s.slice(1);
}

[ 'mods', 'elemMods', 'attrs', 'js', 'mix' ].forEach(function(method) {
  Tree.prototype['add' + capitalize(method)] = function() {
    return this[method].apply(this, arguments)
      .match(new AddMatch(method, this.refs));
  };
});

Tree.prototype.wrap = function() {
  return this.def.apply(this, arguments).match(new WrapMatch(this.refs));
};

Tree.prototype.replace = function() {
  return this.def.apply(this, arguments).match(new ReplaceMatch(this.refs));
};

Tree.prototype.extend = function() {
  return this.def.apply(this, arguments).match(new ExtendMatch(this.refs));
};

Tree.prototype.oninit = function(fn) {
  this.initializers.push(fn);
};

},{"./utils":10,"inherits":11}],10:[function(require,module,exports){
var amp = '&amp;';
var lt = '&lt;';
var gt = '&gt;';
var quot = '&quot;';
var singleQuot = '&#39;';

var matchXmlRegExp = /[&<>]/;

function isEmpty(string) {
  return typeof string === 'undefined' ||
     string === null ||
     (typeof string === 'number' && isNaN(string));
}

exports.xmlEscape = function(string) {
  if (isEmpty(string))
    return '';

  var str = '' + string;
  var match = matchXmlRegExp.exec(str);

  if (!match)
    return str;

  var escape;
  var html = '';
  var index = 0;
  var lastIndex = 0;

  for (index = match.index; index < str.length; index++) {
    switch (str.charCodeAt(index)) {
      case 38: // &
        escape = amp;
        break;
      case 60: // <
        escape = lt;
        break;
      case 62: // >
        escape = gt;
        break;
      default:
        continue;
    }

    if (lastIndex !== index)
      html += str.substring(lastIndex, index);

    lastIndex = index + 1;
    html += escape;
  }

  return lastIndex !== index ?
    html + str.substring(lastIndex, index) :
    html;
};

var matchAttrRegExp = /["&<>]/;

exports.attrEscape = function(string) {
  if (isEmpty(string))
    return '';

  var str = '' + string;
  var match = matchAttrRegExp.exec(str);

  if (!match)
    return str;

  var escape;
  var html = '';
  var index = 0;
  var lastIndex = 0;

  for (index = match.index; index < str.length; index++) {
    switch (str.charCodeAt(index)) {
      case 34: // "
        escape = quot;
        break;
      case 38: // &
        escape = amp;
        break;
      case 60: // <
        escape = lt;
        break;
      case 62: // >
        escape = gt;
        break;
      default:
        continue;
    }

    if (lastIndex !== index)
      html += str.substring(lastIndex, index);

    lastIndex = index + 1;
    html += escape;
  }

  return lastIndex !== index ?
    html + str.substring(lastIndex, index) :
    html;
};

var matchJsAttrRegExp = /['&]/;

exports.jsAttrEscape = function(string) {
  if (isEmpty(string))
    return '';

  var str = '' + string;
  var match = matchJsAttrRegExp.exec(str);

  if (!match)
    return str;

  var escape;
  var html = '';
  var index = 0;
  var lastIndex = 0;

  for (index = match.index; index < str.length; index++) {
    switch (str.charCodeAt(index)) {
      case 38: // &
        escape = amp;
        break;
      case 39: // '
        escape = singleQuot;
        break;
      default:
        continue;
    }

    if (lastIndex !== index)
      html += str.substring(lastIndex, index);

    lastIndex = index + 1;
    html += escape;
  }

  return lastIndex !== index ?
    html + str.substring(lastIndex, index) :
    html;
};

exports.extend = function(o1, o2) {
  if (!o1 || !o2)
    return o1 || o2;

  var res = {};
  var n;

  for (n in o1)
    /* istanbul ignore else */
    if (o1.hasOwnProperty(n))
      res[n] = o1[n];
  for (n in o2)
    /* istanbul ignore else */
    if (o2.hasOwnProperty(n))
      res[n] = o2[n];
  return res;
};

var SHORT_TAGS = { // hash for quick check if tag short
  area: 1, base: 1, br: 1, col: 1, command: 1, embed: 1, hr: 1, img: 1,
  input: 1, keygen: 1, link: 1, meta: 1, param: 1, source: 1, wbr: 1
};

exports.isShortTag = function(t) {
  return SHORT_TAGS.hasOwnProperty(t);
};

exports.isSimple = function isSimple(obj) {
  if (!obj ||
      obj === true ||
      typeof obj === 'string' ||
      typeof obj === 'number')
    return true;

  if (!obj.block &&
      !obj.elem &&
      !obj.tag &&
      !obj.cls &&
      !obj.attrs &&
      obj.hasOwnProperty('html') &&
      isSimple(obj.html))
    return true;

  return false;
};

exports.isObj = function(val) {
  return val && typeof val === 'object' && !Array.isArray(val) &&
    val !== null;
};

var uniqCount = 0;
var uniqId = +new Date();
var uniqExpando = '__' + uniqId;
var uniqPrefix = 'uniq' + uniqId;

function getUniq() {
  return uniqPrefix + (++uniqCount);
}
exports.getUniq = getUniq;

exports.identify = function(obj, onlyGet) {
  if (!obj)
    return getUniq();
  if (onlyGet || obj[uniqExpando])
    return obj[uniqExpando];

  var u = getUniq();
  obj[uniqExpando] = u;
  return u;
};

exports.fnToString = function(code) {
  // It is fine to compile without templates at first
  if (!code)
    return '';

  if (typeof code === 'function') {
    // Examples for regular function
    //   function () { … }
    //   function name() { … }
    //   function (a, b) { … }
    //   function name(a, b) { … }
    //
    // Examples for arrow function
    //   () => { … }
    //   (a, b) => { … }
    //   _ => { … }

    code = code.toString();
    code = code.replace(
      code.indexOf('function') === 0 ?
      /^function\s*[^{]+{|}$/g :
      /^(_|\(\w|[^=>]+\))\s=>\s{|}$/g,
    '');
  }

  return code;
};

/**
 * regexp for check may attribute be unquoted
 *
 * https://www.w3.org/TR/html4/intro/sgmltut.html#h-3.2.2
 * https://www.w3.org/TR/html5/syntax.html#attributes
 */
var UNQUOTED_ATTR_REGEXP = /^[:\w.-]+$/;

exports.isUnquotedAttr = function(str) {
  return str && UNQUOTED_ATTR_REGEXP.exec(str);
};

},{}],11:[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}]},{},[2])(2)
});
