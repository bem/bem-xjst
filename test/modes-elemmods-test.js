var fixtures = require('./fixtures')('bemhtml');
var test = fixtures.test;
var assert = require('assert');

describe('Modes elemMods', function() {
  it('should throw error when args passed to elemMods mode', function() {
    assert.throws(function() {
      fixtures.compile(function() {
        block('b1').elemMods({ type: 'error' });
      });
    });
  });

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

  it('should extend previous elemMods', function() {
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
    '<div class="button__e button__e_type_promo button__e_size_xl ' +
      'button__e_theme_dark"></div>');
  });
});
