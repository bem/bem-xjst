var assert = require('minimalistic-assert');
var inherits = require('inherits');
var utils = require('./utils');

function Template(predicates, body) {
  this.predicates = predicates;

  this.body = body;
}
exports.Template = Template;

Template.prototype.wrap = function wrap() {
  var body = this.body;
  for (var i = 0; i < this.predicates.length; i++) {
    var pred = this.predicates[i];
    body = pred.wrapBody(body);
  }
  this.body = body;
};

Template.prototype.clone = function clone() {
  return new Template(this.predicates.slice(), this.body);
};

function MatchBase() {
}
exports.MatchBase = MatchBase;

MatchBase.prototype.wrapBody = function wrapBody(body) {
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

function AddMatch(mode, refs) {
  MatchBase.call(this);

  this.mode = mode;
  this.refs = refs;
}
inherits(AddMatch, MatchBase);
exports.AddMatch = AddMatch;

AddMatch.prototype.wrapBody = function wrapBody(body) {
  return this[this.mode + 'WrapBody'](body);
};

AddMatch.prototype.modsWrapBody = function modsWrapBody(body) {
  var applyNext = this.refs.applyNext;

  if (typeof body !== 'function') {
    return function inlineModsAdaptor() {
      this.mods = utils.extend(this.mods, body);
      return applyNext();
    };
  }

  return function modsAdaptor() {
    this.mods = utils.extend(this.mods, body.call(this, this, this.ctx));
    return applyNext();
  };
};

AddMatch.prototype.elemModsWrapBody = function elemModsWrapBody(body) {
  var applyNext = this.refs.applyNext;

  if (typeof body !== 'function') {
    return function inlineElemModsAdaptor() {
      this.elemMods = utils.extend(this.elemMods, body);
      return applyNext();
    };
  }

  return function elemModsAdaptor() {
    this.elemMods = utils.extend(this.elemMods,
                                 body.call(this, this, this.ctx));
    return applyNext();
  };
};

function WrapMatch(refs) {
  MatchBase.call(this);

  this.refs = refs;
}
inherits(WrapMatch, MatchBase);
exports.WrapMatch = WrapMatch;

WrapMatch.prototype.wrapBody = function wrapBody(body) {
  var applyCtx = this.refs.applyCtx;

  if (typeof body !== 'function') {
    return function inlineAdaptor() {
      return applyCtx(body);
    };
  }

  return function wrapAdaptor() {
    return applyCtx(body.call(this, this, this.ctx));
  };
};

function ReplaceMatch(refs) {
  MatchBase.call(this);

  this.refs = refs;
}
inherits(ReplaceMatch, MatchBase);
exports.ReplaceMatch = ReplaceMatch;

ReplaceMatch.prototype.wrapBody = function wrapBody(body) {
  var applyCtx = this.refs.applyCtx;

  if (typeof body !== 'function') {
    return function inlineAdaptor() {
      return applyCtx(body);
    };
  }

  return function replaceAdaptor() {
    return applyCtx(body.call(this, this, this.ctx));
  };
};

function ExtendMatch(refs) {
  MatchBase.call(this);

  this.refs = refs;
}
inherits(ExtendMatch, MatchBase);
exports.ExtendMatch = ExtendMatch;

ExtendMatch.prototype.wrapBody = function wrapBody(body) {
  var applyCtx = this.refs.applyCtx;
  var local = this.refs.local;

  if (typeof body !== 'function') {
    return function inlineAdaptor() {
      var changes = {};

      var keys = Object.keys(body);
      for (var i = 0; i < keys.length; i++)
        changes['ctx.' + keys[i]] = body[keys[i]];

      return local(changes)(function preApplyCtx() {
        return applyCtx(this.ctx);
      });
    };
  }

  return function localAdaptor() {
    var changes = {};

    var obj = body.call(this);
    var keys = Object.keys(obj);
    for (var i = 0; i < keys.length; i++)
      changes['ctx.' + keys[i]] = obj[keys[i]];

    return local(changes)(function preApplyCtx() {
      return applyCtx(this.ctx);
    });
  };
};

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
  'match', 'wrap', 'block', 'elem', 'mode', 'mod',
  'elemMod', 'def', 'tag', 'attrs', 'cls', 'js',
  'bem', 'mix', 'content', 'replace', 'extend', 'oninit',
  'xjstOptions', 'mods', 'elemMods'
];

