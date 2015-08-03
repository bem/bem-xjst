var bemhtml = require('../bemhtml');
var assert = require('assert');
var vm = require('vm');
var esprima = require('esprima');
var estraverse = require('estraverse');
var uglify = require('uglify-js');
var xjst = require('xjst');

function Compiler(options) {
  options = this.options = options || {};
  if (options.cache === true) {
    if (options.optimize === false || options['no-opt']) {
      throw new Error('Cache doesn\'t work with development build');
    }
  }

  this.globals = {
    _mode: '$$mode',
    block: '$$block',
    elem: '$$elem',
    elemMods: '$$elemMods',
    mods: '$$mods'
  };
  this.options.globalInit = {
    mode: '_mode',
    block: 'block',
    elem: 'elem',
    elemMods: 'elemMods',
    mods: 'mods',
    once: false,
    wrap: false
  };
  this.options.globals = {
    mode: '',
    block: '',
    elem: '',
    elemMods: null,
    mods: null,
    once: false,
    wrap: false
  };
  this.options.scoreFilter = this._bumpMode;
  this.globalKeys = Object.keys(this.globals);
  this.globalValues = this.globalKeys.map(function(key) {
    return this.globals[key];
  }, this);

  this.matches = {
    match: true, elemMatch: true,
    block: true, elem: true, mode: true, mod: true, elemMod: true,
    def: true, tag: true, attrs: true, cls: true,
    js: true, jsAttr: true, bem: true, mix: true, content: true,
    replace: true, extend: true, once: true, wrap: true
  };
};
exports.Compiler = Compiler;

// Ensure that `this._mode` predicate is always top-level
Compiler.prototype._bumpMode = function _bumpMode(ast) {
  if (ast.type !== 'MemberExpression' || ast.computed)
    return 0;
  var obj = ast.object;
  var prop = ast.property;
  if (obj.type !== 'Identifier' || obj.name !== '__$ctx')
    return 0;
  if (prop.type !== 'Identifier' || prop.name !== '_mode')
    return 0;

  return Infinity;
};

Compiler.prototype.pretranslate = function pretranslate(ast) {
  // Ok, I admit it. Translation process is a bit fucked.
  var self = this;
  var allowed = {
    Program: true,
    ExpressionStatement: true,
    CallExpression: true,
    MemberExpression: true
  };
  ast = estraverse.replace(ast, {
    enter: function(ast, parent, notify) {
      // Do not get too deep
      if (!allowed[ast.type]) {
        this.skip();
      }
    },
    leave: function(ast, parent) {
      // `replace' detected in children would bubble up here
      var propagate = ast.propagate;

      // 1. mark all match calls
      ast = self.markMatches(ast);

      propagate = ast.propagate || propagate;

      // Propagate `replace' flag if detected in markMatches or set in children
      if (propagate && ast.type !== 'CallExpression')
        parent.propagate = propagate;

      // 2. replace all custom matches with match() calls
      ast = self.replaceCustom(ast);

      // 3. Merge match(cond).match(cond) into match(cond, cond) and
      //    match(cond)(match(cond)) into match()(match(cond, cond)
      ast = self.mergeMatches(ast);

      // Recover `replace' flag possibly removed by replaceCustom & mergeMatches
      if (propagate) ast.propagate = propagate;
      return ast;
    }
  });

  // 4. Flatten every statement and replace local/apply/applyNext/applyCtx
  for (var i = 0; i < ast.body.length; i++) {
    var stmt = ast.body[i];
    if (stmt.type !== 'ExpressionStatement' ||
        !stmt.expression.bemMarked) {
      continue;
    }

    var exprs = this.flatten(stmt.expression);
    ast.body.splice.apply(ast.body, [ i, 1 ].concat(exprs.map(function(expr) {
      return {
        type: 'ExpressionStatement',
        expression: expr
      }
    })));
    i += exprs.length - 1;
  }

  return ast;
};

