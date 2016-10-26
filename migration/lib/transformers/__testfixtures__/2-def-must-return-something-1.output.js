block('test').def()(function() {
  this.mods = { test: 1 };
  return applyNext();
});
