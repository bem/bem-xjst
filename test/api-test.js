var bemxjst = require('..');
var assert = require('assert');
var utile = require('utile');
var vm = require('vm');
var ym = require('ym');
var vow = require('vow');

var str = JSON.stringify;
JSON.stringify = function(obj) {
  return str.apply(this, arguments);
};

describe('BEMHTML compiler', function() {
  function test(fn, data, expected, options) {
    if (!options) options = {};

    var body = (options.baseTmpl !== false ? require('./fixtures/i-bem.bemhtml') : '') +
               ';\n' +
               fn.toString().replace(/^function\s*\(\)\s*{|}$/g, '');
    var fns = [
      bemxjst.compile(body, utile.mixin({}, options, { optimize: false })),
      bemxjst.compile(body, options)
    ];

    fns.forEach(function(fn, i) {
      try {
        debugger;
        assert.equal(fn.apply.call(data || {}), expected, i);
      } catch (e) {
        throw e;
      }
    });
  }

  function testDesugaring(fn, fnDesugared, options) {
    if (!options) options = {};

    var ibem = '';
    if (options.baseTmpl !== false)
      ibem = require('./fixtures/i-bem.bemhtml') + ';\n';

    var bodies = [fn, fnDesugared].map(function (fn) {
      return ibem + fn.toString().replace(/^function\s*\(\)\s*{|}$/g, '');
    })

    assert.notEqual(bodies[0], bodies[1]);

    assert.equal(bemxjst.generate(bodies[0], options),
                 bemxjst.generate(bodies[1], options));
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
        return applyCtx({ 'ctx.flag': 'flag' }, { block: 'b2' });
      });
      block('b2').tag()(function() {
        return this.ctx.flag;
      });
    }, { block: 'b1' }, '<div class="b1"><flag class="b2"></flag></div>');
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

  it('should compile realworld templates', function() {
    test(function() {
      // i-jquery
      block('i-jquery').elem('core').def()(function() {
        return applyCtx({
          block: 'b-page',
          elem: 'js',
          url: '//yandex.st/jquery/1.7.2/jquery.min.js'
        });
      });

      // i-ua
      block('i-ua')(
        tag()('script'),
        bem()(false),
        content()(function() {
          return [
            ';(function(d,e,c,r){',
                'e=d.documentElement;',
                'c="className";',
                'r="replace";',
                'e[c]=e[c][r]("i-ua_js_no","i-ua_js_yes");',
                'if(d.compatMode!="CSS1Compat")',
                'e[c]=e[c][r]("i-ua_css_standart","i-ua_css_quirks")',
            '})(document);'
          ].join('');
        })
      );

      // b-page
      block('b-page')(
        mode('doctype')(function() {
          return this.ctx.doctype || '<!DOCTYPE html>';
        }),
        mode('xUACompatible')(function() {
          return this.ctx['x-ua-compatible'] === false ? false : {
            tag: 'meta',
            attrs: {
              'http-equiv': 'X-UA-Compatible',
              content: this.ctx['x-ua-compatible'] || 'IE=EmulateIE7, IE=edge'
            }
          };
        }),
        def().match(function() { return !this.ctx._isBody })(function() {
          var ctx = this.ctx,
              dtype = apply('doctype'),
              xUA = apply('xUACompatible'),
              buf = [
                dtype,
                {
                  elem: 'root',
                  content: [
                    {
                      elem: 'head',
                      content: [
                        {
                          tag: 'meta',
                          attrs: { charset: 'utf-8' }
                        },
                        xUA,
                        {
                          tag: 'title',
                          content: ctx.title
                        },
                        ctx.favicon ? {
                          elem: 'favicon',
                          url: ctx.favicon
                        } : '',
                        ctx.meta,
                        { block: 'i-ua' },
                        ctx.head
                      ]
                    },
                    ctx
                  ]
                }
              ];

          local({ 'ctx._isBody': true })(applyCtx(buf));
        }),
        tag()('body'),
        mix().match(this.elem !== 'body')(function() {
          return [{ elem: 'body' }];
        }),
        elem('root')(
          bem()(false),
          tag()('html'),
          cls()('i-ua_js_no i-ua_css_standart')
        ),

        elem('head')(
          bem()(false),
          tag()('head')
        ),

        elem('meta')(
          bem()(false),
          tag()('meta'),
          attrs()(function() { return this.ctx.attrs })
        ),

        elem('favicon')(
          bem()(false),
          tag()('link'),
          attrs()(function() {
            return { rel: 'shortcut icon', href: this.ctx.url }
          })
        )
      );

      // b-page__css
      block('b-page').elem('css')(
        bem()(false),
        tag()('style'),
        def().match(function() { return this.ctx.hasOwnProperty('ie') },
                    function() { return !this.ctx._ieCommented })(function() {
          var ie = this.ctx.ie;
          if (ie === true) {
            apply('', {
              ctx: [6, 7, 8, 9].map(function(v) {
                return {
                  elem: 'css',
                  url: this.ctx.url + '.ie' + v + '.css', ie: 'IE ' + v
                };
              }, this)
            });
          } else {
            var hideRule = !ie ?
              ['gt IE 9', '<!-->', '<!--'] :
              ie === '!IE' ?
              [ie, '<!-->', '<!--'] :
              [ie, '', ''];
            apply('', {
              'ctx._ieCommented': true,
              ctx: [
                '<!--[if ' + hideRule[0] + ']>',
                hideRule[1],
                this.ctx,
                hideRule[2],
                '<![endif]-->'
              ]
            });
          }
        }),
        match(function() { return this.ctx.url })(
          tag()('link'),
          attrs()(function() {
            return { rel: 'stylesheet', href: this.ctx.url }
          })
        )
      );

      // b-page__js
      block('b-page').elem('js')(
        bem()(false),
        tag()('script'),
        attrs().match(function() { return this.ctx.url })(function() {
          return { src: this.ctx.url }
        })
      );

      // b-link
      block('b-link')(
        tag()('a'),
        attrs()(function() {
          var ctx = this.ctx,
              props = ['title', 'target'],
              p = typeof ctx.url,
              a = {
                href: (p === 'undefined' || p === 'string') ? ctx.url :
                  (p = [], apply('', { _buf: p, ctx: ctx.url }),
                   p.join(''))
              };

          while(p = props.pop()) ctx[p] && (a[p] = ctx[p]);

          return a;
        })
      );

      // b-link__inner
      block('b-link').elem('inner').tag()('span');

      // b-link__pseudo
      block('b-link').match(this.mods && this.mods.pseudo, !this.elem)(
        tag()(function() { return this.ctx.url? 'a' : 'span' }),
        js()(true),
        attrs().match(function() { return !this.ctx.url })(function() {
          return {};
        }),
        content().match(function() {
          return !this.ctx._wrap
        }, function() {
          return !this.mods.inner
        })(function() {
          apply('', {
            ctx: {
              elem: 'inner',
              content: this.ctx.content,
              _wrap: true
            }
          });
        })
      );

    }, {
      "block": "b-page",
      "title": "Pseudo link",
      "head": [
        { "elem": "css", "url": "example.css"},
        { "elem": "css", "url": "example.ie.css", "ie": "lt IE 8" },
        { "block": "i-jquery", "elem": "core" },
        { "elem": "js", "url": "example.js" }
      ],
      "content": [
        {
          "block": "b-link",
          "mods" : { "pseudo" : "yes", "togcolor" : "yes", "color": "green" },
          "url": "#",
          "target": "_blank",
          "title": "Click me",
          "content": "This pseudo link changes its color after click"
        }
      ]
    }, '<!DOCTYPE html><html class="i-ua_js_no i-ua_css_standart"><head>' +
       '<meta charset="utf-8"/><meta http-equiv="X-UA-Compatible" conten' +
       't="IE=EmulateIE7, IE=edge"/><title>Pseudo link</title><script>;(' +
       'function(d,e,c,r){e=d.documentElement;c="className";r="replace";' +
       'e[c]=e[c][r]("i-ua_js_no","i-ua_js_yes");if(d.compatMode!="CSS1C' +
       'ompat")e[c]=e[c][r]("i-ua_css_standart","i-ua_css_quirks")})(doc' +
       'ument);</script><link rel="stylesheet" href="example.css"/><!--[' +
       'if lt IE 8]><link rel="stylesheet" href="example.ie.css"/><![end' +
       'if]--><script src="//yandex.st/jquery/1.7.2/jquery.min.js"></scr' +
       'ipt><script src="example.js"></script></head><body class="b-page' +
       ' b-page__body"><a class="b-link b-link_pseudo_yes b-link_togcolo' +
       'r_yes b-link_color_green i-bem" data-bem=\'{"b-link":{}}\' href=' +
       '"#" target="_blank" title="Click me"><span class="b-link__inner"' +
       '>This pseudo link changes its color after click</span></a></body' +
       '></html>');
  });

  it('should desugar replace() mode', function () {
    testDesugaring(function () {
      block('b1').replace()(function() { return { block: 'b2' }; });
      block('b2').replace()(function() { return { block: 'b3' }; });
    }, function () {
      block('b1').def()(function() { return applyCtx({ block: 'b2' }); });
      block('b2').def()(function() { return applyCtx({ block: 'b3' }); });
    })
  });

  it('should support replace() at runtime', function () {
    test(function () {
      block('b1').content()('ok');
      block('b2').content()('replaced');
      block('b1').replace()(function () { return { block: 'b2' }; });
    }, { block: 'b1' }, '<div class="b2">replaced</div>')
  })

  it('should desugar extend() mode', function () {
    testDesugaring(function () {
      block('b1').extend()(function() { return { elem: 'e' }; });
      block('b1').elem('e').extend()(function() {
        return { "mods" : { "pseudo" : "yes" } };
      });
    }, function () {
      block('b1').def()(function() {
        return applyCtx(this.extend(this.ctx, { elem: 'e' }));
      });
      block('b1').elem('e').def()(function() {
        return applyCtx(this.extend(this.ctx, {
          "mods" : { "pseudo" : "yes" }
        }));
      });
    })
  });

  it('should support extend() at runtime', function () {
    test(function () {
      block('b1').content()('ok');
      block('b1').elem('e').content()('extended');
      block('b1').extend()(function() { return {elem: 'e'}; });
    }, {block: 'b1'}, '<div class="b1__e">extended</div>')
  });

  it('should handle escaping this', function () {
    test(function () {
      block('b1').content()(function() {
        var _this = this;
        return _this.block;
      });
    }, {block: 'b1' }, '<div class="b1">b1</div>')
  });

  it('should handle escaping this in locals', function () {
    test(function () {
      block('b1').content()(function() {
        return '-' + local({})(function() {
          var _this = this;
          return _this.block;
        });
      });
    }, {block: 'b1' }, '<div class="b1">-b1</div>')
  });

  it('should handle escaping apply', function () {
    test(function () {
      block('b1').mode('custom')('ok');
      block('b1').content()(function() {
        return [ this ].map(function(ctx) {
          return this.block + ':' +
                 ctx.block + ':' +
                 apply({ _mode: 'custom' });
        }, this).join('');
      });
    }, {block: 'b1' }, '<div class="b1">b1:b1:ok</div>')
  });

  it('should handle escaping apply in local', function () {
    test(function () {
      block('b1').mode('custom')('ok');
      block('b1').content()(function() {
        return '' + local({})(function() {
          return this.block + ':' +
                 apply({ _mode: 'custom' });
        });
      });
    }, {block: 'b1' }, '<div class="b1">b1:ok</div>')
  });

  it('should support once()', function () {
    test(function () {
      block('b1').content()('second');
      block('b1').once().content()('first');
    }, [
      { block: 'b1' },
      { block: 'b1' }
    ], '<div class="b1">first</div><div class="b1">second</div>');
  });

  it('should support wrap()', function () {
    test(function () {
      block('b1').wrap()(function() {
        return {
          block: 'wrap',
          content: this.ctx
        };
      });
    }, {
      block: 'b1',
      content: {
        block: 'b1'
      }
    }, '<div class="wrap"><div class="b1"><div class="wrap"><div class="b1">' +
       '</div></div></div></div>');
  });

  it('should not fail on wrap() with other modes', function() {
    test(function() {
      block('b1')(
        tag()('span'), // can be any other mode
        wrap()(function() {
          return {
            elem: 'wrap',
            content: this.ctx
          };
        })
      );
    }, {
        block: 'b1'
    }, '<div class="b1__wrap"><span class="b1"></span></div>');
  });

  it('should replace global properties local body in hashmap', function () {
    test(function () {
      block('b32').content()('nope');
      block('b31').content()('nope');
      block('b30').content()('nope');
      block('b29').content()('nope');
      block('b28').content()('nope');
      block('b27').content()('nope');
      block('b26').content()('nope');
      block('b25').content()('nope');
      block('b24').content()('nope');
      block('b23').content()('nope');
      block('b22').content()('nope');
      block('b21').content()('nope');
      block('b20').content()('nope');
      block('b19').content()('nope');
      block('b18').content()('nope');
      block('b17').content()('nope');
      block('b16').content()('nope');
      block('b15').content()('nope');
      block('b14').content()('nope');
      block('b13').content()('nope');
      block('b12').content()('nope');
      block('b11').content()('nope');
      block('b10').content()('nope');
      block('b9').content()('nope');
      block('b8').content()('nope');
      block('b7').content()('nope');
      block('b6').content()('nope');
      block('b5').content()('nope');
      block('b4').content()('nope');
      block('b3').content()('nope');
      block('b2').content()('nope');

      block('b1').content()(function() {
        return apply({ elem: 'custom' });
      });

      content().elem('custom')('ok');
    }, {block: 'b1' }, '<div class="b1">ok</div>')
  });
});