Compiler.prototype.translate = function translate(ast, code) {
  ast = this.pretranslate(ast);
  ast = xjst.translate(ast, code, this.options);

  // Replace known context lookups with context vars
  var cr = new ContextReplacer(this.globals, this.globalKeys);
  ast = cr.run(ast);
  ast.body = ast.body.concat(cr.getApplyWrap().body);
  ast.body = ast.body.concat(cr.getCallWrap().body);
  return ast;
};

Compiler.prototype.markMatches = function markMatches(ast) {
  // Propagate marks through member expressions
  if (ast.type === 'MemberExpression' &&
      ast.object.type === 'CallExpression' && ast.object.bemMarked) {
    return {
      type: 'MemberExpression',
      computed: ast.computed,
      object: ast.object,
      property: ast.property,
      bemMarked: true
    };
  }

  if (ast.type !== 'CallExpression') {
    // When detected desugar replace() and extend() into def(), propagate
    // extendedMode so that their bodies get desugared too
    if (ast.type === 'Identifier' &&
        (ast.name === 'replace' || ast.name === 'extend')) {
      if (!ast.propagate)
        ast.propagate = {};
      ast.propagate.extendedMode = ast.name;
      ast.name = 'def';
    }

    if (ast.type === 'Identifier' &&
        (ast.name === 'once' || ast.name === 'wrap')) {
      if (!ast.propagate)
        ast.propagate = {};
      ast.propagate.wrapMode = ast.name;

      // Wrap implies some syntax sugar too
      if (ast.name === 'wrap')
        ast.propagate.extendedMode = 'wrap';
    }
    return ast;
  }

  // Propagate marks through calls
  if (ast.callee.type === 'CallExpression' && ast.callee.bemMarked) {
    return {
      type: 'CallExpression',
      callee: ast.callee,
      arguments: ast.arguments,
      bemMarked: true
    };
  }

  // match()
  // NOTE: Marks are created here
  if (ast.callee.type === 'Identifier') {
    var name = ast.callee.name;
    if (!this.matches[name]) return ast;
    return {
      type: 'CallExpression',
      callee: ast.callee,
      arguments: ast.arguments,
      bemMarked: true
    };
  }

  // .match()
  if (ast.callee.type === 'MemberExpression' && ast.callee.bemMarked) {
    var type = ast.callee.property.type;
    assert(type === 'Literal' || type === 'Identifier',
           'match().prop could be only literal or identifier');
    var prop = ast.callee.property.name || ast.callee.property.value;
    if (!this.matches[prop]) return ast;
    return {
      type: 'CallExpression',
      callee: ast.callee,
      arguments: ast.arguments,
      bemMarked: true
    };
  }

  return ast;
};

function onceImpl() {
  return !$$once;
}

function wrapImpl() {
  return $$wrap !== this.ctx && $$mode === 'default';
}

Compiler.prototype.getAST = function getAST(fn) {
  // Cache
  if (fn.ast)
    return fn.ast;

  var ast = esprima.parse(fn.toString());

  ast.body[0].type = 'FunctionExpression';
  ast.body[0].id = null;

  fn.ast = ast.body[0];
  return fn.ast;
}

Compiler.prototype.getBinop = function getBinop(name, args) {
  var lhs;
  var rhs;
  if (name === 'elemMatch') {
    return args;
  } else if (name === 'block' || name === 'elem' || name === 'mode') {
    lhs = name === 'mode' ? '_mode' : name;
    rhs = args[0];
    assert.equal(args.length, 1,
                 'block/elem/mode predicates must have only one argument');
  } else if (name === 'mod' || name === 'elemMod') {
    assert.equal(args.length, 2,
                 'mod() predicates must have two arguments');
    // Modificator/Elem-Modificator predicate
    return [{
      type: 'MemberExpression',
      computed: false,
      object: { type: 'ThisExpression' },
      property: { type: 'Identifier', name: name + 's' }
    }, {
      type: 'BinaryExpression',
      operator: '===',
      left: {
        type: 'MemberExpression',
        computed: true,
        object: {
          type: 'MemberExpression',
          computed: false,
          object: { type: 'ThisExpression' },
          property: { type: 'Identifier', name: name + 's' }
        },
        property: args[0]
      },
      right: args[1]
    }];
  } else if (name === 'once' || name === 'wrap') {
    return [ this.getAST(name === 'once' ? onceImpl : wrapImpl) ];
  } else {
    // Mode predicates
    assert.equal(args.length, 0,
                 'mode literal predicates can\'t have arguments');
    lhs = '_mode';
    rhs = { type: 'Literal', value: name === 'def' ? 'default' : name };
  }
  assert(lhs && rhs);

  return [{
    type: 'BinaryExpression',
    operator: '===',
    left: {
      type: 'MemberExpression',
      computed: false,
      object: { type: 'ThisExpression' },
      property: { type: 'Identifier', name: lhs }
    },
    right: rhs
  }];
};

