var inherits = require('inherits');

function Template(predicates, body) {
  this.predicates = predicates;
  this.body = body;
}
exports.Template = Template;

function MatchBase() {
}
exports.MatchBase = MatchBase;

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

function PropertyMatch(key, value) {
  MatchBase.call(this);

  this.key = key;
  this.value = value;
}
inherits(PropertyMatch, MatchBase);
exports.PropertyMatch = PropertyMatch;

function PropertyAbsent(key) {
  MatchBase.call(this);

  this.key = key;
}
inherits(PropertyAbsent, MatchBase);
exports.PropertyAbsent = PropertyAbsent;

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
  'match', 'elemMatch', 'block', 'elem', 'mode', 'mod',
  'elemMod', 'def', 'tag', 'attrs', 'cls', 'js', 'jsAttr',
  'bem', 'mix', 'content', 'replace', 'extend', 'oninit'
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

    if (name === 'replace' || name === 'extend')
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
    if (arg instanceof Item)
      this.flush(subcond, item.children[i]);

    // Body
    else
      this.templates.push(new Template(conditions, arg));
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
    children[i] = arg;
  }

  this.queue.push(new Item(this, children));

  return this.boundBody;
};

Tree.prototype.block = function block(name) {
  return this.match(new PropertyMatch('block', name));
};

Tree.prototype.elemMatch = function elemMatch() {
  return this.match.apply(this, arguments);
};

Tree.prototype.elem = function elem(name) {
  return this.match(new PropertyMatch('elem', name));
};

Tree.prototype.mode = function mode(name) {
  return this.match(new PropertyMatch('_mode', name));
};

Tree.prototype.mod = function mod(name, value) {
  return this.match(new PropertyMatch([ 'mods', name ], value));
};

Tree.prototype.elemMod = function elemMod(name, value) {
  return this.match(new PropertyMatch([ 'elemMods', name ], value));
};

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
  return function replaceBody(body) {
    return adaptor(function replaceAdaptor() {
      return applyCtx(body.call(this));
    });
  };
};

Tree.prototype.extend = function extend() {
  var adaptor = this.def();
  var local = this.refs.local;
  var applyCtx = this.refs.applyCtx;
  return function localBody(body) {
    return adaptor(function localAdaptor() {
      var changes = {};

      var obj = body.call(this);
      var keys = Object.keys(obj);
      for (var i = 0; i < keys.length; i++)
        changes['ctx.' + keys[i]] = obj[keys[i]];

      return local(changes)(function preApplyCtx() {
        return applyCtx(this.ctx);
      });
    });
  };
};

Tree.prototype.oninit = function oninit(fn) {
  this.initializers.push(fn);
};
