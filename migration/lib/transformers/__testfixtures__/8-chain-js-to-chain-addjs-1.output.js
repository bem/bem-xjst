block('test').addJs()(function() {
  // TODO: ololo
  var js = this.ctx.js;

  js = { data: 'lol' };

  return js;
});

block('test').addJs()(true);
