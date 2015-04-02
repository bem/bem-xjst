module.exports = function() {
  "xjst: no reverse";
  var __$that = this,
      __$blockRef = {},
      __$elemRef = {},
      __$queue = [];

  // Called after all matches
  function __$flush(conditions, item) {
    if (item.children.length > 0) {
      // Sub-template
      var subcond = conditions.concat(item.args);

      // Reverse order
      for (var i = item.children.length - 1; i >= 0; i--)
        __$flush(subcond, item.children[i]);
    } else {
      var hasBlock = false;
      var hasElem = false;
      var filtered = [];
      for (var i = 0; i < conditions.length; i++) {
        var cond = conditions[i];
        if (cond === __$blockRef) {
          hasBlock = true;
          continue;
        }
        if (cond === __$elemRef) {
          hasElem = true;
          continue;
        }
        filtered.push(cond);
      }
      if (hasBlock && !hasElem) filtered.push(!__$that.elem);

      // Body
      template.apply(null, filtered)(item.args[0]);
    }
  };

  function $$Predicates(args) {
    this.args = args;
    this.children = [];

    for (var i = args.length - 1; i >= 0; i--) {
      var arg = args[i];
      if (arg !== $$bodyMatch)
        continue;

      args[i] = __$queue.pop();
    }

    for (var i = 0; i < args.length; i++) {
      if (!(args[i] instanceof $$Predicates))
        continue;

      var arg = args[i];
      args.splice(i, 1);
      i--;
      this.children.push(arg);
    }
  }

  function $$bodyMatch() {
    var args = new Array(arguments.length);
    for (var i = 0; i < arguments.length; i++)
      args[i] = arguments[i];

    var child = new $$Predicates(args);
    __$queue[__$queue.length - 1].children.push(child);

    if (__$queue.length === 1)
      __$flush([], __$queue.shift());

    return $$bodyMatch;
  }

  function match() {
    var args = new Array(arguments.length);
    for (var i = 0; i < arguments.length; i++)
      args[i] = arguments[i];

    __$queue.push(new $$Predicates(args));

    return $$bodyMatch;
  }

  var __$methods = [
    match, elemMatch, block, elem, mode, mod,
    elemMod, def, tag, attrs, cls, js, jsAttr,
    bem, mix, content, replace, extend
  ];
  function $$setMethods(fn) {
    __$methods.forEach(function(method) {
      fn[method.name] = function methodWrap() {
        var res = method.apply(this, arguments);
        var child = __$queue.pop();
        var last = __$queue[__$queue.length - 1];
        last.args = last.args.concat(child.args);
        last.children = last.children.concat(child.children);
        return res;
      };
    });
  }
  $$setMethods(match);
  $$setMethods($$bodyMatch);

  function block(name) {
    return match(__$blockRef, __$that.block === name, 'block ' + name);
  };

  function elemMatch() {
    var args = Array.prototype.slice.call(arguments);
    return match.apply(this, [__$elemRef].concat(args));
  }

  function elem(name) {
    return match(__$elemRef, __$that.elem === name, 'elem ' + name);
  };

  function mode(name) {
    return match(__$that._mode === name, 'mode ' + name);
  };

  function mod(name, value) {
    return match(__$that.mods, function() {
      return __$that.mods[name] === value;
    });
  }

  function elemMod(name, value) {
    return match(__$that.elemMods, function() {
      return __$that.elemMods[name] === value;
    });
  }

  function def() { return mode('default'); };
  function tag() { return mode('tag'); };
  function attrs() { return mode('attrs'); };
  function cls() { return mode('cls'); };
  function js() { return mode('js'); };
  function jsAttr() { return mode('jsAttr'); };
  function bem() { return mode('bem'); };
  function mix() { return mode('mix'); };
  function content() { return mode('content'); };
  function replace() {
    var adaptor = def();
    return function (body) {
      return adaptor(function () { return applyCtx(body()) });
    };
  };
  function extend() {
    var adaptor = def();
    return function (body) {
      return adaptor(function () {
        return applyCtx(this.extend(this.ctx, body()));
      });
    };
  };

  // Apply by mode, local by mode and applyCtx
  apply = function(apply) {
    return function bemApply() {
      var args = Array.prototype.map.call(arguments, function(arg) {
        if (typeof arg === 'string') {
          return { _mode: arg };
        } else {
          return arg;
        }
      });
      return apply.apply(null, args);
    };
  }(apply);

  applyNext = function(applyNext) {
    return function bemApplyNext() {
      var args = Array.prototype.map.call(arguments, function(arg) {
        if (typeof arg === 'string') {
          return { _mode: arg };
        } else {
          return arg;
        }
      });
      return applyNext.apply(null, args);
    };
  }(applyNext);

  local = function(local) {
    return function bemLocal() {
      var args = Array.prototype.map.call(arguments, function(arg) {
        if (typeof arg === 'string') {
          return { _mode: arg };
        } else {
          return arg;
        }
      });
      return local.apply(null, args);
    };
  }(local);

  function applyCtx() {
    var context = arguments[arguments.length - 1];
    var rest = Array.prototype.slice.call(arguments, 0, -1);
    return applyNext.apply(this, [{ _mode: '', ctx: context }].concat(rest));
  };
  "xjst: end no reverse";
}.toString().replace(/^function\s*\(\)\s*{|}$/g, '');
