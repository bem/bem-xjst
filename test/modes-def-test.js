var assert = require('assert');
var bemhtml = require('./fixtures')('bemhtml');
var fixtures = require('./fixtures')('bemhtml');
var test = fixtures.test;

describe('Modes def', function() {
  it('should throw error when args passed to def mode', function() {
    assert.throws(function() {
      bemhtml.compile(function() {
        block('b1').def('blah');
      });
    });
  });

  it('mods() templates should apply', function() {
    test(function() {
      block('a').def()('NO');
      block('a').mods()({ m: true });
      block('a').mod('m').def()('YES');
    },
    { block: 'a' },
    'YES');
  });

  it('addMods() templates should apply', function() {
    test(function() {
      block('a').def()('NO');
      block('a').addMods()({ m: true });
      block('a').mod('m').def()('YES');
    },
    { block: 'a' },
    'YES');
  });

  it('elemMods() templates should apply', function() {
    test(function() {
      block('a').elem('e').def()('NO');
      block('a').elem('e').elemMods()({ m: true });
      block('a').elem('e').elemMod('m').def()('YES');
    },
    { block: 'a', elem: 'e' },
    'YES');
  });

  it('addEemMods() templates should apply', function() {
    test(function() {
      block('a').elem('e').def()('NO');
      block('a').elem('e').addElemMods()({ m: true });
      block('a').elem('e').elemMod('m').def()('YES');
    },
    { block: 'a', elem: 'e' },
    'YES');
  });
});
