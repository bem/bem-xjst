function Context() {
  this.ctx = null;
  this.block = '';
  // Save current block until the next BEM entity
  this._currBlock = '';
  this.elem = null;
  this.mods = null;
  this.elemMods = null;
}
exports.Context = Context;
