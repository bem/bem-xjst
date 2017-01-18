block('b1').def()(function() {
  var some = this.elemMods && this.elemMods.some;

  return some;
});
block('b1').elem('e').def()(function() {
  var some = this.elemMods && this.elemMods.some;

  return some;
});
