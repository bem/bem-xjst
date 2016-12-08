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

  describe('Type of argument', function() {
    var bemhtml;

    before(function() {
      bemhtml = compile(function() {
        block('b').def()(function(n, ctx) {
          return n.jsAttrEscape(ctx.val);
        });
      });
    });

    it('should return \'\' for undefined', function() {
      bemhtml.apply({ block: 'b', val: undefined }).should.equal('');
    });

    it('should return \'\' for null', function() {
      bemhtml.apply({ block: 'b', val: null }).should.equal('');
    });

    it('should return String for zero', function() {
      bemhtml.apply({ block: 'b', val: 0 }).should.equal('0');
    });

    it('should return String for Number', function() {
      bemhtml.apply({ block: 'b', val: 42 }).should.equal('42');
    });

    it('should return \'\' for NaN', function() {
      bemhtml.apply({ block: 'b', val: NaN }).should.equal('');
    });

    it('should return String for String', function() {
      bemhtml.apply({ block: 'b', val: '' }).should.equal('');
    });

    it('should return String for String', function() {
      bemhtml.apply({ block: 'b', val: 'test' }).should.equal('test');
    });

    it('should return String for Boolean', function() {
      bemhtml.apply({ block: 'b', val: false }).should.equal('false');
    });

    it('should return String for Array', function() {
      bemhtml.apply({ block: 'b', val: [] }).should.equal('');
    });

    it('should return String for Array', function() {
      bemhtml.apply({ block: 'b', val: [ 'a', 'b' ] }).should.equal('a,b');
    });

    it('should return \'\' for Object', function() {
      bemhtml.apply({ block: 'b', val: {
        toString: function() { return ''; }
      } }).should.equal('');
    });

    it('should return \'\' for Function', function() {
      bemhtml.apply({ block: 'b', val: function() {} })
        .should.equal('function () {}');
    });
  });
});
