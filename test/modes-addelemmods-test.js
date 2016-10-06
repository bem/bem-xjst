var fixtures = require('./fixtures')('bemhtml');
var test = fixtures.test;

describe('Modes addElemMods', function() {
  it('should support addElemMods', function() {
    test(function() {
      block('button').elem('e')(
        addElemMods()(function() {
          return { size: 'l' };
        })
      );
    },
    { block: 'button', elem: 'e' },
    '<div class="button__e button__e_size_l"></div>');
  });

  it('should support addElemMods with object literal', function() {
    test(function() {
      block('button').elem('e').addElemMods()({ size: 'l' });
    },
    { block: 'button', elem: 'e' },
    '<div class="button__e button__e_size_l"></div>');
  });

  it('should rewrite mods from bemjson if no other mods templates',
    function() {
    test(function() {
      block('button').elem('e').addElemMods()(function() {
        return { size: 'l' };
      });
    },
    { block: 'button', elem: 'e', mods: { size: 's' } },
    '<div class="button__e button__e_size_l"></div>');
  });

  it('should apply templates for mods after mods changes', function() {
    test(function() {
      block('a').elem('e')(
        elemMod('withTag', 'span').tag()('span'),
        elemMod('withMix', 'test').mix()('test'),
        addElemMods()({ withTag: 'span' }),
        addElemMods()({ withMix: 'test' })
      );
    },
    { block: 'a', elem: 'e' },
    '<span class="a__e a__e_withTag_span a__e_withMix_test test"></span>');
  });

  it('should accumulate result', function() {
    test(function() {
      block('button').elem('e')(
        addElemMods()(function() {
          return { theme: 'dark' };
        }),
        addElemMods()(function() {
          return { size: 'xl' };
        })
      );
    },
    { block: 'button', elem: 'e' },
    '<div class="button__e button__e_theme_dark button__e_size_xl"></div>');
  });
});
