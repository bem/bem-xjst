var fixtures = require('./fixtures')('bemhtml');
var test = fixtures.test;
var assert = require('assert');

describe('Modes mods', function() {
  it('should throw error when args passed to mods mode', function() {
    assert.throws(function() {
      fixtures.compile(function() {
        block('b1').mods({ type: 'error' });
      });
    });
  });

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

  it('should extend previous mods', function() {
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
    '<div class="button button_type_promo button_size_xl ' +
    'button_theme_dark"></div>');
  });
});
