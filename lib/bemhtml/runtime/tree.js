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
    for (var i = 0; i < item.children.length; i++)
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
};

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
  return function (body) {
    return adaptor(function() {
      return applyCtx(body());
    });
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