Compiler.prototype.replaceCustom = function replaceCustom(ast) {
  if (ast.type !== 'CallExpression' || !ast.bemMarked) return ast;

  var callee = ast.callee;
  if (callee.type === 'Identifier') {
    var name = callee.name;

    if (!this.matches[name]) {
      return ast;
    }

    // Just replace predicates
    if (name === 'match') return ast;

    return {
      type: 'CallExpression',
      _blockMatch: name === 'block',
      _elemMatch: name === 'elemMatch' || name === 'elem',
      callee: {
        type: 'Identifier',
        name: 'match'
      },
      arguments: this.getBinop(name, ast.arguments),
      bemMarked: true
    };
  } else if (callee.type === 'MemberExpression') {
    var property = callee.property;
    var name = property.name || property.value;
    if (!this.matches[name]) {
      return ast;
    }

    // Just replace predicates
    if (name === 'match') return ast;

    return {
      type: 'CallExpression',
      _blockMatch: name === 'block',
      _elemMatch: name === 'elemMatch' || name === 'elem',
      callee: {
        type: 'MemberExpression',
        computed: false,
        object: callee.object,
        property: { type: 'Identifier', name: 'match' }
      },
      arguments: this.getBinop(name, ast.arguments),
      bemMarked: true
    };
  }

  return ast;
};

Compiler.prototype.mergeMatches = function mergeMatches(ast) {
  if (ast.type !== 'CallExpression' || !ast.bemMarked) return ast;

  // (match(...).match)(...) => match(...)
  if (ast.callee.type === 'MemberExpression') {
    var obj = ast.callee.object;
    assert.equal(obj.type, 'CallExpression');

    ast = {
      type: 'CallExpression',
      _blockMatch: ast._blockMatch || obj._blockMatch,
      _elemMatch: ast._elemMatch || obj._elemMatch,
      callee: obj.callee,
      arguments: ast.arguments.concat(obj.arguments),
      propagate: ast.propagate || obj.propagate || obj.callee.propagate,
      bemMarked: true
    };
  }

  return ast;
};

Compiler.prototype.flatten = function flatten(expr) {
  function addNoElem(predicates, blockMatch, elemMatch) {
    if (blockMatch && !elemMatch) {
      return predicates.concat({
        type: 'UnaryExpression',
        operator: '!',
        argument: {
          type: 'MemberExpression',
          computed: false,
          property: { type: 'Identifier', name: 'elem' },
          object: { type: 'ThisExpression' }
        }
      });
    }

    return predicates;
  }

  function dive(expr, blockMatch, elemMatch, propagate) {
    // At this point only match(...)(match(...)(...), body) expressions are
    // present.
    assert.equal(expr.type, 'CallExpression');
    assert.equal(expr.callee.type, 'CallExpression');

    propagate = expr.propagate || expr.callee.propagate || propagate;

    blockMatch = blockMatch || expr.callee._blockMatch || false;
    elemMatch = elemMatch || expr.callee._elemMatch || false;

    var predicates = expr.callee.arguments;

    var res = [];

    // Visit sub-templates and bodies
    expr.arguments.forEach(function(arg) {
      if (arg.bemMarked) {
        dive(arg, blockMatch, elemMatch, propagate).forEach(function(t) {
          var tblockMatch = blockMatch || t.blockMatch;
          var telemMatch = elemMatch || t.elemMatch;

          res.push({
            predicates: addNoElem(predicates, tblockMatch, telemMatch),
            predicates: predicates.concat(t.predicates),
            propagate: t.propagate,
            blockMatch: tblockMatch,
            elemMatch: telemMatch,
            body: t.body
          });
        });
      } else {
        // Body
        res.push({
          predicates: addNoElem(predicates, blockMatch, elemMatch),
          blockMatch: blockMatch,
          elemMatch: elemMatch,
          propagate: propagate,
          body: arg
        });
      }
    });

    return res;
  }

  return dive(expr).map(function(t) {
    return {
      type: 'CallExpression',
      callee: {
        type: 'CallExpression',
        callee: { type: 'Identifier', name: 'template' },
        arguments: t.predicates
      },
      arguments: [ this.replaceBody(t.body, t.propagate) ]
    };
  }, this);
};

