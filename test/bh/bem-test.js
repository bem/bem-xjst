var fixtures = require('../fixtures')('bemhtml');
var compile = fixtures.compile;

describe('bem()', function() {
  it('should return bem by default', function() {
    compile(function() {
      block('button').def()(function() {
        return typeof this.ctx.bem;
      });
    })
      .apply({ block: 'button' })
      .should.equal('undefined');
  });
  it('should set bem to false', function() {
    compile(function() {
      block('button').bem()(false);
    })
      .apply({ block: 'button' }).should.equal('<div></div>');
  });
  xit('should not override user bem', function() {
    compile(function() {
      block('button').bem()(false);
    })
      .apply({ block: 'button', bem: true })
      .should.equal('<div class="button"></div>');
  });
  it('should not override later declarations', function() {
    compile(function() {
      block('button').bem()(false);
      block('button').bem()(true);
    })
      .apply({ block: 'button' }).should.equal('<div class="button"></div>');
  });
  xit('should override later declarations with force flag', function() {
    compile(function() {
      block('button').bem().force()(false);
      block('button').bem()(true);
    })
      .apply({ block: 'button' }).should.equal('<div></div>');
  });
  xit('should override user declarations with force flag', function() {
    compile(function() {
      block('button').bem().force()(false);
    })
      .apply({ block: 'button', bem: true }).should.equal('<div></div>');
  });
});
