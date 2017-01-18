block('test')(
  mode('custom')(function() {
    return { test: 1 };
  }),

  def()(function() {
    return apply('custom');
  })
);