Compiler.prototype.desugarExtended = function desugarExtended(body, mode) {
  if (!mode)
    return;

  body.body = estraverse.replace(body.body, {
    enter: function (ast, parent) {
      // don't mess with nested scopes
      if (ast.type === 'FunctionDeclaration' ||
          ast.type === 'FunctionExpression') {
        this.skip();
      }
    },
    leave: function (ast) {
      if (ast.type === 'ReturnStatement') {
        var applyCtxArgNode,
            applyCtxNode;

        if (mode === 'replace' || mode === 'wrap') {
          applyCtxArgNode = ast.argument;
        } else if (mode === 'extend') {
          applyCtxArgNode = {
            type: 'CallExpression',
            callee: {
              type: 'MemberExpression',
              computed: false,
              object: { type: 'ThisExpression' },
              property: { type: 'Identifier', name: 'extend' }
            },
            arguments: [
              {
                type: 'MemberExpression',
                computed: false,
                object: { type: 'ThisExpression' },
                property: { type: 'Identifier', name: 'ctx' }
              },
              ast.argument
            ]
          };
        }

        applyCtxNode = {
          type: 'CallExpression',
          callee: { type: 'Identifier', name: 'applyCtx'},
          arguments: [ applyCtxArgNode ]
        };
        return {type: 'ReturnStatement', argument: applyCtxNode};
      }
      return ast;
    }
  });
};

Compiler.prototype.desugarWrap = function desugarWrap(body, mode) {
  if (!mode)
    return body;

  if (body.type !== 'FunctionExpression') {
    body = {
      type: 'FunctionExpression',
      id: null,
      params: [],
      defaults: [],
      rest: null,
      generator: false,
      expression: false,
      body: {
        type: 'BlockStatement',
        body: [ {
          type: 'ReturnStatement',
          argument: body
        } ]
      }
    }
  }

  var expr;
  if (mode === 'once') {
    // $$once = true
    expr = {
      type: 'AssignmentExpression',
      operator: '=',
      left: { type: 'Identifier', name: '$$once' },
      right: { type: 'Literal', value: true }
    };
  } else {
    // $$wrap = this.ctx
    expr = {
      type: 'AssignmentExpression',
      operator: '=',
      left: { type: 'Identifier', name: '$$wrap' },
      right: {
        type: 'MemberExpression',
        computed: false,
        object: { type: 'ThisExpression' },
        property: { type: 'Identifier', name: 'ctx' }
      }
    };
  }

  body.body.body.unshift({ type: 'ExpressionStatement', expression: expr });

  return body;
};

Compiler.prototype.replaceBody = function replaceBody(body, propagate) {
  var self = this;

  if (!propagate)
    propagate = {};

  // desugar bodies in replace() and extend()
  this.desugarExtended(body, propagate.extendedMode);

  // desugar `once()`/`wrap()`
  body = this.desugarWrap(body, propagate.wrapMode);

  return estraverse.replace(body, {
    leave: function(node) {
      if (node.type !== 'CallExpression') return;

      // apply(locals)
      if (node.callee.type === 'Identifier') {
        var name = node.callee.name;
        if (name !== 'apply' &&
            name !== 'applyNext' &&
            name !== 'applyCtx') {
          return;
        }

        return name === 'applyCtx' ? self.replaceApplyCtx(node) :
                                     self.replaceApply(node);
      // local(locals)(body)
      } else if (node.callee.type === 'CallExpression' &&
                 node.callee.callee.type === 'Identifier') {
        var name = node.callee.callee.name;
        if (name !== 'local') return;

        return self.replaceLocal(node);
      }
    }
  });
};

