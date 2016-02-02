var fixtures = require('../fixtures')('bemhtml');
var compile = fixtures.compile;

describe('ctx.cls()', function() {
  it('should return cls', function() {
    compile(function() {
      block('button').def()(function() {
        return this.ctx.cls;
      })
    })
      .apply({ block: 'button', cls: 'btn' })
      .should.equal('btn');
  });
  it('should set cls', function() {
    compile(function() {
      block('button').cls()('btn');
    })
      .apply({ block: 'button' })
      .should.equal('<div class="button btn"></div>');
  });
  xit('should trim cls', function() {
    compile(function() {
      block('button').cls()('  btn  ');
    })
      .apply({ block: 'button' })
      .should.equal('<div class="button btn"></div>');
  });
  xit('should escape cls', function() {
    compile(function() {
      block('button').cls()('url="a=b&c=d"');
    })
      .apply({ block: 'button' })
      .should.equal('<div class="button url=&quot;a=b&amp;c=d&quot;"></div>');
  });
  xit('should not override user cls', function() {
    compile(function() {
      block('button').cls()('btn');
    })
      .apply({ block: 'button', cls: 'user-btn' })
      .should.equal('<div class="button user-btn"></div>');
  });
  it('should not override later declarations', function() {
    compile(function() {
      block('button').cls()('control');
      block('button').cls()('btn');
    })
      .apply({ block: 'button' })
      .should.equal('<div class="button btn"></div>');
  });
  xit('should override later declarations with force flag', function() {
    compile(function() {
      block('button').cls().force()('control');
      block('button').cls()('btn');
    })
      .apply({ block: 'button' })
      .should.equal('<div class="button control"></div>');
  });
  xit('should override user declarations with force flag', function() {
    compile(function() {
      block('button').cls().force()('btn');
    })
      .apply({ block: 'button', cls: 'user-btn' })
      .should.equal('<div class="button btn"></div>');
  });
});
