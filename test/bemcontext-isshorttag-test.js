var fixtures = require('./fixtures')('bemhtml');
var compile = fixtures.compile;

describe('BEMContext this.isShortTag(str)', function() {
  var bemhtml;

  before(function() {
    bemhtml = compile(function() {
      block('b').def()(function() {
        return this.isShortTag(this.ctx.tag);
      });
    });
  });

  it('should return true for br', function() {
    bemhtml.apply({ block: 'b', tag: 'br' }).should.equal(true);
  });

  it('should return false for form', function() {
    bemhtml.apply({ block: 'b', tag: 'form' }).should.equal(false);
  });
});
