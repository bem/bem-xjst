block('b')(
  addAttrs()(function() {
    return { id: 'test' };
  }),

  content()('test')
);
