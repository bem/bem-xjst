var inherits = require('inherits');
var utils = require('../bemxjst/utils');
var Entity = require('../bemhtml/entity').Entity;
var BEMXJST = require('../bemxjst');

var ALREADY_RENDERED_PROP_NAME = '__bem-xjst-rendered';

function VIDOM() {
  BEMXJST.apply(this, arguments);
}

inherits(VIDOM, BEMXJST);
module.exports = VIDOM;

VIDOM.prototype.Entity = Entity;

VIDOM.prototype.exportApply = function exportApply(exports) {
  function cleanUpResults(_res) {
    var res = _res.slice(0);
    return res.map(function(item) {
      if (typeof item === 'object' && !Array.isArray(item) && item !== null) {
        delete item[ALREADY_RENDERED_PROP_NAME];

        if (Object.keys(item).length === 0) {
          item = null;
        }

        return item;
      }

      if (Array.isArray(item)) {
        return cleanUpResults(item);
      }

      return item;
    });
  }

  var self = this;

  this.oninit.push(function(exports) {
    exports.apply = function apply(context) {
      var res = self.run(context);

      if (Array.isArray(res[0])) {
        res = [ 'div', null ].concat(res);
      }

      if (Array.isArray(res)) {
        res = cleanUpResults(res);
      }

      return res;
    };
  });

  BEMXJST.prototype.exportApply.call(this, exports);
};

VIDOM.isAlreadyRendered = function(entity) {
  return Array.isArray(entity) && entity.length > 1 &&
    typeof entity[0] === 'string' && typeof entity[1] === 'object' &&
    entity[1][ALREADY_RENDERED_PROP_NAME];
};

VIDOM.isReactElement = function(item) {
  return typeof item === 'object' && item !== null && !!item.$$typeof;
};

VIDOM.prototype._run = function _run(context) {
  if (VIDOM.isAlreadyRendered(context)) {
    return context;
  }

  if (VIDOM.isReactElement(context)) {
    return context;
  }

  return BEMXJST.prototype._run.call(this, context);
};

VIDOM.prototype.runMany = function runMany(arr) {
  // recalc position
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
  if (!prevNotNewList) {
    context.position = prevPos;
  }

  var out = arr.filter(function(a) {
    return !!a;
  }).map(function(a) {
    return this._run(a);
  }.bind(this));

  if (out.filter(function(o) {
    return typeof o === 'string';
  }).length === out.length) {
    out = out.join('');
  }

  if (out.length === 0) {
    out = null;
  }

  if (out && out.length === 1) {
    out = out[0];
  }

  return out;
};

BEMXJST.prototype.runSimple = function runSimple(context) {
  this.context._listLength--;
  var res = '';
  var isChild = !!this.context.block ||
    !!(this.context.ctx && this.context.ctx.tag);

  if (!isChild && context && context !== true || context === 0) {
    res = [ 'span', null, context ];
  } else {
    res += context;
  }

  return res;
};