Compiler.prototype.getModeObj = function getModeObj(mode) {
  return {
    type: 'ObjectExpression',
    properties: [{
      type: 'Property',
      key: { type: 'Literal', value: '_mode' },
      value: mode,
      kind: 'init'
    }]
  };
};

Compiler.prototype.replaceApplyCtx = function replaceApplyCtx(ast) {
  // applyCtx(newCtx) => applyNext({ _mode: '', ctx: newCtx })
  assert(ast.arguments.length >= 1,
         'applyCtx() must have at least one argument');
  var changes = [{
    type: 'ObjectExpression',
    properties: [{
      type: 'Property',
      key: { type: 'Literal', value: '_mode' },
      value: { type: 'Literal', value: '' },
      kind: 'init'
    }, {
      type: 'Property',
      key: { type: 'Literal', value: 'ctx' },
      value: ast.arguments[ast.arguments.length - 1],
      kind: 'init'
    }]
  }].concat(ast.arguments.slice(0, -1));
  return this.traceChanges(changes, {
    type: 'CallExpression',
    callee: { type: 'Identifier', name: 'applyNext' },
    arguments: changes
  });
};

Compiler.prototype.replaceApply = function replaceApply(ast) {
  // apply(mode, {})
  var changes = ast.arguments.map(function(arg) {
    if (arg.type !== 'Literal') return arg;
    return this.getModeObj(arg);
  }, this);

  return this.traceChanges(changes, {
    type: 'CallExpression',
    callee: ast.callee,
    arguments: changes
  });
};

Compiler.prototype.replaceLocal = function replaceLocal(ast) {
  // (local(mode, {}))(body)
  var changes = ast.callee.arguments.map(function(arg) {
    if (arg.type !== 'Literal') return arg;
    return this.getModeObj(arg);
  }, this);

  return this.traceChanges(changes, {
    type: 'CallExpression',
    callee: {
      type: 'CallExpression',
      callee: ast.callee.callee,
      arguments: changes
    },
    arguments: ast.arguments
  });
};

