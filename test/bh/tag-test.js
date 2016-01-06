var fixtures = require('../fixtures')('bemhtml');
// var bemxjst = require('../../').bemhtml;
var compile = fixtures.compile;

describe('.tag()', function() {
  it('should return html tag', function() {
    compile(function() {
      block('btn').def()(function() {
        return this.ctx.tag;
      });
    }).apply({block: 'btn', tag: 'button'})
      .should.equal('button');
  });

  it('should set empty tag', function() {
    compile(function() {
      block('link').tag()('');
      block('button').tag()(false);
    }).apply({ block: 'button', content: { block: 'link', content: 'link' } })
      .should.equal('link');
  });

  it('should set html tag', function() {
    compile(function() {
      block('button').tag()('button');
    }).apply({ block: 'button' })
      .should.equal('<button class="button"></button>');
  });

  it('should not override user tag', function() {
    compile(function() {
      block('button').tag()('button');
    }).apply({ block: 'button', tag: 'a' })
      .should.equal('<a class="button"></a>');
  });

  it('should not override later declarations', function() {
    compile(function() {
      block('button').tag()('input');
      block('button').tag()('button');
    }).apply({ block: 'button' })
      .should.equal('<button class="button"></button>');
  });

  xit('should override later declarations with force flag', function() {
    compile(function() {
      block('button').tag()('input');
      block('button').force().tag()('button');
    }).apply({ block: 'button' })
      .should.equal('<input class="button"/>');
  });

  xit('should override user declarations with force flag', function() {
    compile(function() {
      block('button').force().tag()('button');
    }).apply({ block: 'button', tag: 'a' })
      .should.equal('<button class="button"></button>');
  });
});
