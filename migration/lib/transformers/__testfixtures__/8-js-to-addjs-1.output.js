block('b')(
  addJs()(function() {
    return { data: 'lol' };
  }),

  content()('test')
);

block('b')(
  addJs()(true),

  content()('test')
);
