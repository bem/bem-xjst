var inherits = require('inherits');
var Match = require('../bemxjst/match').Match;
var BemxjstEntity = require('../bemxjst/entity').Entity;

function Entity() {
  BemxjstEntity.apply(this, arguments);
}

inherits(Entity, BemxjstEntity);
exports.Entity = Entity;

Entity.prototype._initRest = function _initRest(key) {
  if (key === 'default') {
    this.rest[key] = this.def;
  } else if (key === 'content') {
    this.rest[key] = this[key];
  } else {
    if (!this.rest.hasOwnProperty(key))
      this.rest[key] = new Match(this);
  }
};

Entity.prototype.defaultBody = function defaultBody(context) {
  var content = this.content.exec(context);

  // Default content
  if (this.content.count === 0 && content === undefined)
    content = context.ctx.content;

  return this.bemxjst.render(context, this, content);
};
