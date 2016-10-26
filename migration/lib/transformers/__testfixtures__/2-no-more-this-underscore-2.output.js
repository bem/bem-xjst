block('test').content()(function() {
  return this.isSimpleTag(this.ctx.tag) || [];
});
