var inherits = require('inherits');
var Match = require('../bemxjst/match').Match;
var BemxjstEntity = require('../bemxjst/entity').Entity;

/**
 * @class Entity
 * @param {BEMXJST} bemxjst
 * @param {String} block
 * @param {String} elem
 * @param {Array} templates
 */
function Entity(bemxjst) {
  this.bemxjst = bemxjst;

  this.jsClass = null;

  // "Fast modes"
  this.tag = new Match(this, 'tag');
  this.attrs = new Match(this, 'attrs');
  this.mix = new Match(this, 'mix');
  this.js = new Match(this, 'js');
  this.mods = new Match(this, 'mods');
  this.elemMods = new Match(this, 'elemMods');
  this.bem = new Match(this, 'bem');
  this.cls = new Match(this, 'cls');

  BemxjstEntity.apply(this, arguments);
}

inherits(Entity, BemxjstEntity);
exports.Entity = Entity;

Entity.prototype.init = function init(block, elem) {
  this.block = block;
  this.elem = elem;

  // Class for jsParams
  this.jsClass = this.bemxjst.classBuilder.build(this.block, this.elem);
};

var keys = {
  tag: true,
  content: true,
  attrs: true,
  mix: true,
  js: true,
  mods: true,
  elemMods: true,
  cls: true,
  bem: true
};

Entity.prototype._initRest = function _initRest(key) {
  if (key === 'default') {
    this.rest[key] = this.def;
  } else if (keys[key]) {
    this.rest[key] = this[key];
  } else {
    if (!this.rest.hasOwnProperty(key))
      this.rest[key] = new Match(this, key);
  }
};

Entity.prototype.defaultBody = function defaultBody(context) {
  var mods = this.mods.exec(context);
  context.mods = mods;

  var elemMods;
  if (context.ctx.elem) {
    elemMods = this.elemMods.exec(context);
    context.elemMods = elemMods;
  }

  // Notice: other modes must be after context.mods/context.elemMods changes

  var tag = this.tag.exec(context);
  var content = this.content.exec(context);
  var attrs = this.attrs.exec(context);
  var mix = this.mix.exec(context);
  var js = this.js.exec(context);
  var bem = this.bem.exec(context);
  var cls = this.cls.exec(context);

  return this.bemxjst.render(context,
                             this,
                             tag,
                             js,
                             bem,
                             cls,
                             mix,
                             attrs,
                             content,
                             mods,
                             elemMods);
};
