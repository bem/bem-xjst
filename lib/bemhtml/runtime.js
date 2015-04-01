module.exports = function() {
  "xjst: no reverse";
  var __$that = this,
      __$blockRef = {},
      __$elemRef = {},
      __$depth = 0;

  // Called after all matches
  function __$flush(item) {
    function apply(conditions, item) {
      if (item && item.__$children) {
        // Sub-template
        var subcond = conditions.concat(item.__$cond);

        // Reverse order
        for (var i = item.__$children.length - 1; i >= 0; i--)
          apply(subcond, item.__$children[i]);
      } else {
        var hasBlock = false;
        var hasElem = false;
        conditions = conditions.filter(function(cond) {
          if (cond === __$blockRef) {
            hasBlock = true;
            return false;
          }
          if (cond === __$elemRef) {
            hasElem = true;
            return false;
          }
          return true;
        });
        if (hasBlock && !hasElem) conditions.push(!__$that.elem);

        // Body
        template.apply(null, conditions)(item);
      }
    }

    __$depth = 0;
    apply([], item);
  };

  // Matching
  function match() {
    function fn() {
      var args = Array.prototype.slice.call(arguments);

      args.forEach(function(arg) {
        fn.__$children.push(arg);

        if (!arg)
          return;

        // Sub-template
        if (arg.__$children)
          arg.__$parent = fn;
      });

      // Handle match().match()
      var res = fn;
      while (res.__$parent) res = res.__$parent;

      if (res.__$depth === 0) {
        __$flush(res);
      }

      return res;
    };
    fn.__$depth = __$depth++;
    fn.__$children = [];
    fn.__$parent = null;
    fn.__$cond = Array.prototype.slice.call(arguments);

    fn.match = match;
    fn.elemMatch = elemMatch;
    fn.block = block;
    fn.elem = elem;
    fn.mode = mode;
    fn.mod = mod;
    fn.elemMod = elemMod;
    fn.def = def;
    fn.tag = tag;
    fn.attrs = attrs;
    fn.cls = cls;
    fn.js = js;
    fn.jsAttr = jsAttr;
    fn.bem = bem;
    fn.mix = mix;
    fn.content = content;
    fn.replace = replace;
    fn.extend = extend;

    // match().match()
    if (this && this.__$children) {
      this.__$children.push(fn);
      fn.__$parent = this;
    }

    return fn;
  };

  function block(name) {
    return match.call(this, __$blockRef, __$that.block === name);
  };

  function elemMatch() {
    var args = Array.prototype.slice.call(arguments);
    return match.apply(this, [__$elemRef].concat(args));
  }

  function elem(name) {
    return match.call(this, __$elemRef, __$that.elem === name);
  };

  function mode(name) {
    return match.call(this, __$that._mode === name);
  };

  function mod(name, value) {
    return match.call(this, __$that.mods, function() {
      return __$that.mods[name] === value;
    });
  }

  function elemMod(name, value) {
    return match.call(this, __$that.elemMods, function() {
      return __$that.elemMods[name] === value;
    });
  }

  function def() { return mode.call(this, 'default'); };
  function tag() { return mode.call(this, 'tag'); };
  function attrs() { return mode.call(this,'attrs'); };
  function cls() { return mode.call(this, 'cls'); };
  function js() { return mode.call(this, 'js'); };
  function jsAttr() { return mode.call(this, 'jsAttr'); };
  function bem() { return mode.call(this, 'bem'); };
  function mix() { return mode.call(this, 'mix'); };
  function content() { return mode.call(this, 'content'); };
  function replace() {
    var self = this;
    return function (body) {
      return self.def()(function () { return applyCtx(body()) });
    };
  };
  function extend() {
    var self = this;
    return function (body) {
      return self.def()(function () {
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
