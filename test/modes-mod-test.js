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

  describe('modVal types', function() {
    it('number should match to string', function() {
      test(function() {
        block('b').mod('m', 1).tag()('span');
      },
      { block: 'b', mods: { m: '1' } },
      '<span class="b b_m_1"></span>');
    });

    it('string should match to number', function() {
      test(function() {
        block('b').mod('m', '1').tag()('span');
      },
      { block: 'b', mods: { m: 1 } },
      '<span class="b b_m_1"></span>');
    });

    it('boolean should match to string', function() {
      test(function() {
        block('b').mod('m', true).tag()('span');
      },
      { block: 'b', mods: { m: 'true' } },
      '<span class="b b_m_true"></span>');
    });

    it('string should match to boolean', function() {
      test(function() {
        block('b').mod('m', 'true').tag()('span');
      },
      { block: 'b', mods: { m: true } },
      '<span class="b b_m"></span>');
    });

    it('number 1 should not match to boolean true', function() {
      test(function() {
        block('b').mod('m', 1).tag()('span');
      },
      { block: 'b', mods: { m: true } },
      '<div class="b b_m"></div>');
    });

    it('string 1 should not match to null', function() {
      test(function() {
        block('b').mod('m', '1').tag()('span');
      },
      { block: 'b', mods: { m: null } },
      '<div class="b"></div>');
    });
  });
});
