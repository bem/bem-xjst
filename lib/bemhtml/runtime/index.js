var Tree = require('./tree').Tree;
var Template = require('./tree').Template;
var PropertyMatch = require('./tree').PropertyMatch;
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

BEMHTML.locals = Tree.methods.concat('local', 'applyCtx', 'applyNext');

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

  function localWrap(changes) {
    return function(body) {
      return self.local(changes, body);
    };
  }

  var out = tree.build(templates, [
    localWrap,
    applyCtxWrap,
    function applyNextWrap() { return self.applyNext(); }
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
  this.context.block = '';
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

BEMHTML.prototype.exportApply = function exportApply(exports) {
  var self = this;
  exports.apply = function apply(context) {
    self.reset();
    return self.run(context || this);
  };
};

function Entity(bemhtml, block, elem, templates) {
  this.bemhtml = bemhtml;

  this.block = null;
  this.elem = null;
  this.jsClass = null;

  // "Fast modes"
  this.def = new ModeMatch(this);
  this.tag = new ModeMatch(this);
  this.attrs = new ModeMatch(this);
  this.mod = new ModeMatch(this);
  this.js = new ModeMatch(this);
  this.mix = new ModeMatch(this);
  this.bem = new ModeMatch(this);
  this.cls = new ModeMatch(this);
  this.content = new ModeMatch(this);

  // "Slow modes"
  this.rest = null;

  // Initialize
  this.init(block, elem);
  this.initModes(templates);
}

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

      if (pred.value === 'tag' ||
          pred.value === 'attrs' ||
          pred.value === 'js' ||
          pred.value === 'mix' ||
          pred.value === 'bem' ||
          pred.value === 'cls' ||
          pred.value === 'content' ||
          pred.value === 'default') {
        template.predicates.splice(j, 1);
        if (pred.value === 'default')
          this.def.push(template);
        else
          this[pred.value].push(template);
        break;
      }
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

function ModeMatch(entity) {
  this.entity = entity;
  this.bemhtml = this.entity.bemhtml;
  this.templates = [];

  // applyNext index
  this.index = 0;

  this.count = 0;
}

ModeMatch.prototype.push = function push(template) {
  this.templates.push(template);
  this.count++;
};

ModeMatch.prototype.exec = function exec(context) {
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

function Context(ctx) {
  this.ctx = ctx;
  this.block = '';
}
