var fixtures = require('./fixtures')('bemhtml');
var test = fixtures.test;

describe('BEMJSON mix', function() {
  it('should support string mix in json', function() {
    test(function() {},
    {
      block: 'b1',
      mix: 'b2'
    },
    '<div class="b1 b2"></div>');
  });

  it('should support object mix in json', function() {
    test(function() {},
    {
      block: 'b1',
      mix: { block: 'b2' }
    },
    '<div class="b1 b2"></div>');
  });

  it('should support array with string mix in json', function() {
    test(function() {},
    {
      block: 'b1',
      mix: [
        'b2'
      ]
    },
    '<div class="b1 b2"></div>');
  });

  it('should support array with object mix in json', function() {
    test(function() {},
    {
      block: 'b1',
      mix: [
        { block: 'b2' }
      ]
    },
    '<div class="b1 b2"></div>');
  });

  it('should not propagate parent elem to JS params', function() {
    test(function() {},
    {
      block: 'b1',
      elem: 'e1',
      mix: { block: 'b2', js: true }
    },
    '<div class="b1__e1 b2 i-bem" data-bem=\'{"b2":{}}\'></div>');
  });

  describe('the same block', function() {
    // Weird case, but for completeness why not to check it.
    // Because we don’t know about difference of entity.block
    // and context.block. See next test.
    it('should duplicate block class if mix block to itself', function() {
      test(function() {},
      {
        block: 'b',
        mix: { block: 'b' }
      },
      '<div class="b b"></div>');
    });

    it('should mix with block itself to elem in block', function() {
      test(function() {},
      {
        block: 'b1',
        content: {
          elem: 'e1',
          mix: { block: 'b1' }
        }
      },
      '<div class="b1"><div class="b1__e1 b1"></div></div>');
    });

    it('should mix block to the same block’s elem', function() {
      test(function() {},
      {
        block: 'b1',
        elem: 'e1',
        mix: { block: 'b1' }
      },
      '<div class="b1__e1 b1"></div>');
    });

    it('should not duplicate block class ' +
      'if mix mods without block to the same block',
      function() {
      test(function() {},
      {
        block: 'b',
        mix: { mods: { m: 'v' } }
      },
      '<div class="b b_m_v"></div>');
    });
  });

  describe('the same block with mods', function() {
    it('should mix block with mods to elem in the same block',
      function() {
      test(function() {},
      {
        block: 'b',
        content: {
          elem: 'e',
          mix: { block: 'b', mods: { m: 'v' } }
        }
      },
      '<div class="b"><div class="b__e b b_m_v"></div></div>');
    });

    it('should duplicate block class ' +
      'if mix several block with mods to elem in the same block',
      function() {
      test(function() {},
      {
        block: 'b',
        content: {
          elem: 'e',
          mix: [
            { block: 'b', mods: { m1: 'v1' } },
            { block: 'b', mods: { m2: 'v2' } }
          ]
        }
      },
      '<div class="b"><div class="b__e b b_m1_v1 b b_m2_v2"></div></div>');
    });

    it('should not duplicate block class if mix mods without block ' +
      'to the same block with mods',
      function() {
      test(function() {},
      {
        block: 'b',
        mods: { m1: 'v1' },
        mix: { mods: { m2: 'v2' } }
      },
      '<div class="b b_m1_v1 b_m2_v2"></div>');
    });

    it('should duplicate mix mods class if mix the same block with mods',
      // Because developer should not want to do this
      // we’ll not check this case.
      function() {
      test(function() {},
      {
        block: 'b',
        mods: { m: 'v' },
        mix: { mods: { m: 'v' } }
      },
      '<div class="b b_m_v b_m_v"></div>');
    });

    it('should not duplicate block class if mix is the same block with mods',
      function() {
      test(function() {},
      {
        block: 'b',
        mix: [
          { block: 'b', mods: { m1: 'v1' } },
          { block: 'b', mods: { m2: 'v2' } }
        ]
      },
      '<div class="b b_m1_v1 b_m2_v2"></div>');
    });

    it('should duplicate block mods class if mix is the same block with mods',
      function() {
      // Because who cares? It’s pretty rare case.
      // To fix this we need to compare each key/val pairs.
      // It’s too expansive.
      // We believe that developers should not want to do this.
      test(function() {},
      {
        block: 'b',
        mods: { m: 'v' },
        mix: { block: 'b', mods: { m: 'v' } }
      },
      '<div class="b b_m_v b_m_v"></div>');
    });
  });

  describe('the same elem', function() {
    // Weird case, but for completeness why not to check it
    it('should not duplicate elem class if mix is the same elem',
      function() {
      test(function() {},
      {
        block: 'b',
        elem: 'e',
        mix: { elem: 'e' }
      },
      '<div class="b__e"></div>');
    });

    // Weird case, but for completeness why not to check it
    it('should not duplicate elem class if mix is the same block elem',
      function() {
      test(function() {},
      {
        block: 'b',
        elem: 'e',
        mix: { block: 'b', elem: 'e' }
      },
      '<div class="b__e"></div>');
    });

    // Weird case, but for completeness why not to check it
    it('should not duplicate elem class if mix the same elem to elem in block',
      function() {
      test(function() {},
      {
        block: 'b',
        content: {
          elem: 'e',
          mix: { elem: 'e' }
        }
      },
      '<div class="b"><div class="b__e"></div></div>');
    });
  });

  describe('the same elem with elemMods', function() {
    it('should not duplicate elem class ' +
      'if mix is the same elem with elemMod',
      function() {
      test(function() {},
      {
        block: 'b',
        elem: 'e',
        mix: { elem: 'e', elemMods: { modname: 'modval' } }
      },
      '<div class="b__e b__e_modname_modval"></div>');
    });

    it('should not duplicate elem class ' +
       'if mix is the same block elem with elemMods',
      function() {
      test(function() {},
      {
        block: 'b',
        elem: 'e',
        mix: { block: 'b', elem: 'e', elemMods: { modname: 'modval' } }
      },
      '<div class="b__e b__e_modname_modval"></div>');
    });

    it('should duplicate elem elemMod class ' +
       'if mix is the same elem elemMod to elem with elemMods in block',
      // Because who cares? It’s pretty rare case.
      // To fix this we need to compare each key/val pairs.
      // It’s too expansive.
      // We believe that developers should not want to do this.
      function() {
      test(function() {},
      {
        block: 'b',
        content: {
          elem: 'e',
          elemMods: { modname: 'modval' },
          mix: { elem: 'e', elemMods: { modname: 'modval' } }
        }
      },
      '<div class="b"><div class="b__e b__e_modname_modval ' +
        'b__e_modname_modval"></div></div>');
    });
  });

  describe('nested mixes', function() {
    it('should support nested mix in json', function() {
      test(function() {},
      {
        block: 'b1',
        mix: {
          block: 'b2',
          elem: 'e',
          mix: {
            block: 'b3',
            mods: { test: 'opa' },
            mix: [
              { block: 'b4' },
              { block: 'b5' }
            ]
          }
        }
      },
      '<div class="b1 b2__e b3 b3_test_opa b4 b5"></div>');
    });

    it('should support string mix ' +
        'with nested string mix in bemhtml', function() {
      test(function() {
        block('b2')(
          addMods()('b3')
        );
      }, {
        block: 'b1',
        mix: 'b2'
      }, '<div class="b1 b2 b3"></div>');
    });

    it('should support string mix ' +
        'with nested object mix in bemhtml', function() {
      test(function() {
        block('b2')(
          addMods()({ block: 'b3' })
        );
      }, {
        block: 'b1',
        mix: 'b2'
      }, '<div class="b1 b2 b3"></div>');
    });

    it('should support string mix ' +
        'with nested array of strings mix in bemhtml', function() {
      test(function() {
        block('b2')(
          addMods()([ 'b3' ])
        );
      }, {
        block: 'b1',
        mix: 'b2'
      }, '<div class="b1 b2 b3"></div>');
    });

    it('should support string mix ' +
        'with nested array of objects mix in bemhtml', function() {
      test(function() {
        block('b2')(
          addMods()([ { block: 'b3' } ])
        );
      }, {
        block: 'b1',
        mix: 'b2'
      }, '<div class="b1 b2 b3"></div>');
    });

    it('should support object mix ' +
        'with nested string mix in bemhtml', function() {
      test(function() {
        block('b2')(
          addMods()('b3')
        );
      }, {
        block: 'b1',
        mix: {
          block: 'b2'
        }
      }, '<div class="b1 b2 b3"></div>');
    });

    it('should support object mix ' +
        'with nested object mix in bemhtml', function() {
      test(function() {
        block('b2')(
          addMods()({ block: 'b3' })
        );
      }, {
        block: 'b1',
        mix: {
          block: 'b2'
        }
      }, '<div class="b1 b2 b3"></div>');
    });

    it('should support object mix ' +
        'with nested array of strings mix in bemhtml', function() {
      test(function() {
        block('b2')(
          addMods()([ 'b3' ])
        );
      }, {
        block: 'b1',
        mix: {
          block: 'b2'
        }
      }, '<div class="b1 b2 b3"></div>');
    });

    it('should support object mix ' +
        'with nested array of objects mix in bemhtml', function() {
      test(function() {
        block('b2')(
          addMods()([ { block: 'b3' } ])
        );
      }, {
        block: 'b1',
        mix: {
          block: 'b2'
        }
      }, '<div class="b1 b2 b3"></div>');
    });

    it('should support nested mix with js params', function() {
      test(function() {},
      {
        block: 'b1',
        mix: {
          block: 'b2',
          elem: 'e',
          mix: {
            block: 'b3',
            mods: { test: 'opa' },
            js: { data: '123' },
            mix: [
              { block: 'b4', js: { t: 1 } },
              { block: 'b5' }
            ]
          }
        }
      },
      '<div class="b1 b2__e b3 b3_test_opa b4 b5 i-bem" ' +
        'data-bem=\'{"b3":{"data":"123"},"b4":{"t":1}}\'></div>');
    });
  });
});
