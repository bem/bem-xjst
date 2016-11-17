var fixtures = require('./fixtures');
var test = fixtures.test;
var assert = require('assert');

describe('Modes wrap', function() {
  it('should throw error when args passed to wrap mode', function() {
    assert.throws(function() {
      fixtures.compile(function() {
        block('b1').wrap('blah');
      });
    });
  });

  it('should support `.wrap()`', function() {
    test(function() {
      block('b1').wrap()(function() {
        return {
          block: 'wrap',
          content: this.ctx
        };
      });
    }, [ {
      block: 'b1',
      tag: 'a',
      content: {
        block: 'b1',
        tag: 'a'
      }
    } ], '<div class="wrap"><a class="b1"><div class="wrap"><a class="b1">' +
      '</a></div></a></div>');
  });

  it('should support predicates after `wrap()`', function() {
    test(function() {
      block('b1')(
        wrap().match(function() {
          return this.ctx.key;
        })(function() {
          return {
            block: 'wrap',
            content: this.ctx
          };
        })
      );
    }, [ {
      block: 'b1',
      tag: 'a',
      key: 'val'
    } ], '<div class="wrap"><a class="b1"></a></div>');
  });

  it('should protected from infinite loop', function () {
    test(function() {
      block('b1').wrap()(function() {
        return { block: 'b2' };
      });
      block('b2').wrap()({ block: 'b1' });
    }, { block: 'b1' }, '<div class="b1"></div>');
  });
});
