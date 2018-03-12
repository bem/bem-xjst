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

  // "Fast modes" about HTML
  this.tag = new Match(this, 'tag');
  this.attrs = new Match(this, 'attrs');
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

Entity.prototype._keys = {
  tag: 1,
  content: 1,
  attrs: 1,
  mix: 1,
  js: 1,
  mods: 1,
  elemMods: 1,
  cls: 1,
  bem: 1
};

Entity.prototype.defaultBody = function(context) {
  context.mods = this.mods.exec(context);
  if (context.ctx.elem) context.elemMods = this.elemMods.exec(context);

  var bem;
  var cls;
  var attrs;
  var js;
  var mix;
  var tag = this.tag.exec(context);

  if (tag !== false) {
    cls = this.cls.exec(context);
    attrs = this.attrs.exec(context);
    bem = this.bem.exec(context);
    if (bem !== false) {
      js = this.js.exec(context);
      mix = this.mix.exec(context);
    }
  }

  return this.bemxjst.render(context,
                             this,
                             tag,
                             js,
                             bem,
                             cls,
                             mix,
                             attrs,
                             this.content.exec(context),
                             context.mods,
                             context.elemMods);
};
