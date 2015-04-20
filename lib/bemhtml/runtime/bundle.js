(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.BEMHTML = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Template = require('./tree').Template;
var PropertyMatch = require('./tree').PropertyMatch;
var Match = require('./match').Match;

function Entity(bemhtml, block, elem, templates) {
  this.bemhtml = bemhtml;

  this.block = null;
  this.elem = null;
  this.jsClass = null;

  // "Fast modes"
  this.def = new Match(this);
  this.tag = new Match(this);
  this.attrs = new Match(this);
  this.mod = new Match(this);
  this.js = new Match(this);
  this.mix = new Match(this);
  this.bem = new Match(this);
  this.cls = new Match(this);
  this.content = new Match(this);

  // "Slow modes"
  this.rest = {};

  // Initialize
  this.init(block, elem);
  this.initModes(templates);
}
exports.Entity = Entity;

Entity.prototype.init = function init(block, elem) {
  this.block = block;
  this.elem = elem;

  // Class for jsParams
  if (this.elem === undefined)
    this.jsClass = this.block;
  else
    this.jsClass = this.block + '__' + this.elem;
};

Entity.prototype.initModes = function initModes(templates) {
  for (var i = 0; i < templates.length; i++) {
    var template = templates[i];

    for (var j = template.predicates.length - 1; j >= 0; j--) {
      var pred = template.predicates[j];
      if (!(pred instanceof PropertyMatch))
        continue;

      if (pred.key !== '_mode')
        continue;

      template.predicates.splice(j, 1);

      if (pred.value === 'tag' ||
          pred.value === 'attrs' ||
          pred.value === 'js' ||
          pred.value === 'mix' ||
          pred.value === 'bem' ||
          pred.value === 'cls' ||
          pred.value === 'content' ||
          pred.value === 'default') {
        if (pred.value === 'default')
          this.rest[pred.value] = this.def;
        else
          this.rest[pred.value] = this[pred.value];
      } else {
        if (!this.rest.hasOwnProperty(pred.value))
          this.rest[pred.value] = new Match(this);
      }

      // All templates should go there anyway
      this.rest[pred.value].push(template);
      break;
    }

    if (j === -1)
      this.def.push(template);
  }

  // Default .content() template for applyNext()
  if (this.content.count !== 0)
    this.content.push(new Template([], contentMode));

  // .def() default
  if (this.def.count !== 0) {
    var self = this;
    this.def.push(new Template([], function() {
      return self.defaultBody(this);
    }));
  }
};

function contentMode() {
  return this.ctx.content;
}

// NOTE: This could be potentially compiled into inlined invokations
Entity.prototype.run = function run(context) {
  if (this.def.count !== 0)
    return this.def.exec(context);

  return this.defaultBody(context);
};

Entity.prototype.defaultBody = function defaultBody(context) {
  var tag = context.ctx.tag;
  if (tag === undefined)
    tag = this.tag.exec(context);

  var js;
  if (context.ctx.js !== false)
    js = this.js.exec(context);

  var bem = this.bem.exec(context);
  var cls = this.cls.exec(context);
  var mix = this.mix.exec(context);
  var attrs = this.attrs.exec(context);
  var content = this.content.exec(context);

  // Default content
  if (this.content.count === 0 && content === undefined)
    content = context.ctx.content;

  return this.bemhtml.render(context,
                             this,
                             tag,
                             js,
                             bem,
                             cls,
                             mix,
                             attrs,
                             content);
};

},{"./match":3,"./tree":4}],2:[function(require,module,exports){
var Tree = require('./tree').Tree;
var PropertyMatch = require('./tree').PropertyMatch;
var Entity = require('./entity').Entity;
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
  var tree = new Tree({
    refs: {
      applyCtx: applyCtxWrap,
      local: localWrap
    }
  });
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
    var elem = undefined;
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
    if (elem == undefined)
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
  if (utils.isSimple(context))
    return context + '';

  var oldCtx = this.context.ctx;
  this.context.ctx = context;
  if (context.block)
    this.context.block = context.block;
  if (context.mods)
    this.context.mods = context.mods;
  if (context.elemMods)
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
  if (isBEM || cls) {
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

    // NOTE: maybe we need to make an array for quicker serialization
    attrs = utils.extend(attrs, ctx.attrs);
    if (attrs) {
      var name; // TODO: do something with OmetaJS and YUI Compressor
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

BEMHTML.prototype.renderNoTag = function renderNoTag(context) {
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

function Context() {
  this.ctx = null;
  this.block = '';
  this.mods = null;
  this.elemMods = null;
}

},{"./entity":1,"./tree":4,"./utils":5}],3:[function(require,module,exports){
var PropertyMatch = require('./tree').PropertyMatch;
var PropertyAbsent = require('./tree').PropertyAbsent;
var CustomMatch = require('./tree').CustomMatch;

function Match(entity) {
  this.entity = entity;
  this.bemhtml = this.entity.bemhtml;
  this.templates = [];

  // applyNext index
  this.index = 0;

  this.count = 0;
}
exports.Match = Match;

Match.prototype.push = function push(template) {
  this.templates.push(new MatchTemplate(this, template));
  this.count++;
};

Match.prototype.exec = function exec(context) {
  // Fast case - no templates
  if (this.count === this.index)
    return undefined;

  for (var i = this.index; i < this.count; i++) {
    var template = this.templates[i];
    for (var j = template.predicates.length - 1; j >= 0; j--) {
      var pred = template.predicates[j];
      if (!pred.exec(context))
        break;
    }

    // All predicates matched!
    if (j === -1)
      break;
  }

  var oldIndex = this.index;
  var oldMatch = this.bemhtml.match;
  this.index = i + 1;
  this.bemhtml.match = this;

  var out;
  if (typeof template.body === 'function')
    out = template.body.call(context);
  else
    out = template.body;

  this.index = oldIndex;
  this.bemhtml.match = oldMatch;

  return out;
};

function MatchTemplate(mode, template) {
  this.mode = mode;
  this.predicates = new Array(template.predicates.length);
  this.body = template.body;

  for (var i = 0; i < this.predicates.length; i++) {
    var pred = template.predicates[i];
    if (pred instanceof PropertyMatch) {
      if (Array.isArray(pred.key))
        this.predicates[i] = new MatchNested(this, pred);
      else
        this.predicates[i] = new MatchProperty(this, pred);
    } else if (pred instanceof PropertyAbsent) {
      this.predicates[i] = new MatchAbsent(this, pred);
    } else if (pred instanceof CustomMatch) {
      this.predicates[i] = new MatchCustom(this, pred);
    } else {
      throw new Error('Unknown predicate type: ' + pred.constructor.name);
    }
  }
}
exports.MatchTemplate = MatchTemplate;

function MatchProperty(template, pred) {
  this.template = template;
  this.key = pred.key;
  this.value = pred.value;
}

MatchProperty.prototype.exec = function exec(context) {
  return context[this.key] === this.value;
};

function MatchNested(template, pred) {
  this.template = template;
  this.keys = pred.key;
  this.value = pred.value;
}

MatchNested.prototype.exec = function exec(context) {
  var val = context;
  for (var i = 0; i < this.keys.length - 1; i++) {
    val = val[this.keys[i]];
    if (!val)
      return false;
  }

  return val[this.keys[i]] === this.value;
};

function MatchAbsent(template, pred) {
  this.template = template;
  this.key = pred.key;
}

MatchAbsent.prototype.exec = function exec(context) {
  return !context[this.key];
};

function MatchCustom(template, pred) {
  this.template = template;
  this.body = pred.body;
}

MatchCustom.prototype.exec = function exec(context) {
  return this.body.call(context);
};

},{"./tree":4}],4:[function(require,module,exports){
function Tree(options) {
  this.options = options;
  this.refs = this.options.refs;

  this.boundBody = this.body.bind(this);

  this.methods('body').forEach(function(method, i) {
    // NOTE: method.name is empty because of .bind()
    this.boundBody[Tree.methods[i]] = method;
  }, this);

  this.queue = [];
  this.templates = [];
}
exports.Tree = Tree;

Tree.methods = [
  'match', 'elemMatch', 'block', 'elem', 'mode', 'mod',
  'elemMod', 'def', 'tag', 'attrs', 'cls', 'js', 'jsAttr',
  'bem', 'mix', 'content', 'replace', 'extend'
];

Tree.prototype.build = function build(templates, apply) {
  var methods = this.methods('global').concat(apply);
  methods[0] = this.match.bind(this);

  templates.apply({}, methods);

  return this.templates.slice().reverse();
};

Tree.prototype.methods = function methods(kind) {
  return Tree.methods.map(function(name) {
    var self = this;
    var method = this[name];
    var boundBody = this.boundBody;

    if (kind !== 'body') {
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
      last.args = last.args.concat(child.args);
      last.children = last.children.concat(child.children);

      if (name === 'replace' || name === 'extend')
        return res;
      return boundBody;
    };
  }, this);
};

// Called after all matches
Tree.prototype.flush = function flush(conditions, item) {
  if (item.children.length > 0) {
    // Sub-template
    var subcond = conditions.concat(item.args);

    // Reverse order
    for (var i = item.children.length - 1; i >= 0; i--)
    this.flush(subcond, item.children[i]);
  } else {
    // Body
    this.templates.push(new Template(conditions, item.args[0]));
  }
};

Tree.prototype.body = function body() {
  var args = new Array(arguments.length);
  for (var i = 0; i < arguments.length; i++)
    args[i] = arguments[i];

  var child = new Item(this, args);
  this.queue[this.queue.length - 1].children.push(child);

  if (this.queue.length === 1)
    this.flush([], this.queue.shift());

  return this.boundBody;
}

Tree.prototype.match = function match() {
  var args = new Array(arguments.length);
  for (var i = 0; i < arguments.length; i++) {
    var arg = arguments[i];
    if (typeof arg === 'function')
      arg = new CustomMatch(arg);
    args[i] = arg;
  }

  this.queue.push(new Item(this, args));

  return this.boundBody;
}

Tree.prototype.block = function block(name) {
  return this.match(new PropertyMatch('block', name));
};

Tree.prototype.elemMatch = function elemMatch() {
  return this.match.apply(this, arguments);
}

Tree.prototype.elem = function elem(name) {
  return this.match(new PropertyMatch('elem', name));
};

Tree.prototype.mode = function mode(name) {
  return this.match(new PropertyMatch('_mode', name));
};

Tree.prototype.mod = function mod(name, value) {
  return this.match(new PropertyMatch([ 'mods', name ], value));
}

Tree.prototype.elemMod = function elemMod(name, value) {
  return this.match(new PropertyMatch([ 'elemMods', name ], value));
}

Tree.prototype.def = function def() { return this.mode('default'); };
Tree.prototype.tag = function tag() { return this.mode('tag'); };
Tree.prototype.attrs = function attrs() { return this.mode('attrs'); };
Tree.prototype.cls = function cls() { return this.mode('cls'); };
Tree.prototype.js = function js() { return this.mode('js'); };
Tree.prototype.jsAttr = function jsAttr() { return this.mode('jsAttr'); };
Tree.prototype.bem = function bem() { return this.mode('bem'); };
Tree.prototype.mix = function mix() { return this.mode('mix'); };
Tree.prototype.content = function content() { return this.mode('content'); };

Tree.prototype.replace = function replace() {
  var adaptor = this.def();
  var applyCtx = this.refs.applyCtx;
  return function (body) {
    return adaptor(function () { return applyCtx(body()) });
  };
};

Tree.prototype.extend = function extend() {
  var adaptor = this.def();
  var local = this.refs.local;
  var applyCtx = this.refs.applyCtx;
  return function (body) {
    return adaptor(function () {
      var changes = {};

      var obj = body();
      var keys = Object.keys(obj);
      for (var i = 0; i < keys.length; i++)
        changes['ctx.' + keys[i]] = obj[keys[i]];

      return local(changes)(function() {
        return applyCtx(this.ctx);
      });
    });
  };
};

function Template(predicates, body) {
  this.predicates = predicates;
  this.body = body;
}
exports.Template = Template;

function Item(tree, args) {
  this.args = args;
  this.children = [];

  for (var i = args.length - 1; i >= 0; i--) {
    var arg = args[i];
    if (arg !== tree.boundBody)
      continue;

    args[i] = tree.queue.pop();
  }

  for (var i = 0; i < args.length; i++) {
    if (!(args[i] instanceof Item))
      continue;

    var arg = args[i];
    args.splice(i, 1);
    i--;
    this.children.push(arg);
  }
}

function PropertyMatch(key, value) {
  this.key = key;
  this.value = value;
}
exports.PropertyMatch = PropertyMatch;

function PropertyAbsent(key) {
  this.key = key;
}
exports.PropertyAbsent = PropertyAbsent;

function CustomMatch(body) {
  this.body = body;
}
exports.CustomMatch = CustomMatch;

},{}],5:[function(require,module,exports){
/**
 * Separator for modifiers and their values
 * @const
 * @type String
 */
var MOD_DELIM = '_',

/**
 * Separator between block names and a nested element
 * @const
 * @type String
 */
    ELEM_DELIM = '__',

/**
 * Pattern for acceptable names of elements and modifiers
 * @const
 * @type String
 */
    NAME_PATTERN = '[a-zA-Z0-9-]+';

function buildModPostfix(modName, modVal) {
  var res = MOD_DELIM + modName;
  if(modVal !== true) res += MOD_DELIM + modVal;
  return res;
}
exports.buildModPostfix = buildModPostfix;

function buildBlockClass(name, modName, modVal) {
  var res = name;
  if(modVal) res += buildModPostfix(modName, modVal);
  return res;
}
exports.buildBlockClass = buildBlockClass;

function buildElemClass(block, name, modName, modVal) {
  var res = buildBlockClass(block) + ELEM_DELIM + name;
  if(modVal) res += buildModPostfix(modName, modVal);
  return res;
}
exports.buildElemClass = buildElemClass;

var buildEscape = (function() {
  var ts = { '"' : '&quot;', '&' : '&amp;', '<' : '&lt;', '>' : '&gt;' };
  var f = function(t) { return ts[t] || t; };
  return function(r) {
    r = new RegExp(r, 'g');
    return function(s) { return ('' + s).replace(r, f); };
  };
})();

exports.xmlEscape = buildEscape('[&<>]');
exports.attrEscape = buildEscape('["&<>]');

exports.extend = function extend(o1, o2) {
  if (!o1 || !o2)
    return o1 || o2;

  var res = {};
  var n;

  for (n in o1)
    if (o1.hasOwnProperty(n))
      res[n] = o1[n];
  for (n in o2)
    if (o2.hasOwnProperty(n))
      res[n] = o2[n];
  return res;
};

var SHORT_TAGS = { // хэш для быстрого определения, является ли тэг коротким
  area : 1, base : 1, br : 1, col : 1, command : 1, embed : 1, hr : 1, img : 1,
  input : 1, keygen : 1, link : 1, meta : 1, param : 1, source : 1, wbr : 1 };

exports.isShortTag = function isShortTag(t) {
  return SHORT_TAGS.hasOwnProperty(t);
};

exports.isSimple = function isSimple(obj) {
    if (!obj || obj === true) return true;
    return typeof obj === 'string' || typeof obj === 'number';
};

},{}]},{},[2])(2)
});