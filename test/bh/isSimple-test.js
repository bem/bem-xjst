var fixtures = require('../fixtures')('bemhtml');
var compile = fixtures.compile;

describe('.isSimple()', function() {
  var bemhtml;
  before(function() {
    bemhtml = compile(function() {
      block('b').def()(function() {
        return this.isSimple(this.ctx.val);
      });
    });
  });
  xit('should return true for undefined', function() {
    bemhtml.apply({ block: 'b', val: undefined }).should.equal('true');
  });
  it('should return true for null', function() {
    bemhtml.apply({ block: 'b', val: null }).should.equal(true);
  });
  it('should return true for number', function() {
    bemhtml.apply({ block: 'b', val: 1 }).should.equal(true);
  });
  it('should return true for string', function() {
    bemhtml.apply({ block: 'b', val: '1' }).should.equal(true);
  });
  it('should return true for boolean', function() {
    bemhtml.apply({ block: 'b', val: false }).should.equal(true);
  });
  it('should return false for array', function() {
    bemhtml.apply({ block: 'b', val: [] }).should.equal(false);
  });
  it('should return false for object', function() {
    bemhtml.apply({ block: 'b', val: {} }).should.equal(false);
  });
});
