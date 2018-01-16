var fixtures = require('./fixtures')('bemhtml');
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

  it('should protected from infinite loop', function() {
    test(function() {
      block('b1').wrap()(function() {
        return { block: 'b2' };
      });
      block('b2').wrap()({ block: 'b1' });
    }, { block: 'b1' }, '<div class="b1"></div>');
  });

  it('should work with several apply() calls', function() {
    var bemjson = { block: 'b1' };
    var expected = '<div class="b2"><div class="b1"></div></div>';
    var tmpl = fixtures.compile(function() {
      block('b1').wrap()(function() {
        return {
          block: 'b2',
          content: this.ctx
        };
      });
    });

    assert.equal(
      tmpl.apply(bemjson),
      expected,
      'first apply() call returns not expected value'
    );

    assert.equal(
      tmpl.apply(bemjson),
      expected,
      'second apply() call returns not expected value'
    );
  });

  it('should use current context (with simple value)', function() {
    test(function() {
      block('page').wrap()([ { elem: 'head' } ]);
    }, { block: 'page' }, '<div class="page__head"></div>');
  });

  it('should use current context (with function)', function() {
    test(function() {
      block('page').wrap()(function() { return [ { elem: 'head' } ]; });
    }, { block: 'page' }, '<div class="page__head"></div>');
  });
});
