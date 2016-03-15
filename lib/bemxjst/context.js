var utils = require('./utils');

function Context(bemxjst) {
  this._bemxjst = bemxjst;

  this.ctx = null;
  this.block = '';

  // Save current block until the next BEM entity
  this._currBlock = '';

  this.elem = null;
  this.mods = {};
  this.elemMods = {};

  this.position = 0;
  this._listLength = 0;
  this._notNewList = false;

  // (miripiruni) this will be changed in next major release
  this.escapeContent = bemxjst.options.escapeContent === true;

  // Used in `OnceMatch` check to detect context change
  this._onceRef = {};
}
exports.Context = Context;

Context.prototype._flush = null;
Context.prototype.isArray = utils.isArray;

Context.prototype.isSimple = utils.isSimple;

Context.prototype.isShortTag = utils.isShortTag;
Context.prototype.extend = utils.extend;
Context.prototype.identify = utils.identify;

Context.prototype.xmlEscape = utils.xmlEscape;
Context.prototype.attrEscape = utils.attrEscape;
Context.prototype.jsAttrEscape = utils.jsAttrEscape;

Context.prototype.isFirst = function isFirst() {
  return this.position === 1;
};

Context.prototype.isLast = function isLast() {
  return this.position === this._listLength;
};

Context.prototype.generateId = function generateId() {
  return utils.identify(this.ctx);
};

Context.prototype.reapply = function reapply(ctx) {
  return this._bemxjst.run(ctx);
};
