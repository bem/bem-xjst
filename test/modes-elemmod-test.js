var fixtures = require('./fixtures')('bemhtml');
var test = fixtures.test;

describe('Modes elemMod(elemModName, elemModVal)', function() {
  it('should support elemMod() match', function () {
    test(function() {
      block('b1').content()('!');
      block('b1').elem('e1').elemMod('key', 'val').content()('ok');
    }, {
      block: 'b1', elem: 'e1', elemMods: { key: 'val' }
    }, '<div class="b1__e1 b1__e1_key_val">ok</div>');
  });

  it('should match and process boolean elemMods', function() {
    test(function() {
      block('b').elem('inner').elemMod('valid', true).tag()('span');
    },
    {
      block: 'b',
      content: { elem: 'inner',
      elemMods: { valid: true }
      }
    },
    '<div class="b">' +
      '<span class="b__inner b__inner_valid"></span>' +
    '</div>');
  });

  it('should match and process string elemMods', function() {
    test(function() {
      block('b').elem('inner').elemMod('valid', 'yes').tag()('span');
    },
    {
      block: 'b',
      content: {
        elem: 'inner',
        elemMods: { valid: 'yes' }
      }
    },
    '<div class="b">' +
      '<span class="b__inner b__inner_valid_yes"></span>' +
    '</div>');
  });

  it('should not match string values of boolean elemMods', function() {
    test(function() {
      block('b').elem('inner').elemMod('valid', true).tag()('span');
    },
    {
      block: 'b',
      content: {
        elem: 'inner',
        elemMods: { valid: 'valid' }
      }
    },
    '<div class="b">' +
      '<div class="b__inner b__inner_valid_valid"></div>' +
    '</div>');
  });

  describe('elemModVal types', function() {
    it('number should match to string', function() {
      test(function() {
        block('b').elem('e').elemMod('em', 1).tag()('span');
      },
      { block: 'b', elem: 'e', elemMods: { em: '1' } },
      '<span class="b__e b__e_em_1"></span>');
    });

    it('string should match to number', function() {
      test(function() {
        block('b').elem('e').elemMod('em', '1').tag()('span');
      },
      { block: 'b', elem: 'e', elemMods: { em: 1 } },
      '<span class="b__e b__e_em_1"></span>');
    });

    it('boolean should match to string', function() {
      test(function() {
        block('b').elem('e').elemMod('em', 'true').tag()('span');
      },
      { block: 'b', elem: 'e', elemMods: { em: true } },
      '<span class="b__e b__e_em"></span>');
    });

    it('string should match to boolean', function() {
      test(function() {
        block('b').elem('e').elemMod('em', 'true').tag()('span');
      },
      { block: 'b', elem: 'e', elemMods: { em: true } },
      '<span class="b__e b__e_em"></span>');
    });
  });
});
