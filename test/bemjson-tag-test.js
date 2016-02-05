var fixtures = require('./fixtures')('bemhtml');
var test = fixtures.test;

describe('BEMJSON tag', function() {
  it('should return html tag', function() {
    test(function() {
      block('btn').def()(function() {
        return this.ctx.tag;
      });
    },
    { block: 'btn', tag: 'button' },
    'button');
  });

  it('should render without tag', function() {
    test(function() {
    }, { tag: false, content: 'ok' }, 'ok');
  });
});
