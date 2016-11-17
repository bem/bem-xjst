var fixtures = require('./fixtures');
var test = fixtures.test;

describe('Modes elem(elemName)', function() {
  it('should support elem() match', function () {
    test(function() {
      block('b').elem('e').content()('ok');
    },
    { block: 'b', elem: 'e' },
    '<div class="b__e">ok</div>');
  });

  it('should apply elem(*) template', function() {
    test(function() {
      block('b').elem('*').tag()('b');
    },
    [
      { block: 'b' },
      { block: 'b', elem: 'foo' },
      {
        block: 'b',
        elem: 'bar',
        content: {
          block: 'b',
          elem: 'inner',
          content: 'test'
        }
      }
    ],
    '<div class="b"></div><b class="b__foo"></b><b class="b__bar">' +
      '<b class="b__inner">test</b></b>');
  });

  it('elem(*) should be called before the matched templates',
    function() {
    test(function() {
      block('b1').content()(function() {
        return 'block';
      });
      block('b1').elem('a').content()(function() {
        return 'block-a';
      });
      block('b1').elem('*').content()(function() {
        return '%' + applyNext() + '%';
      });
    }, [
      { block: 'b1' },
      {
        block: 'b1',
        elem: 'a'
      },
      {
        block: 'b3',
        elem: 'b',
        content: 'ok'
      }
    ], '<div class="b1">block</div><div class="b1__a">%block-a%</div>' +
      '<div class="b3__b">%ok%</div>');
  });

  it('should apply several elem(*) templates in proper order', function() {
    test(function() {
      block('b').elem('*').cls()(function() {
        return this.ctx.cls;
      });
      block('b').elem('*').cls()(function() {
        return applyNext() + '1';
      });
      block('b').elem('*').cls()(function() {
        return applyNext() + '2';
      });
    },
    { block: 'b', elem: 'e', cls: 'foo' },
    '<div class="b__e foo12"></div>');
  });
});
