var fixtures = require('./fixtures')('bemhtml');
var test = fixtures.test;
var assert = require('assert');
var BEMXJSTError = require('../lib/bemxjst/error').BEMXJSTError;
var bemhtml = require('../').bemhtml;
var bemtree = require('../').bemtree;

describe('Templates syntax', function() {
  it('should support block without mode()', function() {
    test(function() {
      block('b1')(function() {
        return '{' + applyNext() + '}';
      });
    }, { block: 'b1' }, '{<div class="b1"></div>}');
  });

  it('should support mixed direct/nested bodies', function() {
    test(function() {
      block('page')(
        content()(
          function() { return 'ok'; },
          match(function() { return true; })(function() {
            return applyNext();
          })
        )
      );
    }, { block: 'page' }, '<div class="page">ok</div>');
  });

  it('should expect other templates as template body', function() {
    test(function() {
      block('b')(tag()('b'), bem()(false));
    },
    { block: 'b' },
    '<b></b>');
  });

  it('should work with any subpredicate order', function() {
    test(function() {
      tag().block('b').mod('m', 'v')('b');
    },
    { block: 'b', mods: { m: 'v' } },
    '<b class="b b_m_v"></b>');
  });

  it('should throw error when no block subpredicate', function() {
    assert.throws(function() {
      fixtures.compile(function() {
        // No block() subpredicate
        elem('e').tag()('b');
        elemMod('m', 'v').tag()('b');
      });
    }, BEMXJSTError);
  });

  it('should throw error when no block custom subpredicate', function() {
    assert.throws(function() {
      fixtures.compile(function() {
        // No block() subpredicate
        match(function() { return 1; }).tag()('b');
      });
    }, BEMXJSTError);
  });

  it('should work without Error.captureStackTrace', function() {
    var captureStackTrace = Error.captureStackTrace;
    assert.throws(function() {
      fixtures.compile(function() {
        Error.captureStackTrace = false;
        // No block() subpredicate
        match(function() { return 1; }).tag()('b');
      });
    }, BEMXJSTError);
    Error.captureStackTrace = captureStackTrace;
  });

  it('bemhtml should return null if null passed', function() {
    var templates = bemhtml.compile(function() {
      block('b')(null);
    });

    assert.equal(
      templates.apply({ block: 'b' }),
      null
    );
  });

  it('bemtree should return null if null passed', function() {
    var templates = bemtree.compile(function() {
      block('b')(null);
    });

    assert.equal(
      templates.apply({ block: 'b' }),
      null
    );
  });

  describe('shortcut', function() {
    describe('should work in chain with "non output modes"', function() {
      it('block() mode only', function() {
        test(function() {
            block('button')({
              tag: 'button',
              mix: 'mixed'
            });
          },
          { block: 'button' },
          '<button class="button mixed"></button>');
      });

      it('def() mode as default shortcut', function() {
        test(function() {
            block('b')({ default: 'result' });
          },
          { block: 'b' },
          'result');
      });

      it('def() mode as def shortcut', function() {
        test(function() {
            block('b')({ def: 'result' });
          },
          { block: 'b' },
          'result');
      });

      it('match() mode', function() {
        test(function() {
            block('b').match(function() {
              return this.ctx.flag;
            })({ tag: 'span', mix: 'mixed' });
          },
          { block: 'b', flag: 1 },
          '<span class="b mixed"></span>');
      });

      it('match in shortcut is treated as user defined mode ' +
        'not as subpredicate', function() {
        test(function() {
            block('b')({
              match: function(node) {
                node.sideEffect = 'who cares?';
                return 'But ';
              },
              content: function() {
                return apply('match') + this.sideEffect;
              }
            });
          },
          { block: 'b' },
          '<div class="b">But who cares?</div>');
      });

      it('mod() mode', function() {
        test(function() {
            block('b').mod('modName', 'modVal')({ tag: 'span', mix: 'mixed' });
          },
          { block: 'b', mods: { modName: 'modVal' } },
          '<span class="b b_modName_modVal mixed"></span>');
      });

      it('elem() mode', function() {
        test(function() {
            block('b').elem('e')({ tag: 'span', mix: 'mixed' });
          },
          { block: 'b', elem: 'e' },
          '<span class="b__e mixed"></span>');
      });

      it('elemMod() mode', function() {
        test(function() {
            block('b')
              .elem('e')
              .elemMod('elemModName', 'elemModVal')
              ({ tag: 'span', mix: 'mixed' });
          },
          { block: 'b', elem: 'e', elemMods: { elemModName: 'elemModVal' } },
          '<span class="b__e b__e_elemModName_elemModVal mixed"></span>');
      });

      it('custom user defined mode', function() {
        test(function() {
            block('b')({
              myMode: function() { return 1 + 1; },
              myConstMode: 40
            });

            block('b').content()(function() {
              return apply('myMode') + apply('myConstMode');
            });
          },
          { block: 'b' },
          '<div class="b">42</div>');
      });

      it('wrap() mode', function() {
        test(function() {
            block('b')({
              wrap: function() {
                return {
                  block: 'wrapper',
                  content: this.ctx
                };
              }
            });
          },
          { block: 'b' },
          '<div class="wrapper"><div class="b"></div></div>');
      });

      it('replace() mode', function() {
        test(function() {
            block('b')({ replace: { block: 'c' } });
          },
          { block: 'b' },
          '<div class="c"></div>');
      });

      it('extend() mode', function() {
        test(function() {
            block('b')({ extend: { 'ctx.content': 'extended' } });
          },
          { block: 'b' },
          '<div class="b">extended</div>');
      });

      it('addAttrs() mode should add attrs', function() {
        test(function() {
            block('b')({ addAttrs: { name: 'test' } });
          },
          { block: 'b', attrs: { id: 'some' } },
          '<div class="b" id="some" name="test"></div>');
      });

      it('addElemMods() mode should add elemMods', function() {
        test(function() {
            block('b').elem('e')({ addElemMods: { templ: 'test' } });
          },
          { block: 'b', elem: 'e', elemMods: { bemjson: 'some' } },
          '<div class="b__e b__e_bemjson_some b__e_templ_test"></div>');
      });

      it('addJs() mode should add js-params and i-bem className', function() {
        test(function() {
            block('b')({ addJs: { templ: 'test' } });
          },
          { block: 'b', js: { bemjson: 'some' } },
          '<div class="b i-bem" data-bem=\'{"b":{"bemjson":"some",' +
            '"templ":"test"}}\'></div>');
      });

      it('addMix() mode should add mix', function() {
        test(function() {
            block('a')({ addMix: { block: 'c' } });
          },
          { block: 'a', mix: { block: 'b' } },
          '<div class="a b c"></div>');
      });

      it('addMods() mode should add mods', function() {
        test(function() {
            block('b')({ addMods: { templ: 'test' } });
          },
          { block: 'b', mods: { bemjson: 'some' } },
          '<div class="b b_bemjson_some b_templ_test"></div>');
      });

      it('appendContent() mode should append content', function() {
        test(function() {
            block('b')({ appendContent: ' post' });
          },
          { block: 'b', content: 'content' },
          '<div class="b">content post</div>');
      });

      it('attrs() mode should override attrs from BEMJSON', function() {
        test(function() {
            block('a')({
              attrs: function() {
                var attrsFromData = applyNext();
                return { id: attrsFromData.id.substr(0, 3) };
              }
            });
          },
          { block: 'a', attrs: { id: 'bemjson' } },
          '<div class="a" id="bem"></div>');
      });

      it('bem() mode should override bem from BEMJSON', function() {
        test(function() {
            block('b')({ bem: true });
          },
          { block: 'b', bem: false },
          '<div class="b"></div>');
      });

      it('cls() mode should override cls from BEMJSON', function() {
        test(function() {
            block('b')({ cls: 'v-card' });
          },
          { block: 'b', cls: 'blah-blah' },
          '<div class="b v-card"></div>');
      });

      it('content() mode should override content from BEMJSON', function() {
        test(function() {
            block('b')({ content: 'bem-xjst rules' });
          },
          { block: 'b', content: 'nope' },
          '<div class="b">bem-xjst rules</div>');
      });

      it('elemMods() mode should override elemMods from BEMJSON', function() {
        test(function() {
            block('b').elem('e')({ elemMods: { templ: 'test' } });
          },
          { block: 'b', elem: 'e', elemMods: { bemjson: 'some' } },
          '<div class="b__e b__e_templ_test"></div>');
      });

      it('js() mode should override js from BEMJSON', function() {
        test(function() {
            block('b')({ js: { templ: 'test' } });
          },
          { block: 'b', js: { bemjson: 'some' } },
          '<div class="b i-bem" data-bem=\'{"b":{"templ":"test"}}\'></div>');
      });

      it('mix() mode should override mix from BEMJSON', function() {
        test(function() {
            block('a')({ mix: { block: 'c' } });
          },
          { block: 'a', mix: { block: 'b' } },
          '<div class="a c"></div>');
      });

      it('mods() mode should override mods from BEMJSON', function() {
        test(function() {
            block('b')({ mods: { templ: 'test' } });
          },
          { block: 'b', mods: { bemjson: 'some' } },
          '<div class="b b_templ_test"></div>');
      });

      it('prependContent() mode should prepend content', function() {
        test(function() {
            block('b')({ prependContent: 'pre ' });
          },
          { block: 'b', content: 'content' },
          '<div class="b">pre content</div>');
      });

      it('tag() mode should override tag from BEMJSON', function() {
        test(function() {
            block('reference')({ tag: 'a' });
          },
          { block: 'reference', tag: 'link' },
          '<a class="reference"></a>');
      });
    });

    describe('should not work in chain with "output modes"', function() {

      it('addAttrs() mode', function() {
        test(function() {
            block('b').addAttrs()({
              mix: 'doesnt-work-as-mix-for-block-b'
            });
          },
          { block: 'b', attrs: { 'data-test': 'one-two' } },
          '<div class="b" data-test="one-two" ' +
            'mix="doesnt-work-as-mix-for-block-b"></div>');
      });

      it('addElemMods() mode', function() {
        test(function() {
            block('b').elem('e').addElemMods()({
              mix: 'doesnt-work-as-mix-for-block-b'
            });
          },
          { block: 'b', elem: 'e' },
          '<div class="b__e b__e_mix_doesnt-work-as-mix-for-block-b"></div>');
      });

      it('addJs() mode', function() {
        test(function() {
            block('b').addJs()({
              mix: 'doesnt-work-as-mix-for-block-b'
            });
          },
          { block: 'b' },
          '<div class="b i-bem" data-bem=\'' +
            '{"b":{"mix":"doesnt-work-as-mix-for-block-b"}}\'></div>');
      });

      it('addMix() mode', function() {
        test(function() {
            block('b').addMix()({
              content: 'doesnt-work-as-content-for-block-b'
            });
          },
          { block: 'b' },
          '<div class="b"></div>');
      });

      it('addMods() mode', function() {
        test(function() {
            block('b').addMods()({
              mix: 'doesnt-work-as-mix-for-block-b'
            });
          },
          { block: 'b' },
          '<div class="b b_mix_doesnt-work-as-mix-for-block-b"></div>');
      });

      it('appendContent() mode', function() {
        test(function() {
            block('b').appendContent()({
              block: 'regular-content',
              mix: 'doesnt-work-as-mix-for-block-b'
            });
          },
          { block: 'b', content: 'test' },
          '<div class="b">test' +
            '<div class="regular-content doesnt-work-as-mix-for-block-b">' +
            '</div>' +
          '</div>');
      });

      it('attrs() mode', function() {
        test(function() {
            block('b').attrs()({
              id: 'test',
              mix: 'doesnt-work-as-mix-for-block-b'
            });
          },
          { block: 'b' },
          '<div class="b" id="test" mix="doesnt-work-as-mix-for-block-b">' +
          '</div>');
      });

      it('bem() mode', function() {
        test(function() {
            block('b').bem()({
              content: 'doesnt-work',
              mix: 'doesnt-work'
            });
          },
          { block: 'b' },
          '<div class="b"></div>');
      });

      it('cls() mode', function() {
        test(function() {
            block('b').cls()({
              mix: 'doesnt-work',
              toString: function() { return 'regular-html-class'; }
            });
          },
          { block: 'b' },
          '<div class="b regular-html-class"></div>');
      });

      it('content() mode', function() {
        test(function() {
            block('b').content()({
              block: 'more',
              mix: 'doesnt-work-as-mix-for-block-b'
            });
          },
          { block: 'b' },
          '<div class="b">' +
            '<div class="more doesnt-work-as-mix-for-block-b"></div>' +
          '</div>');
      });

      it('custom user defined mode', function() {
        test(function() {
            block('b').content()({
              any: function() { return 1 + 1; }
            });

            block('b').content()(function() {
              return apply('any');
            });
          },
          { block: 'b' },
          '<div class="b"></div>');
      });

      it('def() mode', function() {
        test(function() {
            block('b').def()({
              mix: 'doesnt-work-as-mix-for-block-b'
            });
          },
          { block: 'b' },
          { mix: 'doesnt-work-as-mix-for-block-b' });
      });

      it('elemMods() mode', function() {
        test(function() {
            block('b').elem('e').elemMods()({
              shortcut: 'doesnt-work',
              mix: 'doesnt-work-as-mix-for-block-b'
            });
          },
          { block: 'b', elem: 'e' },
          '<div class="b__e b__e_shortcut_doesnt-work ' +
          'b__e_mix_doesnt-work-as-mix-for-block-b"></div>');
      });

      it('prependContent() mode', function() {
        test(function() {
            block('b').prependContent()({
              block: 'regular-content',
              mix: 'doesnt-work-as-mix-for-block-b'
            });
          },
          { block: 'b', content: 'test' },
          '<div class="b">' +
            '<div class="regular-content doesnt-work-as-mix-for-block-b">' +
            '</div>' +
          'test</div>');
      });

      it('elemMods() mode', function() {
        test(function() {
            block('b').tag()({
              toString: function() { return 'html'; }
            });
          },
          { block: 'b' },
          '<html class="b"></html>');
      });
    });

    describe('composition tests', function() {
      it('should work in composition', function() {
        test(function() {
            block('button')(
              {
                tag: 'button',
                mix: 'mixed'
              },
              content()('bem-xjst')
            );
          },
          { block: 'button' },
          '<button class="button mixed">bem-xjst</button>');
      });

      it('more complex test', function() {
        test(function() {
            block('button')(
              { attrs: { id: 'from-shortcut' } },
              match(function() { return true; })(
                {
                  tag: 'button',
                  mix: 'mixed'
                },
                content()('bem-xjst')
              )
            );
          },
          { block: 'button' },
          '<button class="button mixed" id="from-shortcut">bem-xjst</button>');
      });
    });

    it('should support body as function', function() {
      test(function() {
          block('b')({
            attrs: function() {
              return { id: 'from-shortcut' };
            },
            content: function() {
              return 42;
            }
          });
        },
        { block: 'b' },
        '<div class="b" id="from-shortcut">42</div>');
    });

    it('should support arguments in body function', function() {
      test(function() {
          block('b')({
            content: function(node, ctx) { return ctx.answer; },
            mix: function(node) { return node.ctx.customMix; }
          });
        },
        { block: 'b', answer: 42, customMix: 'from-shortcut' },
        '<div class="b from-shortcut">42</div>');
    });

    it('should support applyNext() in body function', function() {
      test(function() {
          block('b')(
            content()(function() { return applyNext() + ' 2'; }),
            { content: function() { return applyNext() + ' 3'; } },
            match(function() { return true; })(
              content()(function() { return applyNext() + ' 4'; }),
              { content: function() { return applyNext() + ' 5'; } }
            )
          );
        },
        { block: 'b', content: '1' },
        '<div class="b">1 2 3 4 5</div>');
    });

    it('should support applyCtx() in body function', function() {
      test(function() {
          block('test').def()('OK');
          block('b')(
            { content: function() { return applyCtx({ block: 'test' }); } }
          );
        },
        { block: 'b', content: '1' },
        '<div class="b">OK</div>');
    });
  });
});
