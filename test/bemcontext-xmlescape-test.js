var fixtures = require('./fixtures')('bemhtml');
var test = fixtures.test;

describe('BEMContext this.xmlEscape()', function() {
  it('should escape lower than, greater than and ampersands', function() {
    test(function() {
      block('button').def()(function() {
        return this.xmlEscape('<b>&</b>');
      });
    },
    { block: 'button' },
    '&lt;b&gt;&amp;&lt;/b&gt;');
  });
});
