block('b').attrs()(function () {
  return { id: 'attrs' };
});
block('b').elem('e').js()(function () {
  return { id: 'js-test' };
});
block('b')(
  js()(function () {
    return { id: 'js-test2' };
  })
);
block('b')(
  attrs()(function () {
    return { id: 'attrs-test' };
  })
);
block('b')(
  mix()(function () {
    return { block: 'a' };
  })
);
block('b')(
  elem('e').mix()(function () {
    return { block: 'a' };
  })
);
