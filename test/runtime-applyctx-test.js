var fixtures = require('./fixtures')('bemhtml');
var test = fixtures.test;

describe('Runtime applyCtx()', function() {
  it('should work with just context', function() {
    test(function() {
      block('b1').content()(function() {
        return applyCtx([
          { block: 'b2', content: 'omg' },
          { block: 'b3', tag: 'br' }
        ]);
      });
    },
    { block: 'b1' },
    '<div class="b1">' +
    '<div class="b2">omg</div><br class="b3"></div>');
  });

  it('should work with both context and changes', function() {
    test(function() {
      block('b2').content()(function() {
        return this.wtf;
      });

      block('b1').content()(function() {
        return applyCtx([ { block: 'b2' } ], { wtf: 'ohai' });
      });
    },
    { block: 'b1' },
    '<div class="b1"><div class="b2">ohai</div></div>');
  });
});
