block('test').content()(function() {
  var ret = applyNext();

  return this.isArray(ret) ? ret : [ ret ];
});
