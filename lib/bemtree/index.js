function Entity() {
  BemxjstEntity.apply(this, arguments);
}

inherits(Entity, BemxjstEntity);

Entity.prototype._initRest = function(key) {
  if (key === 'default') {
    this.rest[key] = this.def;
  } else if (key === 'content') {
    this.rest[key] = this[key];
  } else {
    if (!this.rest.hasOwnProperty(key))
      this.rest[key] = new Match(this, key);
  }
};

Entity.prototype.defaultBody = function(context) {
  return this.bemxjst.render(context, this, this.content.exec(context));
};

function BEMTREE() {
  BEMXJST.apply(this, arguments);
}

inherits(BEMTREE, BEMXJST);
module.exports = BEMTREE;

BEMTREE.prototype.Entity = Entity;

BEMTREE.prototype.runMany = function(arr) {
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

  if (this.canFlush) {
    for (var i = 0; i < arr.length; i++)
      out += context._flush(this._run(arr[i])); // TODO: fixme!
  } else {
    for (var i = 0; i < arr.length; i++)
      out.push(this._run(arr[i]));
  }

  if (!prevNotNewList)
    context.position = prevPos;

  return out;
};

BEMTREE.prototype.render = function(context, entity, content) {
  var ctx = context.ctx;
  var isBEM = !!(ctx.block || ctx.elem || ctx.bem); // TODO: check

  if (typeof content === 'undefined') return ctx;

  ctx.content = this.renderContent(content, isBEM);

  return ctx;
};

BEMTREE.prototype._run = function(context) {
  if (!context || context === true) return context;
  return BEMXJST.prototype._run.call(this, context);
};

BEMTREE.prototype.runUnescaped = function(context) {
  this.context._listLength--;
  return context;
};
