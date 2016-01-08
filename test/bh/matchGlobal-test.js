var fixtures = require('../fixtures')('bemhtml');
var compile = fixtures.compile;

describe('.block(*)', function() {
  it('should apply block(*) template', function() {
    compile(function() {
      block('*')(tag()('b'), bem()(false));
    })
      .apply([
        { content: 'foo' },
        { block: 'button' },
        { block: 'input', elem: 'control' }
      ]).should.equal('<b>foo</b><b></b><b></b>');
  });

  it('should match block(*) before other template', function() {
    compile(function() {
      block('button').tag()('button');
      block('*').tag()('span');
      block('button').tag()('strong');
    })
      .apply({ block: 'button' }).should.equal('<span class="button"></span>');
  });

  it('should apply several templates in proper order', function() {
    compile(function() {
      block('*').cls()(function() {
        return this.ctx.cls;
      });
      block('*').cls()(function() {
        return applyNext() + '1';
      });
      block('*').cls()(function() {
        return applyNext() + '2';
      });
    })
      .apply({ block: 'button', cls: 'foo' }).should.equal('<div class="button foo12"></div>');
  });
});
