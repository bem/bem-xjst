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
        return applyCtx({ 'ctx.flag': 'flag' }, { block: 'b2' });
      });
      block('b2').tag()(this.ctx.flag);
    }, { block: 'b1' }, '<div class="b1"><flag class="b2"></flag></div>');
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

  it('should understand mod()', function() {
    test(function() {
      match()('not ok');
      block('b1').mod('a', 'b')('ok');
    }, { block: 'b1', mods: { a: 'b' } }, 'ok', {
      ibem: false
    });
  });

  it('should understand elemMod()', function() {
    test(function() {
      match()('not ok');
      block('b1').elemMod('a', 'b')('ok');
    }, { block: 'b1', elemMods: { a: 'b' } }, 'ok', {
      ibem: false
    });
  });

  it('should understand elemMatch()', function() {
    test(function() {
      match()('not ok');
      block('b1').elemMatch(this.elem === 'x')('ok')
    }, { block: 'b1', elem: 'x' }, 'ok', { ibem: false });
  });

  it('should not break on regression test#1', function() {
    test(function() {
      match()('ok');
      match(function() {
        return this["__$anflg681825457"] !== true
      })(function() {
        return local({ "__$anflg681825457": (true) })(function() {
          return local({ "ctx": (5) })(function() {
            return apply()
          })
        })
      })
    }, {}, 'ok', { ibem: false });
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
        content()([
            ';(function(d,e,c,r){',
                'e=d.documentElement;',
                'c="className";',
                'r="replace";',
                'e[c]=e[c][r]("i-ua_js_no","i-ua_js_yes");',
                'if(d.compatMode!="CSS1Compat")',
                'e[c]=e[c][r]("i-ua_css_standart","i-ua_css_quirks")',
            '})(document);'
        ].join(''))
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
        mix().match(this.elem !== 'body')([{ elem: 'body' }]),
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
        attrs().match(function() { return !this.ctx.url })({}),
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
    }, '<!DOCTYPE html><html class="i-ua_js_no i-ua_css_standart">' +
       '<head><meta charset="utf-8"/>' +
       '<meta http-equiv="X-UA-Compatible" content="IE=EmulateIE7, IE=edge"/>' +
       '<title>Pseudo link</title>' +
       '<script>;(function(d,e,c,r){e=d.documentElement;c="className";' +
       'r="replace";e[c]=e[c][r]("i-ua_js_no","i-ua_js_yes");' +
       'if(d.compatMode!="CSS1Compat")e[c]=e[c][r]' +
       '("i-ua_css_standart","i-ua_css_quirks")})(document);</script>' +
       '<link rel="stylesheet" href="example.css"/><!--[if lt IE 8]>' +
       '<link rel="stylesheet" href="example.ie.css"/><![endif]-->' +
       '<script src="//yandex.st/jquery/1.7.2/jquery.min.js"></script>' +
       '<script src="example.js"></script>' +
       '</head>' +
       '<body class="b-page b-page__body">' +
       '<a class="b-link b-link_pseudo_yes b-link_togcolor_yes ' +
       'b-link_color_green i-bem" onclick="return {&quot;b-link&quot;:{}}" ' +
       'href="#" target="_blank" title="Click me">' +
       '<span class="b-link__inner">' +
       'This pseudo link changes its color after click</span></a>' +
       '</body></html>');
  });
});
