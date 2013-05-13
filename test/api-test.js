var bem = require('..');
var assert = require('assert');
var utile = require('utile');

describe('BEM.js compiler', function() {
  function test(fn, data, expected, options) {
    if (!options) options = {};

    var body = (options.ibem !== false ? require('./fixtures/i-bem') : '') +
               ';\n' +
               fn.toString().replace(/^function\s*\(\)\s*{|}$/g, '');
    var fns = [
      bem.compile(body, utile.mixin({}, options, { optimize: false })),
      bem.compile(body, options)
    ];

    fns.forEach(function(fn) {
      assert.equal(fn.apply.call(data || {}), expected);
    });
  }

  it('should compile example code', function() {
    test(function() {
      block('b1').tag()(
        elem('e1')('a'),
        elem('e2').match(function() {
          return this.ctx.hooray();
        })(function() {
          return apply('mode', { 'a': 1 });
        })
      );
    }, { block: 'b1', elem: 'e1' }, '<a class="b1__e1"></a>');
  });

  it('should understand applyCtx', function() {
    test(function() {
      block('b1').content()(function() {
        return applyCtx({ block: 'b2' });
      });
      block('b2').tag()('li');
    }, { block: 'b1' }, '<div class="b1"><li class="b2"></li></div>');
  });

  it('should work without ibem', function() {
    test(function() {
      block('b1')(function() {
        return '<div class=b1>' + apply('content') + '</div>'
      });
      block('b1').content()('ahhaha');
    }, { block: 'b1' }, '<div class=b1>ahhaha</div>', {
      ibem: false
    });
  });
});
