var inherits = require('inherits');
var utils = require('../bemxjst/utils');
var Entity = require('../bemhtml/entity').Entity;
var BEMXJST = require('../bemxjst');
var bemNaming = require('bem-naming');
var naming;

var ALREADY_RENDERED_PROP_NAME = '__bem-xjst-rendered';

function VIDOM(options) {
  BEMXJST.apply(this, arguments);
  var bemNamingOptions = {};

  if (options.naming) {
    if (options.naming.mod) {
      bemNamingOptions.modSeparator = options.naming.mod;
    }
    if (options.naming.elem) {
      bemNamingOptions.elemSeparator = options.naming.elem;
    }
  }
  naming = bemNaming(bemNamingOptions);
}

inherits(VIDOM, BEMXJST);
module.exports = VIDOM;

VIDOM.prototype.Entity = Entity;

BEMXJST.prototype.exportApply = function exportApply(exports) {
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
  exports.apply = function apply(context) {
    var res = self.run(context);

    if (Array.isArray(res)) {
      res = cleanUpResults(res);
    }

    return res;
  };

  // Add templates at run time
  exports.compile = function compile(templates) {
    return self.compile(templates);
  };

  var sharedContext = {};

  exports.BEMContext = this.contextConstructor;
  sharedContext.BEMContext = exports.BEMContext;

  for (var i = 0; i < this.oninit.length; i++) {
    var oninit = this.oninit[i];

    oninit(exports, sharedContext);
  }
};

BEMXJST.prototype.run = function run(json) {
  var match = this.match;
  var context = this.context;

  this.match = null;
  this.context = new this.contextConstructor(this);
  this.depth = 0;
  var res = this._run(json);

  this.match = match;
  this.context = context;

  if (Array.isArray(res[0])) {
    res = [ 'div', null ].concat(res);
  }


  return res;
};

function isVidomEntity(entity) {
  return Array.isArray(entity) && entity.length > 1 &&
    typeof entity[0] === 'string' && typeof entity[1] === 'object' &&
    entity[1][ALREADY_RENDERED_PROP_NAME];
}

BEMXJST.prototype._run = function _run(context) {
  var res;
  if (context === undefined || context === '' || context === null) {
    res = this.runEmpty();
  } else if (isVidomEntity(context)) {
    return context;
  } else if (typeof context === 'function') {
    return context;
  } else if (utils.isArray(context)) {
    res = this.runMany(context);
  } else if (utils.isSimple(context)) {
    res = this.runSimple(context);
  } else {
    res = this.runOne(context);
  }

  return res;
};

VIDOM.prototype.runMany = function runMany(arr) {
  var out = [];
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

  for (var i = 0; i < arr.length; i++) {
    if (!arr[i]) {
      continue;
    }
    var cont = this._run(arr[i]);

    out.push(cont);
  }

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

  if (!prevNotNewList) context.position = prevPos;

  return out;
};

BEMXJST.prototype.runEmpty = function runEmpty() {
  this.context._listLength--;
  return '';
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

BEMXJST.prototype.runOne = function runOne(json) {
  var context = this.context;

  if (typeof json === 'object' && json.$$typeof) {
    return json;
  }

  var oldCtx = context.ctx;
  var oldBlock = context.block;
  var oldCurrBlock = context._currBlock;
  var oldElem = context.elem;
  var oldMods = context.mods;
  var oldElemMods = context.elemMods;

  if (json.block || json.elem)
    context._currBlock = '';
  else
    context._currBlock = context.block;

  context.ctx = json;
  if (json.block) {
    context.block = json.block;

    if (json.mods)
      context.mods = json.mods;
    else
      context.mods = {};
  } else {
    if (!json.elem)
      context.block = '';
    else if (oldCurrBlock)
      context.block = oldCurrBlock;
  }

  context.elem = json.elem;
  if (json.elemMods)
    context.elemMods = json.elemMods;
  else
    context.elemMods = {};

  var block = context.block || '';
  var elem = context.elem;

  // Control list position
  if (block || elem)
    context.position++;
  else
    context._listLength--;

  // To invalidate `applyNext` flags
  this.depth++;

  var key = this.classBuilder.build(block, elem);

  var ent = this.entities[key];
  if (!ent) {
    // No entity - use default one
    ent = this.defaultEnt;
    if (elem !== undefined)
      ent = this.defaultElemEnt;
    ent.init(block, elem);
  }

  var res = ent.run(context);
  context.ctx = oldCtx;
  context.block = oldBlock;
  context.elem = oldElem;
  context.mods = oldMods;
  context.elemMods = oldElemMods;
  context._currBlock = oldCurrBlock;
  this.depth--;

  return res;
};

VIDOM.prototype.render = function render(
  context, entity, tag, js, bem, cls, mix, attrs, content
) {

  var ctx = context.ctx;
  if (!ctx.mix) {
    ctx.mix = mix;
  }
  var props = {};
  props[ALREADY_RENDERED_PROP_NAME] = true;
  var viArguments = [];

  if (tag === undefined) tag = 'div';

  if (!tag) return this.renderNoTag(
    [ null, props ], js, bem, cls, mix, attrs, content
  );

  viArguments.push(tag, props);

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
      viArguments.push(children);
    }

    return viArguments;
  }

  if (isBEM) {
    props.className = [].concat(
      naming.stringify({ block: entity.block, elem: entity.elem }),
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
            naming.stringify({ block: mixEntity.block, elem: mixEntity.elem })
          );
        }

        if (!mixEntity.block && mixEntity.elem) {
          props.className.push(
            naming.stringify({ block: entity.block, elem: mixEntity.elem })
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

        var nestedEntity = this.entities[naming.stringify(
          { block: mixEntity.block || entity.block, elem: mixEntity.elem }
        )];

        if (!nestedEntity) {
          return;
        }

        // FIXME: copy-paste from bemhtml rendering
        // have to check what should we pass into exec
        //
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

        nestedMix.forEach(function(mix) {
          var mods = mix.mods || mix.elemMods;
          if (!mods) {
            return;
          }

          Object.keys(mods).forEach(function(modName) {
            props.className = props.className.concat(
              naming.stringify({
                block: mixEntity.block || entity.block,
                elem: mixEntity.elem,
                modName: modName,
                modVal: mods[modName]
              })
            );
          });
        });
      }.bind(this));
    }
  }
  if (cls) props.className.push(cls);

  props.className = props.className.join(' ');

  props = this.makeAttrs(props, context, attrs, ctx);

  var children = this.renderContent(content, isBEM);


  if (children) {
    var isOneElement = !Array.isArray(children) ||
      children.length > 1 &&
      typeof children[1] === 'object' &&
      !Array.isArray(children[1]);
    if (isOneElement) {
      viArguments.push(children);
    } else {
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
    var entity = {
      block: block,
      elem: elem,
      modName: modName,
      modVal: mods[modName]
    };

    if (!naming.validate(entity)) {
      classes.push(naming.stringify(entity));
    }
  }

  return classes;
};

VIDOM.prototype.renderNoTag = function renderNoTag(
    viArguments, js, bem, cls, mix, attrs, content
) {

  if (content || content === 0)
    return this._run(content);
  return '';
};
