var fixtures = require('../fixtures')('bemhtml');
var compile = fixtures.compile;

describe('content()(×)', function() {
  it('should return bemjson content', function() {
    compile(function() {
      block('button').def()(function() {
        return this.ctx.content;
      });
    })
      .apply({ block: 'button', content: 'Hello' })
      .should.equal('Hello');
  });
  it('should set bemjson content', function() {
    compile(function() {
      block('button').content()({ elem: 'text' });
    })
      .apply({ block: 'button' })
      .should.equal(
        '<div class="button"><div class="button__text"></div></div>');
  });
  it('should set bemjson array content', function() {
    compile(function() {
      block('button').content()([ { elem: 'text1' }, { elem: 'text2' } ]);
    })
      .apply({ block: 'button' }).should.equal(
        '<div class="button"><div class="button__text1"></div><div class="button__text2"></div></div>');
  });
  it('should set bemjson string content', function() {
    compile(function() {
      block('button').content()('Hello World');
    })
      .apply({ block: 'button' }).should.equal('<div class="button">Hello World</div>');
  });
  it('should set bemjson numeric content', function() {
    compile(function() {
      block('button').content()(123);
    })
      .apply({ block: 'button' }).should.equal('<div class="button">123</div>');
  });
  it('should set bemjson zero-numeric content', function() {
    compile(function() {
      block('button').content()(0);
    })
      .apply({ block: 'button' }).should.equal('<div class="button">0</div>');
  });
  xit('should not override user content', function() {
    compile(function() {
      block('button').content()({ elem: 'text' });
    })
      .apply({ block: 'button', content: 'Hello' }).should.equal('<div class="button">Hello</div>');
  });
  it('should not override later declarations', function() {
    compile(function() {
      block('button').content()({ elem: 'text2' });
      block('button').content()({ elem: 'text1' });
    })
      .apply({ block: 'button' }).should.equal(
        '<div class="button"><div class="button__text1"></div></div>');
  });
  xit('should override later declarations with force flag', function() {
    compile(function() {
      block('button').content().force()({ elem: 'text2' });
      block('button').content()({ elem: 'text1' });
    })
      .apply({ block: 'button' }).should.equal(
        '<div class="button"><div class="button__text2"></div></div>');
  });
  xit('should override user declarations with force flag', function() {
    compile(function() {
      block('button').content().force()('text');
    })
      .apply({ block: 'button', content: 'Hello' }).should.equal('<div class="button">text</div>');
  });
});
