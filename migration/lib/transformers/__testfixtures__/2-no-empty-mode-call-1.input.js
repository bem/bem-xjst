block('test')(
  mode('')(function() {
    return { test: 1 };
  }),

  def()(function() {
    return apply('', { test: 1 });
  })
);
