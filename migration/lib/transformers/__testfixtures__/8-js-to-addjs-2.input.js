block('test')(
  js()(function() {
    // TODO: ololo
    var js = this.ctx.js;

    js = { data: 'lol' };

    return js;
  }),

  content()('test')
);
