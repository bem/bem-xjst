block('b')(
  js()(function() {
    return { data: 'lol' };
  }),

  content()('test')
);

block('b')(
  js()(true),

  content()('test')
);
