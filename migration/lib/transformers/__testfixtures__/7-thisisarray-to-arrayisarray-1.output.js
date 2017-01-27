block('test').content()(function() {
  var ret = applyNext();

  return Array.isArray(ret) ? ret : [ ret ];
});
