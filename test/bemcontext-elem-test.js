var fixtures = require('./fixtures');
var test = fixtures.test;

describe('BEMContent this.elem', function() {
  it('should support this.elem', function() {
    test(function() {
      block('b').elem('e').def()(function() {
        return this.elem;
      });
    },
    { block: 'b', elem: 'e' },
    'e');
  });

  it('should properly set this.block', function() {
    test(function() {
      block('b2').def()(function() {
        return this.elem;
      });
    },
    {
      block: 'b1',
      elem: 'e',
      content: { block: 'b2' }
    },
    '<div class="b1__e">undefined</div>');
  });
});