Tree.prototype.build = function build(templates, apply) {
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
      return function wrapExtended() {
        return method.apply(self, arguments);
      };
    }

    return function wrapNotBody() {
      method.apply(self, arguments);
      return boundBody;
    };
  }

  return function wrapBody() {
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

Tree.prototype.methods = function methods(kind) {
  var out = new Array(Tree.methods.length);

  for (var i = 0; i < out.length; i++) {
    var name = Tree.methods[i];
    out[i] = methodFactory(this, kind, name);
  }

  return out;
};

// Called after all matches
Tree.prototype.flush = function flush(conditions, item) {
  var subcond;

  if (item.conditions)
    subcond = conditions.concat(item.conditions);
  else
    subcond = item.conditions;

  for (var i = 0; i < item.children.length; i++) {
    var arg = item.children[i];

    // Go deeper
    if (arg instanceof Item) {
      this.flush(subcond, item.children[i]);

    // Body
    } else {
      var template = new Template(conditions, arg);
      template.wrap();
      this.templates.push(template);
    }
  }
};

Tree.prototype.body = function body() {
  var children = new Array(arguments.length);
  for (var i = 0; i < arguments.length; i++)
    children[i] = arguments[i];

  var child = new Item(this, children);
  this.queue[this.queue.length - 1].children.push(child);

  if (this.queue.length === 1)
    this.flush([], this.queue.shift());

  return this.boundBody;
};

Tree.prototype.match = function match() {
  var children = new Array(arguments.length);
  for (var i = 0; i < arguments.length; i++) {
    var arg = arguments[i];
    if (typeof arg === 'function')
      arg = new CustomMatch(arg);
    assert(arg instanceof MatchBase, 'Wrong .match() argument');
    children[i] = arg;
  }

  this.queue.push(new Item(this, children));

  return this.boundBody;
};

Tree.prototype.applyMode = function applyMode(args, mode) {
  if (args.length) {
    throw new Error('Predicate should not have arguments but ' +
      JSON.stringify(args) + ' passed');
  }

  return this.mode(mode);
};

Tree.prototype.wrap = function wrap() {
  return this.def.apply(this, arguments).match(new WrapMatch(this.refs));
};

Tree.prototype.xjstOptions = function xjstOptions(options) {
  this.queue.push(new Item(this, [
    new CompilerOptions(options)
  ]));
  return this.boundBody;
};

Tree.prototype.block = function block(name) {
  return this.match(new PropertyMatch('block', name));
};

Tree.prototype.elem = function elem(name) {
  return this.match(new PropertyMatch('elem', name));
};

Tree.prototype.mode = function mode(name) {
  return this.match(new PropertyMatch('_mode', name));
};

Tree.prototype.mod = function mod(name, value) {
  return this.match(new PropertyMatch([ 'mods', name ], String(value)));
};

Tree.prototype.elemMod = function elemMod(name, value) {
  return this.match(new PropertyMatch([ 'elemMods', name ], String(value)));
};

Tree.prototype.mods = function mods() {
  return this.def.apply(this, arguments)
    .match(new AddMatch('mods', this.refs));
};

Tree.prototype.elemMods = function elemMods() {
  return this.def.apply(this, arguments)
    .match(new AddMatch('elemMods', this.refs));
};

Tree.prototype.def = function def() {
  return this.applyMode(arguments, 'default');
};

Tree.prototype.tag = function tag() {
  return this.applyMode(arguments, 'tag');
};

Tree.prototype.attrs = function attrs() {
  return this.applyMode(arguments, 'attrs');
};

Tree.prototype.cls = function cls() {
  return this.applyMode(arguments, 'cls');
};

Tree.prototype.js = function js() {
  return this.applyMode(arguments, 'js');
};

Tree.prototype.bem = function bem() {
  return this.applyMode(arguments, 'bem');
};

Tree.prototype.mix = function mix() {
  return this.applyMode(arguments, 'mix');
};

Tree.prototype.content = function content() {
  return this.applyMode(arguments, 'content');
};

Tree.prototype.replace = function replace() {
  return this.def.apply(this, arguments).match(new ReplaceMatch(this.refs));
};

Tree.prototype.extend = function extend() {
  return this.def.apply(this, arguments).match(new ExtendMatch(this.refs));
};

Tree.prototype.oninit = function oninit(fn) {
  this.initializers.push(fn);
};
