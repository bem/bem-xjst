var fixtures = require('./fixtures')('bemhtml');
var compile = fixtures.compile;
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

  describe('Type of argument', function() {
    var bemhtml;

    before(function() {
      bemhtml = compile(function() {
        block('b').def()(function(n, ctx) {
          return n.attrEscape(ctx.val);
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
