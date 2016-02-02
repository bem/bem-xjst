var fixtures = require('./fixtures')('bemhtml');
var test = fixtures.test;

describe('BEMContext this.position', function() {
  it('should have proper this.position', function() {
    test(function() {
      block('b1').content()(function() { return this.position; });
    }, [
      { block: 'b1' },
      { block: 'b1' },
      '',
      { block: 'b1' },
      {
        tag: 'div',
        content: 'blah'
      },
      { block: 'b1' }
    ], '<div class="b1">1</div>' +
      '<div class="b1">2</div>' +
      '<div class="b1">3</div>' +
      '<div>blah</div>' +
      '<div class="b1">4</div>');
  });

  it('should calc position', function() {
    test(function() {
      block('button').elem('inner').def()(function() {
        this.elemMods.pos = this.position;
        return applyNext();
      });
    },
    {
      block: 'button',
      content: [ { elem: 'inner' }, { elem: 'inner' }, { elem: 'inner' } ]
    },
    '<div class="button">' +
    '<div class="button__inner button__inner_pos_1"></div>' +
    '<div class="button__inner button__inner_pos_2"></div>' +
    '<div class="button__inner button__inner_pos_3"></div>' +
    '</div>');
  });

  it('should calc position with array mess', function() {
    test(function() {
      block('button').elem('inner').def()(function() {
        this.elemMods.pos = this.position;
        return applyNext();
      });
    },
    {
      block: 'button',
      content: [
        [ { elem: 'inner' } ],
        [ { elem: 'inner' }, [ { elem: 'inner' } ] ]
      ]
    },
    '<div class="button">' +
    '<div class="button__inner button__inner_pos_1"></div>' +
    '<div class="button__inner button__inner_pos_2"></div>' +
    '<div class="button__inner button__inner_pos_3"></div>' +
    '</div>');
  });

  it('should calc position for single block', function() {
    test(function() {
      block('b').content()(function() {
        return this.position;
      });
    },
    [ { block: 'b' } ],
    '<div class="b">1</div>');
  });

  // TODO: FIX ME https://github.com/bem/bem-xjst/issues/174
  xit('should calc position for single block', function() {
    test(function() {
      block('b').content()(function() {
        return this.position;
      });
    },
    { block: 'wrap', content: { block: 'b' } },
    '<div class="wrap"><div class="b">1</div></div>');
  });

  // TODO: FIX ME https://github.com/bem/bem-xjst/issues/174
  xit('should calc position for single element', function() {
    test(function() {
      block('b').elem('e').content()(function() {
        return this.position;
      });
    },
    { block: 'b', content: { elem: 'e' } },
    '<div class="b"><div class="b__e">1</div></div>');
  });
});
