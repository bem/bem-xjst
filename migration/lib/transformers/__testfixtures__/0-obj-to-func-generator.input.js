block('b').attrs()({ id: 'attrs' });
block('b').elem('e').js()({ id: 'js-test' });
block('b')(
  js()({ id: 'js-test2' })
);
block('b')(
  attrs()({ id: 'attrs-test' })
);
block('b')(
  mix()({ block: 'a' })
);
block('b')(
  elem('e').mix()({ block: 'a' })
);
