var assert = require('assert');
var fixtures = require('./fixtures')('bemhtml');
var test = fixtures.test;
var bemtreeFixtures = require('./fixtures')('bemtree');
var bemtreeTest = bemtreeFixtures.test;

describe('Flush', function() {
  it('should not flush custom def() bodies', function() {
    test(function() {
      block('b2').def()(function() {
        return 'before' + applyNext() + 'after';
      });

      block('*').tag()('a');
    }, {
      block: 'b1',
      content: [ {
        block: 'b2',
        content: {
          block: 'b3'
        }
      }, {
        block: 'b4',
        content: 'ending'
      } ]
    }, '', {
      flush: true,
      after: function after(template) {
        assert.deepEqual(template._buf, [
          '<a class="b1">',
          'before<a class="b2"><a class="b3"></a></a>after',
          '<a class="b4">',
          'ending</a>',
          '</a>'
        ]);
      }
    });
  });

  it('should still flush top level with def() override', function() {
    test(function() {
      block('b2').def()(function() {
        return 'before' + applyNext() + 'after';
      });

      block('*').tag()('a');
    }, {
      block: 'b2',
      content: {
        block: 'b3'
      }
    }, '', {
      flush: true,
      after: function after(template) {
        assert.deepEqual(template._buf, [
          'before<a class="b2"><a class="b3"></a></a>after'
        ]);
      }
    });
  });

  it('should not flush custom def() with `.xjstOptions({ flush: true })',
    function () {
    test(function() {
      block('b2').def().xjstOptions({ flush: true })(function() {
        return applyCtx({ block: 'b1' });
      });

      block('*').tag()('a');
    }, {
      block: 'b2'
    }, '', {
      flush: true,
      after: function after(template) {
        assert.deepEqual(template._buf, [
          '<a class="b1">',
          '</a>'
        ]);
      }
    });
  });

  it('should use _flush function', function() {
    test(function() {
      block('b').tag()('span');
      block('br').tag()('br');
    },
    {
      block: 'b',
      content: { block: 'br' }
    },
    '',
    {
      xhtml: true,
      flush: true,
      after: function after(template) {
        assert.deepEqual(template._buf, [
          '<span class="b">',
          '<br class="br"/>',
          '</span>'
        ]);
      }
    });
  });

  it('should use flush function in bemtree', function() {
    bemtreeTest(function() {},
    [
      { block: 'br' },
      { block: 'br' }
    ],
    '',
    {
      engine: 'BEMTREE',
      flush: true,
      after: function after(template) {
        assert.deepEqual(template._buf, [
          { block: 'br' },
          { block: 'br' }
        ]);
      }
    });
  });
});
