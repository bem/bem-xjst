block('page').mix()(function() {
  var mix = this.ctx.mix;

  if (!this.isArray(mix)) {
    mix = [ mix ];
  }

  mix.push({ block: 'i-global'});

  return mix;
});

block('page').attrs()(function() {
  return {
    id: 'my-page'
  };
});
