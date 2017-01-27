block('test')(
  mode('custom-mode')(function() {
    return { test: 1 };
  }),

  def()(function() {
    return apply('');
  })
);
