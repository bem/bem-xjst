var fixtures = require('./fixtures');
var test = fixtures.test;

describe('BEMContent this.block', function() {
  it('should support this.block', function() {
    test(function() {
      block('b').def()(function() {
        return this.block;
      });
    },
    { block: 'b' },
    'b');
  });

  it('should properly set this.block', function() {
    test(function() {
      block('b').elem('e').def()(function() {
        return this.block;
      });
    },
    {
      block: 'b',
      content: { elem: 'e' }
    },
    '<div class="b">b</div>');
  });
});
