var bem = require('..');
var assert = require('assert');
var utile = require('utile');

describe('bem-xjst cache', function() {
  function test(fn, data, expected, options) {
    if (!options) options = {};

    var body = (options.baseTmpl !== false ? require('./fixtures/i-bem.bemhtml') : '') +
               ';\n' +
               fn.toString().replace(/^function\s*\(\)\s*{|}$/g, '');
    var fns = [
      bem.compile(body, utile.mixin({}, options, { cache: true }))
    ];

    fns.forEach(function(fn) {
      assert.deepEqual(fn.apply.call(data || {}), expected);
    });
  }

  it('should work with locals', function() {
    test(function() {
      match()(function() {
        return local('mode', { x: 1, y: this.x.y, z: this[false] })(function() {
          return this.__$history
        });
      });
    }, { __$history: [] }, [
      [['_mode'], 'mode'],
      [['x'],1],
      [['y'],['x','y'],1]
    ], { baseTmpl: false });
  });

  it('should work without history', function() {
    test(function() {
      match()(function() {
        return local('mode', { x: 1 })(function() {
          return 'ok';
        });
      });
    }, {}, 'ok', { baseTmpl: false });
  });
});
