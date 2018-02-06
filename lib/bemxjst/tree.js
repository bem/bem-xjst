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
