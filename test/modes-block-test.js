var fixtures = require('./fixtures');
var test = fixtures.test;

describe('Modes block(blockName)', function() {
  it('should support block() match', function () {
    test(function() {
      block('b').content()('ok');
    },
    { block: 'b' },
    '<div class="b">ok</div>');
  });

  it('should match block(*) to empty BEMJSON-object', function() {
    test(function() {
      block('*').def()(function() {
        return 'lol';
      });
    },
    {},
    'lol');
  });

  it('should apply block(*) template', function() {
    test(function() {
      block('*').tag()('b');
    },
    [
      { content: 'foo' },
      { block: 'b' },
      { block: 'input', elem: 'control' }
    ],
    '<b>foo</b><b class="b"></b><b class="input__control"></b>');
  });

  it('block(*) should be called before the matched templates', function() {
    test(function() {
      block('b1').content()('ok');
      block('b2').content()('yes');
      block('*').content()(function() {
        return '#' + applyNext() + '#';
      });
    }, [ { block: 'b1' },
      { block: 'b2' },
      { block: 'b3', content: 'ya' } ],
      '<div class="b1">#ok#</div>' +
      '<div class="b2">#yes#</div>' +
      '<div class="b3">#ya#</div>');
  });

  it('should apply several block(*) templates in proper order', function() {
    test(function() {
      block('*').cls()(function() {
        return this.ctx.cls;
      });
      block('*').cls()(function() {
        return applyNext() + '1';
      });
      block('*').cls()(function() {
        return applyNext() + '2';
      });
    },
    { block: 'button', cls: 'foo' },
    '<div class="button foo12"></div>');
  });
});
