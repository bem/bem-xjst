block('test').elem('e').def()(function() {
  this.mods = { test: 1 };
  return applyNext();
});
block('test').def()(function() {
  this.mods = { test: 1 };
  return applyNext();
});
