block('b').mix()(function () {
  return ['abs', 'abc'];
});
block('b').elem('e').mix()(function () {
  return ['test'];
});
block('b').mod('mn', 'mv').elem('e').mix()(function () {
  return ['test'];
});
block('b')(
  mix()(function () {
    return [0,1,2];
  })
);

block('b')(
  mix()(function() { return []; })
);

block('b')(
  content()(function () {
    return [];
  })
);
