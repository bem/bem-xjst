block('test').mix()(function() {
  // TODO: rewrite push()
  var mix = this.ctx.mix;

  mix.push({ block: 'mixed' });

  return mix;
});
