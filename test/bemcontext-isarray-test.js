var fixtures = require('./fixtures')('bemhtml');
var compile = fixtures.compile;

describe('BEMContext this.isArray(arg)', function() {
  var bemhtml;

  before(function() {
    bemhtml = compile(function() {
      block('b').def()(function() {
        return this.isArray(this.ctx.val);
      });
    });
  });

  it('should return false for undefined', function() {
    bemhtml.apply({ block: 'b', val: undefined }).should.equal(false);
  });

  it('should return false for null', function() {
    bemhtml.apply({ block: 'b', val: null }).should.equal(false);
  });

  it('should return false for Number', function() {
    bemhtml.apply({ block: 'b', val: 0 }).should.equal(false);
  });

  it('should return false for NaN', function() {
    bemhtml.apply({ block: 'b', val: NaN }).should.equal(false);
  });

  it('should return false for String', function() {
    bemhtml.apply({ block: 'b', val: '' }).should.equal(false);
  });

  it('should return false for Boolean', function() {
    bemhtml.apply({ block: 'b', val: false }).should.equal(false);
  });

  it('should return true for Array', function() {
    bemhtml.apply({ block: 'b', val: [] }).should.equal(true);
  });

  it('should return false for Object', function() {
    bemhtml.apply({ block: 'b', val: {} }).should.equal(false);
  });

  it('should return false for Function', function() {
    bemhtml.apply({ block: 'b', val: function() {} }).should.equal(false);
  });
});