Compiler.prototype.traceChanges = function traceChanges(changes, expr) {
  if (this.options.cache !== true) return expr;

  // Translate changes AST array to pairs of key/value
  var pairs = changes.reduce(function(prev, cur) {
    return prev.concat(cur.properties);
  }, []).map(function(property) {
    return {
      key: property.key.name || property.key.value,
      value: property.value
    };
  });

  // Filter changes that could be logged
  // (Literal values and movements)
  pairs = pairs.map(function(pair) {
    function toArr(arr) {
      return {
        type: 'ArrayExpression',
        elements: arr.map(function(elem) {
          return { type: 'Literal', value: elem }
        })
      };
    }
    var key = toArr(pair.key.split(/\./g));

    var val = pair.value;
    if (val.type === 'Literal') return { key: key, val: val, path: null };

    var path = [];
    while (val.type === 'MemberExpression' && !val.computed) {
      path.unshift(val.property.name);
      val = val.object;
    }

    if (val.type === 'ThisExpression') {
      return {
        key: key,
        val: { type: 'Literal', value: 1 },
        path: toArr(path)
      };
    }

    return null;
  });

  var data = pairs.filter(function(pair) {
    return pair !== null;
  }).map(function(pair) {
    return {
      type: 'ArrayExpression',
      elements: pair.path ? [pair.key, pair.path, pair.val] :
                            [pair.key, pair.val]
    };
  });

  // No changes
  if (data.length === 0) return expr;

  var history = {
    type: 'MemberExpression',
    computed: false,
    property: { type: 'Identifier', name: '__$history' },
    object: { type: 'ThisExpression' }
  };

  // this.__$history.push(...)
  var save = {
    type: 'CallExpression',
    callee: {
      type: 'MemberExpression',
      computed: false,
      property: { type: 'Identifier', name: 'push' },
      object: history
    },
    arguments: data
  };

  // this.__$history = this.__$history.slice(0, -data.len);
  var restore = {
    type: 'AssignmentExpression',
    operator: '=',
    left: history,
    right: {
      type: 'CallExpression',
      callee: {
        type: 'MemberExpression',
        computed: false,
        property: { type: 'Identifier', name: 'slice' },
        object: history
      },
      arguments: [
        { type: 'Literal', value: 0 },
        { type: 'Literal', value: -data.length }
      ]
    }
  };

  function check(expr) {
    return {
      type: 'IfStatement',
      test: history,
      consequent: { type: 'ExpressionStatement', expression: expr },
      alternate: null
    };
  }

  // function() { push_history(); invoke local; }.call(this)
  var res = { type: 'Identifier', name: '__$r' };
  return {
    type: 'CallExpression',
    arguments: [{ type: 'ThisExpression' }],
    callee: {
      type: 'MemberExpression',
      computed: false,
      property: { type: 'Identifier', name: 'call' },
      object: {
        type: 'FunctionExpression',
        id: null,
        params: [],
        defaults: [],
        rest: null,
        generator: false,
        expression: false,
        body: {
          type: 'BlockStatement',
          body: [{
            type: 'VariableDeclaration',
            kind: 'var',
            declarations: [{
              type: 'VariableDeclarator',
              id: res,
              init: null
            }]
          },
          check(save),
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              operator: '=',
              left: res,
              right: expr
            }
          },
          check(restore),
          {
            type: 'ReturnStatement',
            argument: res
          }]
        }
      }
    }
  };
};

Compiler.prototype.pregenerate = function pregenerate(code) {
  var ast = esprima.parse(code, {
    loc: true
  });

  ast = this.pretranslate(ast);

  return uglify.AST_Node.from_mozilla_ast(ast).print_to_string();
};

Compiler.prototype.wrap = function wrap(code) {
  if (!this.options.wrap)
    return code;

  var opts = this.options;
  var exportName = opts.exportName || 'BEMHTML';
  var deps = opts.modulesDeps;
  var modulesDeps = deps ? ', ' + JSON.stringify(Object.keys(deps)) : '';
  var modulesProvidedDeps =  deps ? ', ' + Object.keys(deps).map(function(module) {
    var providedName = deps[module];
    return providedName === true ? module : providedName;
  }).join(', ') : '';

  return '(function(g) {\n' +
         '  var __bem_xjst = function(exports' + modulesProvidedDeps + ') {\n' +
         '     ' + code + ';\n' +
         '     return exports;\n' +
         '  }\n' +
         '  var defineAsGlobal = true;\n' +
         '  if(typeof exports === "object") {\n' +
         '    exports["' + exportName + '"] = __bem_xjst({}' + modulesProvidedDeps + ');\n' +
         '    defineAsGlobal = false;\n' +
         '  }\n' +
         '  if(typeof modules === "object") {\n' +
         '    modules.define("' + exportName + '"' + modulesDeps + ',\n' +
         '      function(provide' + modulesProvidedDeps + ') {\n' +
         '        provide(__bem_xjst({}' + modulesProvidedDeps + ')) });\n' +
         '    defineAsGlobal = false;\n' +
         '  }\n' +
         '  defineAsGlobal && (g["' + exportName + '"] = __bem_xjst({}' + modulesProvidedDeps + '));\n' +
         '})(this);'
};

