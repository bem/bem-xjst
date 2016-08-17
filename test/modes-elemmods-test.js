var fixtures = require('./fixtures')('bemhtml');
var test = fixtures.test;

describe('Modes elemMods', function() {
  it('should support elemMods', function() {
    test(function() {
      block('button').elem('e').elemMods()(function() {
        return { size: 'l' };
      });
    },
    { block: 'button', elem: 'e' },
    '<div class="button__e button__e_size_l"></div>');
  });

  it('should support elemMods with object literal', function() {
    test(function() {
      block('button').elem('e').elemMods()({ size: 'l' });
    },
    { block: 'button', elem: 'e' },
    '<div class="button__e button__e_size_l"></div>');
  });

  it('should rewrite elemMods from bemjson if no other mods templates',
    function() {
    test(function() {
      block('button').elem('e').elemMods()(function() {
        return { size: 'l' };
      });
    },
    { block: 'button', elem: 'e', elemMods: { size: 's' } },
    '<div class="button__e button__e_size_l"></div>');
  });

  it('should rewrite previous elemMods', function() {
    test(function() {
      block('button').elem('e')(
        elemMods()(function() {
          return { theme: 'dark' };
        }),
        elemMods()(function() {
          return { size: 'xl' };
        })
      );
    },
    { block: 'button', elem: 'e', elemMods: { type: 'promo' } },
    '<div class="button__e button__e_size_xl"></div>');
  });

  it('should return this.elemMods by default', function() {
    test(function() {
      block('a').elem('e')
        .def()(function() { return JSON.stringify(apply('elemMods')); });
      block('b').elem('e')
        .def()(function() { return JSON.stringify(apply('elemMods')); });
    },
    [
      { block: 'a', elem: 'e' },
      { block: 'b', elem: 'e', elemMods: { type: 'promo' } }
    ],
    '{}{"type":"promo"}');
  });

  it('should apply templates for mods after mods changes', function() {
    test(function() {
      block('a').elem('e')(
        elemMod('test', 'ok').tag()('span'),
        elemMods()({ test: 'ok' })
      );
    },
    { block: 'a', elem: 'e' },
    '<span class="a__e a__e_test_ok"></span>');
  });

  it('should support applyNext()', function() {
    test(function() {
      block('b').elem('e')(
        elemMods()(function() {
          return this.extend(applyNext(), { theme: 'dark' });
        }),
        elemMods()(function() {
          return this.extend(applyNext(), { size: 'xl' });
        })
      );
    },
    { block: 'b', elem: 'e',  elemMods: { type: 'promo' } },
    '<div class="b__e b__e_type_promo b__e_theme_dark b__e_size_xl"></div>');
  });
});
