block('b')(
  mix()(function() {
    return { block: 'mixed' };
  }),

  content()('test')
);