Compiler.prototype.generate = function generate(code) {
  if (this.options['no-opt'] || this.options.optimize === false) {
    var source = '/// -------------------------------------\n' +
                 '/// --------- BEM-XJST Runtime Start ----\n' +
                 '/// -------------------------------------\n' +
                 bemhtml.runtime + ';\n' +
                 ';\n' +
                 '/// -------------------------------------\n' +
                 '/// --------- BEM-XJST Runtime End ------\n' +
                 '/// -------------------------------------\n' +
                 '\n' +
                 '/// -------------------------------------\n' +
                 '/// ------ BEM-XJST User-code Start -----\n' +
                 '/// -------------------------------------\n' +
                 code + ';\n' +
                 '/// -------------------------------------\n' +
                 '/// ------ BEM-XJST User-code End -------\n' +
                 '/// -------------------------------------\n' +
                 '__$flush();\n';
    return this.wrap(xjst.generate(source, this.options));
  }

  var ast = esprima.parse(code, {
    loc: true
  });

  ast = this.translate(ast, code);

  var out = uglify.AST_Node.from_mozilla_ast(ast).print_to_string({ beautify: true });

  return this.wrap(out);
};

Compiler.prototype.compile = function compile(code) {
  var out = this.generate(code),
      exports = {};

  vm.runInNewContext(out, { exports: exports, console: console });

  return exports;
};

function ContextReplacer(properties, propKeys) {
  this.properties = properties;
  this.propKeys = propKeys;

  // estraverse context
  this.estraverse = null;

  this.applyc = [];
  this.map = null;

  this.needCallWrap = false;
  this.needApplyWrap = false;
};

ContextReplacer.prototype.translateProp = function translateProp(prop) {
  if (this.properties.hasOwnProperty(prop))
    return this.properties[prop];
  else
    return false;
};

ContextReplacer.prototype.isHash = function isHash(node, kind) {
  var val = node.init;
  if (!val)
    return false;

  if (val.type !== 'ObjectExpression')
    return false;

  var props = val.properties;

  return props.every(function(prop) {
    var name = prop.key.name;
    var val = prop.value;

    return val.type === 'FunctionExpression' ||
           val.type === 'Identifier';
  });
};

ContextReplacer.prototype.run = function run(ast) {
  var self = this;
  return estraverse.replace(ast, {
    enter: function(node, parent) {
      self.estraverse = this;
      return self.enterNode(node, parent);
    },
    leave: function(node) {
      return self.leaveNode(node);
    }
  });
};

ContextReplacer.prototype.isApplyc = function isApplyc(node) {
  var isFunction = node.type === 'FunctionDeclaration' ||
                   node.type === 'FunctionExpression';
  var id = node.id && node.id.name;

  if (!isFunction)
    return false;

  if (this.applyc.length === 0) {
    if (this.map !== null || /^(applyc|__\$[bg]\d+)$/.test(id))
      return true;
    return false;
  }

  if (/^__\$lb/.test(id))
    return true;

  return false;
};

ContextReplacer.prototype.isMap = function isMap(node) {
  if (this.applyc.length !== 0 || node.type !== 'VariableDeclarator')
    return false;

  if (/^__(h\d+_\w|\$m\d+)$/.test(node.id && node.id.name))
    return this.isHash(node, 'new');

  return false;
};

ContextReplacer.prototype.enterNode = function enterNode(node, parent) {
  var isFunction = node.type === 'FunctionDeclaration' ||
                   node.type === 'FunctionExpression';

  if (this.isApplyc(node)) {
    this.applyc.push(node);
  } else if (this.isMap(node)) {
    this.map = node;
  } else if (this.applyc.length === 0) {
    return;
  }

  if (this.applyc[this.applyc.length - 1] !== node && isFunction) {
    this.replaceEscapingApplies(node, parent);
    return this.estraverse.skip();
  }

  var res;

  res = this.handleMember(node);
  if (res)
    return res;

  res = this.handleEscapingThis(node, parent);
  if (res)
    return res;
};

ContextReplacer.prototype.handleMember = function handleMember(node) {
  if (node.type !== 'MemberExpression' || node.computed)
    return;

  var obj = node.object;
  if (obj.type !== 'Identifier' || obj.name !== '__$ctx')
    return;

  var prop = this.translateProp(node.property.name || node.property.value);
  if (!prop)
    return;

  return { type: 'Identifier', name: prop };
};

