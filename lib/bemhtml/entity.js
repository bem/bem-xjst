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
  this.js = new Match(this, 'js');
  this.mix = new Match(this, 'mix');
  this.bem = new Match(this, 'bem');
  this.cls = new Match(this, 'cls');

  BemxjstEntity.apply(this, arguments);
}

inherits(Entity, BemxjstEntity);
exports.Entity = Entity;

Entity.prototype.init = function(block, elem) {
  this.block = block;
  this.elem = elem;

  // Class for jsParams
  this.jsClass = this.bemxjst.classBuilder.build(this.block, this.elem);
};

Entity.prototype._initRest = function(key) {
  if (key === 'default') {
    this.rest[key] = this.def;
  } else if (key === 'tag' ||
    key === 'attrs' ||
    key === 'js' ||
    key === 'mix' ||
    key === 'bem' ||
    key === 'cls' ||
    key === 'content') {
    this.rest[key] = this[key];
  } else {
    if (!this.rest.hasOwnProperty(key))
      this.rest[key] = new Match(this, key);
  }
};

Entity.prototype.defaultBody = function(context) {
  return this.bemxjst.render(context,
                             this,
                             this.tag.exec(context),
                             context.ctx.js !== false ?
                               this.js.exec(context) :
                               undefined,
                             this.bem.exec(context),
                             this.cls.exec(context),
                             this.mix.exec(context),
                             this.attrs.exec(context),
                             this.content.exec(context));
};