VIDOM.prototype.render = function render(
  context, entity, tag, js, bem, cls, mix, attrs, content
) {

  function isOneElement(children) {
    return !Array.isArray(children) ||
      children.filter(function(c) {
        return VIDOM.isReactElement(c); }).length === 0 &&
      children.length > 1 &&
      typeof children[1] === 'object' &&
      !Array.isArray(children[1]);
  }

  var ctx = context.ctx;
  if (!ctx.mix) {
    ctx.mix = mix;
  }
  var props = {};
  props[ALREADY_RENDERED_PROP_NAME] = true;

  if (tag === undefined) {
    tag = 'div';
  }

  if (tag === false || tag === '') {
    tag = 'span';
  }

  var viArguments = [ tag, props ];

  var isBEM = bem;
  if (isBEM === undefined) {
    if (ctx.bem === undefined) isBEM = entity.block || entity.elem;
    else isBEM = ctx.bem;
  }
  isBEM = !!isBEM;

  if (cls === undefined) cls = ctx.cls;

  if (!isBEM && !cls) {
    props = this.makeAttrs(props, context, attrs, ctx);

    var children = this.renderContent(content, isBEM);

    if (children) {
      if (isOneElement(children)) {
        viArguments.push(children);
      } else {
        viArguments = viArguments.concat(children);
      }
    }

    return viArguments;
  } else if (isBEM) {
    props.className = [].concat(
      this.classBuilder.build(entity.block, entity.elem),
      this.buildClasses(
        entity.block,
        entity.elem,
        entity.elem ?
          (context.elemMods || context.mods) :
          context.mods
      )
    );

    if (ctx.mix) {
      [].concat(ctx.mix).forEach(function(mixEntity) {
        if (!mixEntity) {
          return;
        }

        if (typeof mixEntity === 'string') {
          props.className.push(mixEntity);
          return;
        }

        if (mixEntity.block) {
          props.className.push(
            this.classBuilder.build(mixEntity.block, mixEntity.elem)
          );
        }

        if (!mixEntity.block && mixEntity.elem) {
          props.className.push(
            this.classBuilder.build(entity.block, mixEntity.elem)
          );
        }

        if (mixEntity.block) { // add mods
          props.className = props.className.concat(
            this.buildClasses(
              mixEntity.block,
              mixEntity.elem,
              mixEntity.elem ?
                (mixEntity.elemMods || mixEntity.mods) : mixEntity.mods)
          );
        }

        var nestedEntity = this.entities[
          this.classBuilder.build(
            mixEntity.block || entity.block,
            mixEntity.elem
          )
        ];

        if (!nestedEntity) {
          return;
        }

        // FIXME: copy-paste from bemhtml rendering
        // have to check what should we pass into exec
        var oldBlock = context.block;
        var oldElem = context.elem;
        context.block = mixEntity.block || context.block;
        context.elem = mixEntity.elem;
        context.mods = mixEntity.mods;
        var nestedMix = nestedEntity.mix.exec(context);
        // var nestedMix = nestedEntity.mix.exec(mixEntity);
        context.elem = oldElem;
        context.block = oldBlock;


        if (!nestedMix) {
          return;
        }

        if (!Array.isArray(nestedMix)) {
          nestedMix = [ nestedMix ];
        }

        for (var i = 0; i < nestedMix.length; i++) {
          var mods = nestedMix[i].mods || nestedMix[i].elemMods;
          if (!mods) {
            return;
          }

          var modKeys = Object.keys(mods);
          for (var j = 0; j < modKeys.length; j++) {
            var modName = modKeys[i];

            props.className = props.className.concat(
              mixEntity.elem ? this.classBuilder.buildElemClass(
                  mixEntity.block || entity.block,
                  mixEntity.elem,
                  modName,
                  mods[modName]
                ) : this.classBuilder.buildBlockClass(
                  mixEntity.block || entity.block,
                  modName,
                  mods[modName])
            );
          }
        }
      }.bind(this));
    }
  } else if (cls) {
    props.className.push(cls);
  }

  props.className = props.className.join(' ');
  props = this.makeAttrs(props, context, attrs, ctx);

  var children = this.renderContent(content, isBEM);

  if (children) {
    if (isOneElement(children)) {
      viArguments.push(children);
    } else {
      // FIXME: sanitizing children - we should understand why it is happen
      // special hack for
      // https://ru.bem.info/libs/bem-components/v2.4.0/desktop/radio-group/
      // with many options
      children = children.map(function(c) {
        if (isOneElement(c)) {
          return c;
        }

        return [ 'div', null ].concat(c);
      });

      viArguments = viArguments.concat(children);
    }
  }

  return viArguments;
};

VIDOM.prototype.makeAttrs = function makeAttrs(props, context, attrs, ctx) {
  attrs = utils.extend(attrs, ctx.attrs);
  if (!attrs) return props;

  for (var name in attrs) {
    if (!attrs.hasOwnProperty(name)) {
      continue;
    }
    var attr = attrs[name];
    if (attr === undefined || attr === false || attr === null) continue;

    if (typeof attr === 'function') {
      props[name] = attr;
    } else {
      props[name] = utils.attrEscape(
        utils.isSimple(attr) ? attr : this.context.reapply(attr)
      );
    }
  }

  return props;
};

VIDOM.prototype.buildClasses = function buildClasses(block, elem, mods) {
  var classes = [];
  if (!mods) return classes;

  for (var modName in mods) {
    if (!mods.hasOwnProperty(modName)) {
      continue;
    }

    if (!mods[modName] || !modName) continue;

    classes.push(
      elem ? this.classBuilder.buildElemClass(
          block,
          elem,
          modName,
          mods[modName]
        ) : this.classBuilder.buildBlockClass(
          block,
          modName,
          mods[modName]
        )
    );
  }

  return classes;
};
