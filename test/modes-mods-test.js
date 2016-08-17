var fixtures = require('./fixtures')('bemhtml');
var test = fixtures.test;

describe('Modes mods', function() {
  it('should support mods', function() {
    test(function() {
      block('button').mods()(function() {
        return { size: 'l' };
      });
    },
    { block: 'button' },
    '<div class="button button_size_l"></div>');
  });

  it('should support mods with object literal', function() {
    test(function() {
      block('button').mods()({ size: 'l' });
    },
    { block: 'button' },
    '<div class="button button_size_l"></div>');
  });

  it('should rewrite mods from bemjson if no other mods templates',
    function() {
    test(function() {
      block('button').mods()(function() {
        return { size: 'l' };
      });
    },
    { block: 'button', mods: { size: 's' } },
    '<div class="button button_size_l"></div>');
  });

  it('should rewrite previous mods', function() {
    test(function() {
      block('button')(
        mods()(function() {
          return { theme: 'dark' };
        }),
        mods()(function() {
          return { size: 'xl' };
        })
      );
    },
    { block: 'button', mods: { type: 'promo' } },
    '<div class="button button_size_xl"></div>');
  });

  it('should return this.mods by default', function() {
    test(function() {
      block('a').def()(function() { return JSON.stringify(apply('mods')); });
      block('b').def()(function() { return JSON.stringify(apply('mods')); });
    },
    [ { block: 'a' }, { block: 'b', mods: { type: 'promo' } } ],
    '{}{"type":"promo"}');
  });

  it('should support applyNext()', function() {
    test(function() {
      block('b')(
        mods()(function() {
          return this.extend(applyNext(), { theme: 'dark' });
        }),
        mods()(function() {
          return this.extend(applyNext(), { size: 'xl' });
        })
      );
    },
    { block: 'b', mods: { type: 'promo' } },
    '<div class="b b_type_promo b_theme_dark b_size_xl"></div>');
  });
});
