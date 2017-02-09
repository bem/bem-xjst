var inherits = require('inherits');
var BemxjstEntity = require('../bemxjst/entity').Entity;

function Entity() {
  BemxjstEntity.apply(this, arguments);
}

inherits(Entity, BemxjstEntity);
exports.Entity = Entity;

Entity.prototype.defaultBody = function(context) {
  var mods = this.mods.exec(context);
  context.mods = mods;

  var elemMods;
  if (context.ctx.elem) {
    elemMods = this.elemMods.exec(context);
    context.elemMods = elemMods;
  }

  // Notice: other modes must be after context.mods/context.elemMods changes

  return this.bemxjst.render(context,
                             this,
                             this.content.exec(context),
                             this.js.exec(context),
                             this.mix.exec(context),
                             mods,
                             elemMods);
};
