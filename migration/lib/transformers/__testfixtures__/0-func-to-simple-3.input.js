block('link')
  .match(function() { return this.mods.disabled; })
  .tag()(function() { return 'span'; });
