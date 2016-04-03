var fixtures = require('./fixtures')('bemhtml');
var test = fixtures.test;
var assert = require('assert');
var bemxjst = require('../').bemhtml;

describe('Modes mix', function() {
  it('should throw error when args passed to mix mode', function() {
    assert.throws(function() {
      bemxjst.compile(function() {
        block('b1').mix([
          { block: 'b2' }
        ]);
      });
    });
  });

  it('should set single mix', function() {
    test(function() {
      block('button').mix()({ block: 'mix' });
    },
    { block: 'button' },
    '<div class="button mix"></div>');
  });

  it('should set single mix as function', function() {
    test(function() {
      block('button').mix()(function() { return { block: 'mix' }; });
    },
    { block: 'button' },
    '<div class="button mix"></div>');
  });

  it('should set array mix', function() {
    test(function() {
      block('button').mix()([ { block: 'mix' } ]);
    },
    { block: 'button' },
    '<div class="button mix"></div>');
  });

  it('should set array mix as function', function() {
    test(function() {
      block('button').mix()(function() { return [ { block: 'mix' } ]; });
    },
    { block: 'button' },
    '<div class="button mix"></div>');
  });

  it('should reset elem', function() {
    test(function() {
      block('b1').elem('e1').mix()([
        { block: 'b2' },
        { block: 'b3' }
      ]);
    }, {
      block: 'b1',
      elem: 'e1'
    }, '<div class="b1__e1 b2 b3"></div>');
  });

  it('should avoid loops', function() {
    test(function() {
      block('b1')(
        tag()('a'),
        mix()([
          { block: 'b2' }
        ])
      );
      block('b2')(
        tag()('b'),
        mix()([
          { mods: { modname: 'modval' } },
          { block: 'b1' }
        ])
      );
    }, { block: 'b1' }, '<a class="b1 b2 b2_modname_modval"></a>');
  });

  it('should support nested mix', function() {
    test(function() {
      block('b1')(
        tag()('a'),
        mix()([ { block: 'b2' }, { block: 'b3', elem: 'e3' } ])
      );
      block('b2')(
        tag()('b'),
        mix()([ { mods: { modname: 'modval' } } ])
      );
      block('b3')(
        tag()('b'),
        elem('e3').mix()([ { elemMods: { modname: 1 } } ])
      );
    }, {
      block: 'b1',
      mods: {
        x: 10
      }
    }, '<a class="b1 b1_x_10 b2 b2_modname_modval b3__e3 b3__e3_modname_1">' +
      '</a>');
  });

  it('should check that mix do not overwrite jsParams', function() {
    test(function() {
      block('b1')(
        js()(true),
        mix()([ { block: 'b2' } ])
      );
    }, {
      block: 'b1'
    }, '<div class="b1 b2 i-bem" data-bem=\'{"b1":{}}\'></div>');
  });

  it('should support singular mix', function() {
    test(function() {
      block('b1')(
        mix()({ block: 'b2' })
      );
    }, {
      block: 'b1'
    }, '<div class="b1 b2"></div>');
  });

  it('should support string mix', function() {
    test(function() {
      block('b1')(
        mix()('b2')
      );
    }, {
      block: 'b1'
    }, '<div class="b1 b2"></div>');
  });

  it('should support `undefined` mix', function() {
    test(function() {
      block('b1')(
        mix()(undefined)
      );
    }, {
      block: 'b1'
    }, '<div class="b1"></div>');
  });

  it('should support mixing namesake elements of different blocks', function() {
    test(function() {
      block('b1').elem('elem')(
        mix()({ block: 'b2', elem: 'elem' })
      );
    }, {
      block: 'b1',
      elem: 'elem'
    }, '<div class="b1__elem b2__elem"></div>');
  });
});
