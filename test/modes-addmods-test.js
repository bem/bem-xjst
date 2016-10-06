var fixtures = require('./fixtures')('bemhtml');
var test = fixtures.test;

describe('Modes addMods', function() {
  it('should support addMods', function() {
    test(function() {
      block('button')(
        addMods()(function() {
          return { size: 'l' };
        })
      );
    },
    { block: 'button' },
    '<div class="button button_size_l"></div>');
  });

  it('should support addMods with object literal', function() {
    test(function() {
      block('button').addMods()({ size: 'l' });
    },
    { block: 'button' },
    '<div class="button button_size_l"></div>');
  });

  it('should rewrite mods from bemjson if no other mods templates',
    function() {
    test(function() {
      block('button').addMods()(function() {
        return { size: 'l' };
      });
    },
    { block: 'button', mods: { size: 's' } },
    '<div class="button button_size_l"></div>');
  });

  it('should apply templates for mods after mods changes', function() {
    test(function() {
      block('a')(
        mod('withTag', 'span').tag()('span'),
        mod('withMix', 'test').mix()('test'),
        addMods()({ withTag: 'span' }),
        addMods()({ withMix: 'test' })
      );
    },
    { block: 'a' },
    '<span class="a a_withTag_span a_withMix_test test"></span>');
  });

  it('should accumulate result', function() {
    test(function() {
      block('button')(
        addMods()(function() {
          return { theme: 'dark' };
        }),
        addMods()(function() {
          return { size: 'xl' };
        })
      );
    },
    { block: 'button' },
    '<div class="button button_theme_dark button_size_xl"></div>');
  });
});