ContextReplacer.prototype.isMapCall = function isMapCall(node) {
  if (node.type !== 'LogicalExpression' || node.operator !== '||')
    return false;

  var match = false;
  estraverse.traverse(node, {
    enter: function(node) {
      if (node.type === 'Identifier' && /^__(h|\$m)\d+(_\w)?$/.test(node.name)) {
        match = true;
        this['break']();
      }
    }
  });

  return match;
};

ContextReplacer.prototype.handleEscapingThis =
    function handleEscapingThis(node, parent) {
  if (node.type !== 'Identifier' || node.name !== '__$ctx')
    return;

  if (/Expression$/.test(parent.type)) {
    if (parent.type === 'FunctionExpression')
      return;

    var isMember = parent.type === 'MemberExpression' &&
                   (!parent.computed || parent.property.type === 'Literal');
    if (isMember)
      return;

    if (parent.type === 'CallExpression') {
      var c = parent.callee;

      // Ignore __$[bg]\d(__$ctx) calls
      if (c.type === 'Identifier' && /^(applyc|__\$[bgmr]+\d+)$/.test(c.name))
        return;

      // Ignore __$wrapThis(__$ctx)
      if (c.type === 'Identifier' && c.name === '__$wrapThis')
        return;

      // Ignore (typeof x === 'number' ? __$m\.n[x] : __$m.d)(__$ctx)
      if (this.isMapCall(c))
        return;
    }
  } else if (parent.type === 'VariableDeclarator') {
    // Internal, xjst-thing
    if (parent.id.type === 'Identifier' && parent.id.name === '__this')
      return;

    if (parent.init !== node)
      return;
  } else {
    return;
  }

  this.needCallWrap = true;

  // Wrap in call
  return {
    type: 'CallExpression',
    callee: {
      type: 'Identifier',
      name: '__$wrapThis'
    },
    arguments: [ node ]
  };
};

ContextReplacer.prototype.replaceEscapingApplies =
    function replaceEscapingApplies(node, parent) {
  if (this.applyc.length === 0)
    return;

  var self = this;
  estraverse.replace(node, {
    enter: function(node, parent) {
      return self.handleEscapingApply(node, parent);
    }
  });
};

ContextReplacer.prototype.handleEscapingApply =
    function handleEscapingApply(node, parent) {
  if (node.type !== 'CallExpression')
    return;

  var callee = node.callee;
  if (callee.type !== 'Identifier' || callee.name !== 'applyc')
    return;

  this.needApplyWrap = true;

  // Wrap in call
  return {
    type: 'CallExpression',
    callee: {
      type: 'Identifier',
      name: '__$wrapApply'
    },
    arguments: [ callee ].concat(node.arguments)
  };
};

ContextReplacer.prototype.leaveNode = function leaveNode(node) {
  if (node === this.applyc[this.applyc.length - 1])
    this.applyc.pop();
  if (node === this.map)
    this.map = null;
};

// TODO(indutny): cache results
ContextReplacer.prototype.getCallWrap = function getCallWrap() {
  if (!this.needCallWrap)
    return { body: [] };

  return esprima.parse('function __$wrapThis(ctx) {\n' +
      this.propKeys.map(function(key) {
        return 'ctx.' + key + ' = ' + this.properties[key] + ';';
      }, this).join('\n') + '\n' +
      'return ctx;\n' +
      '};');
};

ContextReplacer.prototype.getApplyWrap = function getApplyWrap() {
  if (!this.needApplyWrap)
    return { body: [] };

  return esprima.parse('function __$wrapApply(applyc, ctx) {\n' +
      // var __t$prop = $$prop;
      // $$prop = this.prop;
      this.propKeys.map(function(key) {
        return 'var __t$' + key + ' = ' + this.properties[key] + ';\n' +
               this.properties[key] + ' = ctx.' + key + ';';
      }, this).join('\n') + '\n' +
      'var r = applyc(ctx);\n' +
      // $$prop = __t$prop;
      this.propKeys.map(function(key) {
        return this.properties[key] + ' = __t$' + key + ';';
      }, this).join('\n') + '\n' +
     'return r;\n' +
     '};');
};
