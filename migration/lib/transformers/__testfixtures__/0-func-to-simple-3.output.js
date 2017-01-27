block('link')
  .tag()('span');

block('link')
  .match(function() { return this.mods.disabled; })
  .tag()('span');
