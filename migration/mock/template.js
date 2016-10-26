block('a').tag()(function() { return 'abc'; });

block('a').tag()(function() {
  var ret = 'a';
  return ret;
});


block('a').tag()(function() { return 42; });

block('a').tag()(function() {
  console.log('1');
  return 42;
});
