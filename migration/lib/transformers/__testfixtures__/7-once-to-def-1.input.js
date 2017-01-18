block('test').once()(function() {
  this.mods.once = 1;

  return applyNext();
});
