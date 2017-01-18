block('test').attrs()(function() {
  return this.extend(this.ctx.attrs, { test: 1 });
});
