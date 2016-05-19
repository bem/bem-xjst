var fixtures = require('./fixtures')('bemhtml');
var test = fixtures.test;

describe('Modes .mod(modName, modVal)', function() {
  it('should support mod() match', function () {
    test(function() {
      block('b1').content()('!');
      block('b1').mod('key', 'val').content()('ok');
    }, {
      block: 'b1', mods: { key: 'val' }
    }, '<div class="b1 b1_key_val">ok</div>');
  });

  it('should match and process boolean mods', function() {
    test(function() {
      block('b').mod('valid', true).tag()('span');
    },
    { block: 'b', mods: { valid: true } },
    '<span class="b b_valid"></span>');
  });

  it('should match and process string mods', function() {
    test(function() {
      block('b').mod('valid', 'yes').tag()('span');
    },
    { block: 'b', mods: { valid: 'yes' } },
    '<span class="b b_valid_yes"></span>');
  });

  it('should not match string values of boolean elemMods', function() {
    test(function() {
      block('b').mod('valid', true).tag()('span');
    },
    { block: 'b', mods: { valid: 'valid' } },
    '<div class="b b_valid_valid"></div>');
  });

  it('should support simple mods', function() {
    test(function() {
      block('b').mod('disabled').tag()('span');
    },
    { block: 'b', mods: { disabled: true } },
    '<span class="b b_disabled"></span>');
  });
});
