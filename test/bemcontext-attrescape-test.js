var fixtures = require('./fixtures')('bemhtml');
var test = fixtures.test;

describe('BEMContext this.attrEscape(str)', function() {
  it('should escape xml attr string', function() {
    test(function() {
      block('button').def()(function() {
        return this.attrEscape('<b id="a" class="bem">a&b&c</b>');
      });
    },
    { block: 'button' },
    '<b id=&quot;a&quot; class=&quot;bem&quot;>a&amp;b&amp;c</b>');
  });
});
