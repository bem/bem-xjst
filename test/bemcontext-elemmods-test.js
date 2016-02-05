var fixtures = require('./fixtures')('bemhtml');
var test = fixtures.test;

describe('BEMContext this.elemMods', function() {
  it('should support elemMods', function() {
    test(function() {
      block('b').elem('e').def()(function() {
        return JSON.stringify(this.elemMods);
      });
    },
    {
      block: 'b',
      elem: 'e',
      elemMods: { type: 'button' }
    },
    '{"type":"button"}');
  });

  it('should lazily define elemMods', function() {
    test(function() {
        block('b1').elem('e1').content()(function() {
          return this.elemMods.a || 'yes';
        });
      }, { block: 'b1', content: { elem: 'e1' } },
      '<div class="b1"><div class="b1__e1">yes</div></div>');
  });

  it('should support changing elemMods in runtime', function() {
    test(function() {
      block('b1').elem('e1').def()(function() {
        this.elemMods.a = 'b';
        return applyNext();
      });
    }, {
      block: 'b1',
      elem: 'e1'
    }, '<div class="b1__e1 b1__e1_a_b"></div>');
  });
});
