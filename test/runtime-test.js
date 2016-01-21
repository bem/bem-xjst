var assert = require('assert');
var fixtures = require('./fixtures');
var bemxjst = require('../');

var test = fixtures.test;

describe('BEMHTML compiler/Runtime', function() {
  describe('applyNext()', function() {
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

    it('should support applyNext({ ... }) with changes', function() {
      test(function() {
        block('b1').content()(function() {
          return '%' + this.wtf + applyNext() + '%';
        });
        block('b1').content()(function() {
          return '{' + applyNext({ wtf: 'no ' }) + '}';
        });
      }, { block: 'b1', content: 'ohai' }, '<div class="b1">{%no ohai%}</div>');
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

    it('should support visiting higher priority templates', function() {
      test(function() {
        block('b1').content()(function() {
          return applyNext({ wtf: true });
        });

        block('b1').match(function() {
          return this.wtf;
        }).content()('ok');
      }, { block: 'b1' }, '<div class="b1">ok</div>');
    });

    it('should support > 31 templates (because of the bit mask)', function() {
      test(function() {
        block('b1').content()(function() {
          return 'ok';
        });
        for (var i = 0; i < 128; i++) {
          block('b1').content()(function() {
            return applyNext();
          });
        }
      }, { block: 'b1' }, '<div class="b1">ok</div>');
    });

    it('should support recursive applyNext() over block boundary', function() {
      test(function() {
        block('b1').tag()('a');
        block('b1').bem()(false);
        block('b1').def()(function() {
          return '[' + applyNext() + ':' + applyNext() + ']';
        });
      }, {
        block: 'b1',
        content: {
          block: 'b1',
          content: {
            block: 'b1',
            content: 'ok'
          }
        }
      }, '[<a>' +
         '[<a>[<a>ok</a>:<a>ok</a>]</a>:<a>[<a>ok</a>:<a>ok</a>]</a>]' +
         '</a>:<a>' +
         '[<a>[<a>ok</a>:<a>ok</a>]</a>:<a>[<a>ok</a>:<a>ok</a>]</a>]' +
         '</a>]');
    });
  });

  describe('applyCtx()', function() {
    it('should work with just context', function() {
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

    it('should work with both context and changes', function() {
      test(function() {
        block('b2').content()(function() {
          return this.wtf;
        });

        block('b1').content()(function() {
          return applyCtx([
            { block: 'b2' }
          ], { wtf: 'ohai' });
        });
      }, {
        block: 'b1'
      }, '<div class="b1"><div class="b2">ohai</div></div>');
    });
  });

  describe('custom modes', function() {
    it('should support custom modes', function () {
      test(function() {
        block('b1').mode('custom')('ok');
        block('b1').content()(function() {
          return apply('custom');
        });
      }, {
        block: 'b1'
      }, '<div class="b1">ok</div>')
    });

    it('should support custom modes with changes', function () {
      test(function() {
        block('b1').mode('custom')(function() {
          return this.yikes;
        });
        block('b1').content()(function() {
          return apply('custom', { yikes: 'ok' });
        });
      }, {
        block: 'b1'
      }, '<div class="b1">ok</div>')
    });
  });

  it('should not render `undefined`', function () {
    test(function() {
    }, [
      undefined,
      undefined,
      { block: 'b1' },
      undefined
    ], '<div class="b1"></div>');
  });

  it('should assume elem=\'\' is a falsey value', function () {
    test(function() {
      block('b1').elem('e1').def()(function() {
        return applyCtx(this.extend(this.ctx, {
          block: 'b2',
          elem: ''
        }));
      });
    }, { block: 'b1' }, '<div class="b1"></div>');
  });

  it('should properly save context while render plain html items', function() {
    test(function() {
    }, {
      block: 'aaa',
      content: [
        {
          elem: 'xxx1',
          content: {
            block: 'bbb',
            elem: 'yyy1',
            content: { tag: 'h1', content: 'h 1' }
          }
        },
        {
          elem: 'xxx2'
        }
      ]
    }, '<div class="aaa">' +
           '<div class="aaa__xxx1">' +
               '<div class="bbb__yyy1">' +
                   '<h1>h 1</h1>' +
               '</div>' +
           '</div>' +
           '<div class="aaa__xxx2"></div>' +
       '</div>');
  });

  it('should render without tag', function() {
    test(function() {
    }, { tag: false, content: 'ok' }, 'ok');
  });

  it('should return undefined on failed match', function() {
    test(function() {
      block('b1').content()(function() {
        return { elem: 'e1' };
      });

      block('b1').elem('e1').mod('a', 'b').tag()('span');
    }, { block: 'b1' }, '<div class="b1"><div class="b1__e1"></div></div>');
  });

  it('should support this.reapply()', function() {
    test(function() {
      block('b1').content()(function() {
        this.wtf = 'fail';
        return this.reapply({ block: 'b2' });
      });

      block('b2').content()(function() {
        return this.wtf || 'ok';
      });
    }, { block: 'b1' }, '<div class="b1"><div class="b2">ok</div></div>');
  });

  it('should support objects as attrs values', function() {
    test(function() {
      block('b1').attrs()(function() {
        return { prop1: { block: 'b2' } };
      });

      block('b2').replace()('hello');
    }, { block: 'b1' }, '<div class="b1" prop1="hello"></div>');
  });

  describe('mods', function() {
    it('should lazily define mods', function() {
      test(function() {
        block('b1').content()(function() {
          return this.mods.a || 'yes';
        });
      }, { block: 'b1' }, '<div class="b1">yes</div>');
    });

    it('should support changing mods in runtime', function() {
      test(function() {
        block('b1').def()(function() {
          this.mods.a = 'b';
          return applyNext();
        });
      }, {
        block: 'b1'
      }, '<div class="b1 b1_a_b"></div>');
    });

    it('should inherit mods properly', function() {
      test(function() {
        block('b1').content()(function() {
          return { elem: 'e1', tag: 'span' };
        });
      }, {
        block: 'b1',
        mods: { a: 'b' }
      }, '<div class="b1 b1_a_b"><span class="b1__e1"></span></div>');
    });

    it('should match on changed mods', function() {
      test(function() {
        block('b1').content()(function() {
          return { elem: 'e1' };
        });

        block('b1').elem('e1').mod('a', 'b').tag()('span');
        block('b1').elem('e1').def()(function() {
          return local({ 'mods.a': 'b' })(function() {
            return applyNext();
          });
        });
      }, {
        block: 'b1'
      }, '<div class="b1"><span class="b1__e1"></span></div>');
    });

    it('should propagate parent mods to matcher', function() {
      test(function() {
        block('b1').content()(function() {
          return { elem: 'e1' };
        });

        block('b1').elem('e1').mod('a', 'b').tag()('span');
      }, {
        block: 'b1',
        mods: { a: 'b' }
      }, '<div class="b1 b1_a_b"><span class="b1__e1"></span></div>');
    });

    it('should restore mods', function() {
      test(function() {
        block('b2').content()(function() {
          return this.mods.a || 'yes';
        });
      }, {
        block: 'b1',
        mods: { a: 'b' },
        content: {
          block: 'b2'
        }
      }, '<div class="b1 b1_a_b"><div class="b2">yes</div></div>');
    });

    it('should lazily override mods without propagating them', function() {
      test(function() {
        block('b1').def()(function() {
          return applyNext({ 'mods.a': 'yes' });
        });
      }, {
        block: 'b1',
        content: {
          block: 'b2'
        }
      }, '<div class="b1 b1_a_yes"><div class="b2"></div></div>');
    });
  });

  describe('elemMods', function() {
    it('should lazily define elemMods', function() {
      test(function() {
        block('b1').content()(function() {
          return this.elemMods.a || 'yes';
        });
      }, { block: 'b1' }, '<div class="b1">yes</div>');
    });

    it('should take elemMods from BEMJSON', function() {
      test(function() {
        block('b1').content()(function() {
          return this.elemMods.a || 'no';
        });
      }, {
        block: 'b1',
        elemMods: {
          a: 'yes'
        }
      }, '<div class="b1 b1_a_yes">yes</div>');
    });

    it('should restore elemMods', function() {
      test(function() {
        block('b2').content()(function() {
          return this.elemMods.a || 'yes';
        });
      }, {
        block: 'b1',
        elemMods: {
          a: 'yes'
        },
        content: {
          block: 'b2'
        }
      }, '<div class="b1 b1_a_yes"><div class="b2">yes</div></div>');
    });
  });

  describe('mix', function() {
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
          elem('e3').mix()([ { mods: { modname: 1 } } ])
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

    it('should support mix in json', function() {
      test(function() {
        block('b1')(
        );
      }, {
        block: 'b1',
        mix: { block: 'b2' }
      }, '<div class="b1 b2"></div>');
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

    it('should mix with block itself', function() {
      test(function() {
      }, {
        block: 'b1',
        elem: 'e1',
        mix: { block: 'b1' }
      }, '<div class="b1__e1 b1"></div>');
    });

    it('should not propagate parent elem to JS params', function() {
      test(function() {
      }, {
        block: 'b1',
        elem: 'e1',
        mix: { block: 'b2', js: true }
      }, '<div class="b1__e1 b2 i-bem" data-bem=\'{"b2":{}}\'></div>');
    });
  });

  describe('Context', function() {
    it('should have proper this.position', function() {
      test(function() {
        block('b1').content()(function() { return this.position; });
      }, [
        { block: 'b1' },
        { block: 'b1' },
        { block: 'b1' },
        { block: 'b1' }
      ], '<div class="b1">1</div>' +
         '<div class="b1">2</div>' +
         '<div class="b1">3</div>' +
         '<div class="b1">4</div>');
    });

    it('should support changing prototype of BEMContext', function () {
      test(function() {
        oninit(function(exports) {
          exports.BEMContext.prototype.yes = 'hah';
        });

        block('b1').content()(function() {
          return this.yes;
        });
      }, {
        block: 'b1'
      }, '<div class="b1">hah</div>');
    });

    it('should put BEMContext to sharedContext too', function () {
      test(function() {
        oninit(function(exports, shared) {
          shared.BEMContext.prototype.yes = 'hah';
        });

        block('b1').content()(function() {
          return this.yes;
        });
      }, {
        block: 'b1'
      }, '<div class="b1">hah</div>');
    });

    it('should support flushing', function () {
      test(function() {
        oninit(function(exports) {
          exports.BEMContext.prototype._flushIndex = 0;
          exports.BEMContext.prototype._flush = function flush(str) {
            return '[' + (this._flushIndex++) + '.' + str + ']';
          };
        });
      }, {
        block: 'b1',
        content: {
          block: 'b2'
        }
      }, '[4.[3.[0.<div class="b1">][2.[1.<div class="b2">]</div>]</div>]]');
    });

    it('should not flush custom def() bodies', function() {
      test(function() {
        block('b2').def()(function() {
          return 'before' + applyNext() + 'after';
        });

        block('*').tag()('a');
      }, {
        block: 'b1',
        content: [ {
          block: 'b2',
          content: {
            block: 'b3'
          }
        }, {
          block: 'b4',
          content: 'ending'
        } ]
      }, '', {
        flush: true,
        after: function after(template) {
          assert.deepEqual(template._buf, [
            '<a class="b1">',
            'before<a class="b2"><a class="b3"></a></a>after',
            '<a class="b4">',
            'ending</a>',
            '</a>'
          ]);
        }
      });
    });

    it('should still flush top level with def() override', function() {
      test(function() {
        block('b2').def()(function() {
          return 'before' + applyNext() + 'after';
        });

        block('*').tag()('a');
      }, {
        block: 'b2',
        content: {
          block: 'b3'
        }
      }, '', {
        flush: true,
        after: function after(template) {
          assert.deepEqual(template._buf, [
            'before<a class="b2"><a class="b3"></a></a>after'
          ]);
        }
      });
    });

    it('should not flush custom def() with `.xjstOptions({ flush: true })',
       function () {
      test(function() {
        block('b2').def().xjstOptions({ flush: true })(function() {
          return applyCtx({ block: 'b1' });
        });

        block('*').tag()('a');
      }, {
        block: 'b2'
      }, '', {
        flush: true,
        after: function after(template) {
          assert.deepEqual(template._buf, [
            '<a class="b1">',
            '</a>'
          ]);
        }
      });
    });

    it('should support `.getLast()`', function() {
      test(function() {
        block('b1')(
          match(function() { return this.isLast(); })
          .mix()({ elemMods: { position: 'last' } })
        );
      }, [
        {
          tag: 'table',
          content: {
            block: 'b1',
            tag: 'tr',
            content: [
              { content: '', tag: 'td' },
              { content: '', tag: 'td' }
            ]
          }
        },
        {
          block: 'b1',
          content: 'first'
        },
        {
          block: 'b1',
          content: 'last'
        }
      ], '<table><tr class="b1"><td></td><td></td></tr></table>' +
         '<div class="b1">first</div>' +
         '<div class="b1 b1_position_last">last</div>');
    });

    describe('generateId', function() {
      var template;

      beforeEach(function() {
        template = bemxjst.compile(function() {
          block('b1')(
            tag()(''),
            content()(function() {
              return this.generateId();
            })
          )
        });
      });

      it('starts with uniq', function() {
        var str = template.apply({ block: 'b1' });
        assert(str.indexOf('uniq') === 0);
      });

      it('should be unique in different applies', function() {
        assert.notEqual(
          template.apply({ block: 'b1' }),
          template.apply({ block: 'b1' })
        );
      });

      it('should be unique in one apply', function() {
        var sep = '❄';
        var str = template.apply([ { block: 'b1' }, sep, { block: 'b1' } ]);
        var arr = str.split(sep);

        assert.notEqual(arr[0], arr[1]);
      });

      it('should be equal for same ctx', function() {
        var sep = '❄';
        var template = bemxjst.compile(function() {
          var sep = '❄';
          block('b2')(
            tag()(''),
            content()(function() {
              return [ this.generateId(), sep, this.generateId() ];
            })
          )
        });
        var str = template.apply({ block: 'b2' });
        var arr = str.split(sep);

        assert.equal(arr[0], arr[1]);
      });
    });
  });

  describe('attrs in BEMJSON', function() {
    it('should render with block', function () {
      test(function() {
      }, { block: 'b1', attrs: { a: 'b' } }, '<div class="b1" a="b"></div>');
    });

    it('should render with just tag', function () {
      test(function() {
      }, { tag: 'span', attrs: { a: 'b' } }, '<span a="b"></span>');
    });

    it('should properly render undefined as attrs value', function () {
      test(function() {
      }, { attrs: { name: undefined } },
      '<div></div>');
    });

    it('should properly render zero as attrs value', function () {
      test(function() {
      }, { attrs: { test: 0 } },
      '<div test="0"></div>');
    });

    it('should properly render empty string as attrs value', function () {
      test(function() {
      }, { attrs: { test: '' } },
      '<div test=""></div>');
    });

    it('should properly render false as attrs value', function () {
      test(function() {
      }, { attrs: { disabled: false } },
      '<div></div>');
    });

    it('should properly render true as attrs value', function () {
      test(function() {
      }, { attrs: { disabled: true } },
      '<div disabled></div>');
    });

    it('should properly render null as attrs value', function () {
      test(function() {
      }, { attrs: { value: null } }, '<div></div>');
    });
  });

  describe('preserve/reset block/elem/mods', function() {
    it('should not preserve block on tag', function () {
      test(function() {
      }, [
        {
          block: 'b1',
          content: {
            tag: 'span',
            content: {
              block: 'b2'
            }
          }
        }
      ], '<div class="b1"><span><div class="b2"></div></span></div>');
    });

    it('should inherit block from the parent, and reset it back', function () {
      test(function() {
      }, {
        block: 'b2',
        content: [
          { block: 'b1', content: { elem: 'e1' } },
          { elem: 'e1' }
        ]
      }, '<div class="b2"><div class="b1"><div class="b1__e1"></div></div>' +
         '<div class="b2__e1"></div></div>');
    });

    it('should not preserve block/elem on tag', function () {
      test(function() {
      }, [
        {
          block: 'b1',
          content: {
            elem: 'e1',
            content: {
              tag: 'span',
              content: {
                block: 'b2'
              }
            }
          }
        }
      ], '<div class="b1"><div class="b1__e1"><span><div class="b2">' +
         '</div></span></div></div>');
    });

    it('should preserve block on next BEM entity', function () {
      test(function() {
      }, [
        {
          block: 'b1',
          content: {
            tag: 'span',
            content: {
              elem: 'e1'
            }
          }
        }
      ], '<div class="b1"><span><div class="b1__e1"></div></span></div>');
    });
  });

  describe('wildcard block', function() {
    it('should be called before the matched templates', function () {
      test(function() {
        block('b1').content()(function() {
          return 'ok';
        });
        block('b2').content()(function() {
          return 'yes';
        });
        block('*').content()(function() {
          return '#' + applyNext() + '#';
        });
      }, [ {
        block: 'b1'
      }, {
        block: 'b2'
      }, {
        block: 'b3',
        content: 'ya'
      } ], '<div class="b1">#ok#</div>' +
           '<div class="b2">#yes#</div>' +
           '<div class="b3">#ya#</div>');
    });
  });

  describe('elem', function() {
    it('should ignore empty string as modName values', function() {
      test(function() {
      }, { block: 'a', mods: { '': 'b' } },
      '<div class="a"></div>');
    });

    it('should ignore empty string as elemModName values', function() {
      test(function() {
      }, { block: 'a', elem: 'b', elemMods: { '': 'c' } },
      '<div class="a__b"></div>');
    });
  });

  describe('wildcard elem', function() {
    it('should be called before the matched templates', function () {
      test(function() {
        block('b1').content()(function() {
          return 'block';
        });
        block('b1').elem('a').content()(function() {
          return 'block-a';
        });
        block('b1').elem('*').content()(function() {
          return '%' + applyNext() + '%';
        });
      }, [ {
        block: 'b1'
      }, {
        block: 'b1',
        elem: 'a'
      }, {
        block: 'b3',
        elem: 'b',
        content: 'ok'
      } ], '<div class="b1">block</div>' +
           '<div class="b1__a">%block-a%</div>' +
           '<div class="b3__b">%ok%</div>');
    });
  });

  describe('adding templates at runtime', function() {
    it('should work', function() {
      var template = bemxjst.compile();

      assert.equal(template.apply({ block: 'b1' }), '<div class="b1"></div>');

      template.compile(function() {
        block('b1').content()('ok');
      });

      assert.equal(template.apply({ block: 'b1' }), '<div class="b1">ok</div>');
      assert.equal(template.apply({ block: 'b2' }), '<div class="b2"></div>');

      template.compile(function() {
        block('b2').content()('ok');
      });

      assert.equal(template.apply({ block: 'b1' }), '<div class="b1">ok</div>');
      assert.equal(template.apply({ block: 'b2' }), '<div class="b2">ok</div>');

      template.compile(function() {
        block('b1').tag()('a');
      });

      assert.equal(template.apply({ block: 'b1' }), '<a class="b1">ok</a>');
      assert.equal(template.apply({ block: 'b2' }), '<div class="b2">ok</div>');
    });
  });

  it('should work with empty input', function() {
    test(function() {
    }, '', '');
  });

  it('should work with null input', function() {
    test(function() {
    }, null, '');
  });

  it('should work with 0 input', function() {
    test(function() {
    }, 0, '0');
  });

  describe('naming', function() {
    it('should support custom naming', function() {
      test(function() {
      }, [
        {
          block: 'b1',
          elem: 'e1',
          mods: {
            a: 'b'
          }
        },
        {
          block: 'b1',
          elem: 'e1'
        },
        {
          block: 'b1',
          mix: { elem: 'e2' }
        }
      ], '<div class="b1$$e1 b1$$e1@@a@@b"></div>' +
         '<div class="b1$$e1"></div>' +
         '<div class="b1 b1$$e2"></div>', {
        naming: {
          elem: '$$',
          mod: '@@'
        }
      });
    });
  });

  describe('Match', function() {
    var bemjson = {
      block: 'b1',
      mods: {
        foo: 'bar'
      },
      prop: true
    };

    var template;

    beforeEach(function() {
      template = bemxjst.compile(function() {
        block('b1').tag()('span');
        block('b1').mod('foo', 'bar')(
          attrs()(function() {
            var attrs = applyNext();
            attrs.foo = 'bar';
            return attrs;
          })
        );
      });
    });

    it('should throw error with one apply', function() {
      assert.throws(function() {
        template.apply(bemjson);
      });
    });

    it('should throw error when args passed to def mode', function() {
      assert.throws(function() {
        bemxjst.compile(function() {
          block('b1').def('blah');
        });
      });
    });

    it('should throw error when args passed to attrs mode', function() {
      assert.throws(function() {
        bemxjst.compile(function() {
          block('b1').attrs('blah');
        });
      });
    });

    it('should throw error when args passed to cls mode', function() {
      assert.throws(function() {
        bemxjst.compile(function() {
          block('b1').cls('blah');
        });
      });
    });

    it('should throw error when args passed to js mode', function() {
      assert.throws(function() {
        bemxjst.compile(function() {
          block('b1').js('blah');
        });
      });
    });

    it('should throw error when args passed to jsAttr mode', function() {
      assert.throws(function() {
        bemxjst.compile(function() {
          block('b1').jsAttr('blah');
        });
      });
    });

    it('should throw error when args passed to bem mode', function() {
      assert.throws(function() {
        bemxjst.compile(function() {
          block('b1').bem('blah');
        });
      });
    });

    it('should throw error when args passed to replace mode', function() {
      assert.throws(function() {
        bemxjst.compile(function() {
          block('b1').replace('blah');
        });
      });
    });

    it('should throw error when args passed to extend mode', function() {
      assert.throws(function() {
        bemxjst.compile(function() {
          block('b1').extend('blah');
        });
      });
    });

    it('should throw error when args passed to wrap mode', function() {
      assert.throws(function() {
        bemxjst.compile(function() {
          block('b1').wrap('blah');
        });
      });
    });

    it('should throw error when args passed to once mode', function() {
      assert.throws(function() {
        bemxjst.compile(function() {
          block('b1').once('blah');
        });
      });
    });

    it('should throw error when args passed to content mode', function() {
      assert.throws(function() {
        bemxjst.compile(function() {
          block('b1').content('blah');
        });
      });
    });

    it('should throw error when args passed to mix mode', function() {
      assert.throws(function() {
        bemxjst.compile(function() {
          block('b1').mix([
            { block: 'b2' }
          ]);
        });
      });
    });

    it('should throw error when args passed to tag mode', function() {
      assert.throws(function() {
        bemxjst.compile(function() {
          block('b1').tag('span');
        });
      });
    });

    it('should throw errors with many applies', function() {
      assert.throws(function() {
        template.apply(bemjson);
      });
      assert.throws(function() {
        template.apply(bemjson);
      });
    });
  });
});
