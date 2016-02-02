var fixtures = require('../fixtures')('bemhtml');
var compile = fixtures.compile;

describe('js()(×)', function() {
  it('should return js', function() {
    compile(function() {
      block('button').def()(function() {
        return JSON.stringify(this.ctx.js);
      });
    })
      .apply({ block: 'button', js: true })
      .should.equal('true');
  });
  it('should set js', function() {
    compile(function() {
      block('button').js()(true);
    })
      .apply({ block: 'button' })
      .should.equal('<div class="button i-bem" ' +
        'data-bem=\'{"button":{}}\'></div>');
  });
  it('should not set js', function() {
    compile(function() {
      block('button').js()(false);
    })
      .apply({ block: 'button' })
      .should.equal('<div class="button"></div>');
  });
  it('should not override user declarations', function() {
    compile(function() {
      block('button').js()(true);
    })
      .apply({ block: 'button', js: false })
      .should.equal('<div class="button"></div>');
  });
  it('should extend user js', function() {
    compile(function() {
      block('button').js()({ a: 2 });
    })
      .apply({ block: 'button', js: { x: 1 } })
      .should.equal('<div class="button i-bem"' +
        ' data-bem=\'{"button":{"x":1,"a":2}}\'></div>');
  });
  it('should extend user js, when it equal true', function() {
    compile(function() {
      block('button').js()({ a: 1 });
    })
      .apply({ block: 'button', js: true })
      .should.equal('<div class="button i-bem"' +
        ' data-bem=\'{"button":{"a":1}}\'></div>');
  });
  it('should not override later declarations #1', function() {
    compile(function() {
      block('button').js()(false);
      block('button').js()(true);
    })
      .apply({ block: 'button' })
      .should.equal('<div class="button i-bem" ' +
        'data-bem=\'{"button":{}}\'></div>');
  });
  it('should not override later declarations #2', function() {
    compile(function() {
      block('button').js()(true);
      block('button').js()(false);
    })
      .apply({ block: 'button' })
      .should.equal('<div class="button"></div>');
  });
  xit('should override later declarations with force flag', function() {
    compile(function() {
      block('button').js().force()(true);
      block('button').js()(false);
    })
      .apply({ block: 'button' })
      .should.equal('<div class="button i-bem" ' +
        'data-bem=\'{"button":{}}\'></div>');
  });
  xit('should override user declarations with force flag', function() {
    compile(function() {
      block('button').js().force()(false);
    })
      .apply({ block: 'button', js: { a: 1 } })
      .should.equal('<div class="button"></div>');
  });
});
