block('test').attrs()(function() {
  var attrs = this.ctx.attrs;

  attrs = this.extend(attrs, { id: 'test' });

  return attrs;
});
