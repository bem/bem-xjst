var utils = require('./utils');

function Context() {
  this.ctx = null;
  this.block = '';

  // Save current block until the next BEM entity
  this._currBlock = '';

  this.elem = null;
  this.mods = null;
  this.elemMods = null;

  this.position = 0;
  this._listLength = 0;

  this._uniq = null;
}
exports.Context = Context;

Context.prototype.isArray = utils.isArray;

Context.prototype.isSimple = function isSimple(obj) {
  if (!obj || obj === true)
    return true;
  var t = typeof obj;
  return t === 'string' || t === 'number';
};

Context.prototype.isShortTag = utils.isShortTag;
Context.prototype.extend = utils.extend;
Context.prototype.identify = utils.identify;

Context.prototype.xmlEscape = utils.xmlEscape;
Context.prototype.attrEscape = utils.attrEscape;

Context.prototype.BEM = {};

Context.prototype.isFirst = function isFirst() {
  return this.position === 1;
};

Context.prototype.isLast = function isLast() {
  return this.position === this._listLength;
};

Context.prototype.generateId = function generateId() {
  if (this._uniq === null)
    this._uniq = utils.getUniq();
  return this._uniq;
};
