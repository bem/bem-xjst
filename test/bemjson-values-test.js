var fixtures = require('./fixtures')('bemhtml');
var test = fixtures.test;

describe('BEMJSON values', function() {
  it('should work with empty input', function() {
    test(function() {
    }, '', '');
  });

  it('should work with null input', function() {
    test(function() {
    }, null, '');
  });

  it('should work with 0 input', function() {
    test(function() {
    }, 0, '0');
  });

  it('should not render `undefined`', function () {
    test(function() {
    }, [
      undefined,
      undefined,
      { block: 'b1' },
      undefined
    ], '<div class="b1"></div>');
  });

  it('should properly save context while render plain html items', function() {
    test(function() {
    }, {
      block: 'aaa',
      content: [
        {
          elem: 'xxx1',
          content: {
            block: 'bbb',
            elem: 'yyy1',
            content: { tag: 'h1', content: 'h 1' }
          }
        },
        {
          elem: 'xxx2'
        }
      ]
    }, '<div class="aaa">' +
      '<div class="aaa__xxx1">' +
      '<div class="bbb__yyy1">' +
      '<h1>h 1</h1>' +
      '</div>' +
      '</div>' +
      '<div class="aaa__xxx2"></div>' +
      '</div>');
  });

  it('should return undefined on failed match', function() {
    test(function() {
      block('b1').content()(function() {
        return { elem: 'e1' };
      });

      block('b1').elem('e1').mod('a', 'b').tag()('span');
    }, { block: 'b1' }, '<div class="b1"><div class="b1__e1"></div></div>');
  });
});
