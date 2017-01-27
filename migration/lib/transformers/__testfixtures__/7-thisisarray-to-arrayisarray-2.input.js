block('test').mix()(function() {
  var mix = this.mix;

  if (!this.isArray(mix))
    mix = [ this.mix ];

  mix.push({ block: 'mixed' });

  return mix;
});
