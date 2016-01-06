var fixtures = require('../fixtures')('bemhtml');
var compile = fixtures.compile;

describe('.xmlEscape()', function() {
  it('should escape xml string', function() {
    compile(function() {
      block('button').def()(function() {
        return this.xmlEscape('<b>&</b>');
      })
    })
      .apply({ block: 'button' })
      .should.equal('&lt;b&gt;&amp;&lt;/b&gt;');
  });
});

describe('.attrEscape()', function() {
  it('should escape xml attr string', function() {
    compile(function() {
      block('button').def()(function() {
        return this.attrEscape('<b id="a">&</b>');
      })
    })
      .apply({ block: 'button' })
      .should.equal('<b id=&quot;a&quot;>&amp;</b>');
  });
});

describe('.jsAttrEscape()', function() {
  it('should escape xml attr js string', function() {
    compile(function() {
      block('button').def()(function() {
        return this.jsAttrEscape('<b id="a">\'&\'</b>');
      })
    })
      .apply({ block: 'button' })
      .should.equal('<b id="a">&#39;&amp;&#39;</b>');
  });
});
