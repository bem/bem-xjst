block('b')(
  addJs()(function() {
    return { data: 'lol' };
  }),

  content()('test')
);
