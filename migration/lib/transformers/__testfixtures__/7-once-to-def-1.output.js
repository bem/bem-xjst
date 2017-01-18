block('test').def()(function() {
  this.mods.once = 1;

  return applyNext();
});
