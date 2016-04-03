var fixtures = require('./fixtures')('bemhtml');
var test = fixtures.test;

describe('BEMJSON block', function() {
  it('should render block by default as div', function () {
    test(function() {}, [
      { block: 'b' }
    ], '<div class="b"></div>');
  });

  it('should not preserve block on tag', function () {
    test(function() {
    }, [
      {
        block: 'b1',
        content: {
          tag: 'span',
          content: {
            block: 'b2'
          }
        }
      }
    ], '<div class="b1"><span><div class="b2"></div></span></div>');
  });

  it('should inherit block from the parent, and reset it back', function() {
    test(function() {
    }, {
      block: 'b2',
      content: [
        { block: 'b1', content: { elem: 'e1' } },
        { elem: 'e1' }
      ]
    }, '<div class="b2"><div class="b1"><div class="b1__e1"></div></div>' +
      '<div class="b2__e1"></div></div>');
  });

  it('should preserve block on next BEM entity', function() {
    test(function() {
    }, [
      {
        block: 'b1',
        content: {
          tag: 'span',
          content: {
            elem: 'e1'
          }
        }
      }
    ], '<div class="b1"><span><div class="b1__e1"></div></span></div>');
  });

  it('should not preserve block/elem on tag', function() {
    test(function() {
    }, [
      {
        block: 'b1',
        content: {
          elem: 'e1',
          content: {
            tag: 'span',
            content: {
              block: 'b2'
            }
          }
        }
      }
    ], '<div class="b1"><div class="b1__e1"><span><div class="b2">' +
      '</div></span></div></div>');
  });
});
