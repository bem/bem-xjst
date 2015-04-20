var bemxjst = require('..');
var assert = require('assert');
var utile = require('utile');
var vm = require('vm');
var ym = require('ym');
var vow = require('vow');

describe('BEMHTML compiler', function() {
  function test(fn, data, expected, options) {
    if (!options) options = {};

    var body = fn.toString().replace(/^function\s*\(\)\s*{|}$/g, '');
    var fns = [
      bemxjst.compile(body, utile.mixin({}, options, { optimize: false })),
      bemxjst.compile(body, options)
    ];

    fns.forEach(function(fn, i) {
      try {
        assert.equal(fn.apply.call(data || {}), expected, i);
      } catch (e) {
        console.error(e.stack);
        throw e;
      }
    });
  }

  it('should compile example code', function() {
    test(function() {
      block('b1').tag()(
        elem('e1')('a'),
        elem('e2').match(function() {
          return this.ctx.hooray();
        })(function() {
          return apply({ 'a': 1 });
        })
      );
    }, { block: 'b1', elem: 'e1' }, '<a class="b1__e1"></a>');
  });

  it('should auto-insert !this.elem properly', function() {
    test(function() {
      block('b1').content()({
        elem: 'e1'
      });

      block('b2').content()('b2');
      block('b3').content()('b3');
      block('b4').content()('b4');
      block('b5').content()('b5');
      block('b6').content()('b6');
      block('b7').content()('b7');
      block('b8').content()('b8');
      block('b9').content()('b9');
      block('b10').content()('b10');
      block('b11').content()('b11');
      block('b12').content()('b12');
      block('b13').content()('b13');
      block('b14').content()('b14');
      block('b15').content()('b15');
      block('b16').content()('b16');
      block('b17').content()('b17');
    }, { block: 'b1' }, '<div class="b1"><div class="b1__e1"></div></div>');
  });

  it('should replace this.elem properly in hashmaps', function() {
    test(function() {
      block('b1')(
          content()({
              elem : 'e1',
              content: 'b1'
          }),
          elem('e1')(
              tag()('span')
          )
      );

      block('b2').tag()('b2');
      block('b3').tag()('b3');
      block('b4').tag()('b4');
      block('b5').tag()('b5');
      block('b6').tag()('b6');
      block('b7').tag()('b7');
      block('b8').tag()('b8');
      block('b9').tag()('b9');
      block('b10').tag()('b10');
      block('b11').tag()('b11');
      block('b12').tag()('b12');
      block('b13').tag()('b13');
      block('b14').tag()('b14');
      block('b15').tag()('b15');
      block('b16').tag()('b16');
      block('b17').tag()('b17');
    }, { block: 'b1' }, '<div class="b1"><span class="b1__e1">b1</span></div>');
  });

  it('should support applyNext()', function() {
    test(function() {
      block('b1').content()(function() {
        return '%' + applyNext() + '%';
      });
      block('b1').content()(function() {
        return '{' + applyNext() + '}';
      });
    }, { block: 'b1', content: 'ohai' }, '<div class="b1">{%ohai%}</div>');
  });

  it('should support block without mode()', function() {
    test(function() {
      block('b1')(function() {
        return '{' + applyNext() + '}';
      });
    }, { block: 'b1' }, '{<div class="b1"></div>}');
  });

  it('should support local', function() {
    test(function() {
      block('b1').content()(function() {
        return local({ tmp: 'b2' })(function() {
          return this.tmp;
        });
      });
    }, { block: 'b1' }, '<div class="b1">b2</div>');
  });

  it('should support applyCtx', function() {
    test(function() {
      block('b1').content()(function() {
        return applyCtx([
          { block: 'b2', content: 'omg' },
          { block: 'b3', tag: 'br' }
        ]);
      });
    }, {
      block: 'b1'
    }, '<div class="b1"><div class="b2">omg</div><br class="b3"/></div>');
  });

  it('should support replace() at runtime', function () {
    test(function() {
      block('b1').content()('ok');
      block('b2').content()('replaced');
      block('b1').replace()(function () { return { block: 'b2' }; });
    }, { block: 'b1' }, '<div class="b2">replaced</div>')
  })

  it('should support extend() at runtime', function () {
    test(function() {
      block('b1').content()('ok');
      block('b1').elem('e').content()('extended');
      block('b1').extend()(function() { return {elem: 'e'}; });
    }, {block: 'b1'}, '<div class="b1__e">extended</div>')
  });

  it('should support custom matches', function () {
    test(function() {
      block('b1').content()('!');
      block('b1').match(function() { return this.ctx.test2; }).content()('ok');
      block('b1').match(function() { return this.ctx.test1; }).content()('!');
    }, {block: 'b1', test2: true }, '<div class="b1">ok</div>')
  });

  it('should support mod() match', function () {
    test(function() {
      block('b1').content()('!');
      block('b1').mod('key', 'val').content()('ok');
    }, {
      block: 'b1', mods: { key: 'val' }
    }, '<div class="b1 b1_key_val">ok</div>')
  });

  it('should support elemMod() match', function () {
    test(function() {
      block('b1').content()('!');
      block('b1').elemMod('key', 'val').content()('ok');
    }, {
      block: 'b1', elemMods: { key: 'val' }
    }, '<div class="b1 b1_key_val">ok</div>')
  });
});
