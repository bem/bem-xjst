var fixtures = require('./fixtures')('bemhtml');
var compile = fixtures.compile;

describe('BEMContext this.jsAttrEscape(str)', function() {
  it('should escape quotes and ampersands', function() {
    compile(function() {
      block('button').def()(function() {
        return this.jsAttrEscape('<b foo="a">\'&\'</b><b bar="b">\'&\'</b>');
      });
    })
      .apply({ block: 'button' })
      .should.equal('<b foo="a">&#39;&amp;&#39;</b><b bar="b">&#39;&amp;' +
                    '&#39;</b>');
  });
});
