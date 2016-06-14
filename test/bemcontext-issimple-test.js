var fixtures = require('./fixtures')('bemhtml');
var compile = fixtures.compile;

describe('BEMContext this.isSimple(arg)', function() {
  var bemhtml;

  before(function() {
    bemhtml = compile(function() {
      block('b').def()(function() {
        return this.isSimple(this.ctx.val);
      });
    });
  });

  it('should return true for undefined', function() {
    bemhtml.apply({ block: 'b', val: undefined }).should.equal(true);
  });

  it('should return true for null', function() {
    bemhtml.apply({ block: 'b', val: null }).should.equal(true);
  });

  it('should return true for Number', function() {
    bemhtml.apply({ block: 'b', val: 0 }).should.equal(true);
  });

  it('should return false for NaN', function() {
    bemhtml.apply({ block: 'b', val: NaN }).should.equal(true);
  });

  it('should return true for String', function() {
    bemhtml.apply({ block: 'b', val: '' }).should.equal(true);
  });

  it('should return true for escaped String', function() {
    bemhtml.apply({ block: 'b', val: { html: '' } }).should.equal(true);
  });

  it('should return true for Boolean', function() {
    bemhtml.apply({ block: 'b', val: false }).should.equal(true);
  });

  it('should return false for Array', function() {
    bemhtml.apply({ block: 'b', val: [] }).should.equal(false);
  });

  it('should return false for Object', function() {
    bemhtml.apply({ block: 'b', val: {} }).should.equal(false);
  });

  it('should return false for Function', function() {
    bemhtml.apply({ block: 'b', val: function() {} }).should.equal(false);
  });
});