describe('BEMTREE compiler', function() {

  var body = require('./fixtures/i-bem.bemtree') +
              ';\n' +
              "block('b1').content()({ elem: 'inner' })";
  var data = { block: 'b1' };
  var expected = '{"block":"b1","mods":{},"content":{"elem":"inner"}}';
  var options = {
    wrap : true,
    exportName : 'BEMTREE',
    modulesDeps : { vow : 'Vow' }
  };
  var tmpl = bemxjst.generate(body, options);

  it('should export BEMTREE as node.js module', function(done) {
    var tmpl = bemxjst.generate(body, options);
    var ctx = { exports: exports, Vow: vow };

    vm.runInNewContext(tmpl, ctx);

    ctx.exports.BEMTREE
      .apply({ block: 'b1' })
      .then(function(bemjson) {
        assert.equal(JSON.stringify(bemjson), expected);
        done();
      }).fail(done);
  });

  it('should export BEMTREE to global scope', function(done) {
    var ctx = { Vow: vow };

    vm.runInNewContext(tmpl, ctx);

    ctx.BEMTREE
      .apply({ block: 'b1' })
      .then(function(bemjson) {
        assert.equal(JSON.stringify(bemjson), expected);
        done();
      }).fail(done);
  });

  it('should get Vow as YModule', function(done) {
    ym.define('vow', function(provide) { provide(vow); });

    var ctx = { modules: ym };

    vm.runInNewContext(tmpl, ctx);

    ctx.modules.require(['BEMTREE'], function(BEMTREE) {
      BEMTREE
        .apply({ block: 'b1' })
        .then(function(bemjson) {
          assert.equal(JSON.stringify(bemjson), expected);
          done();
        }).fail(done);
    });

  });

});
