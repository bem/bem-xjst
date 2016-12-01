block('test').elem('e').def()(function() {
  this.mods = { test: 1 };
});
block('test').def()(function() {
  this.mods = { test: 1 };
});
