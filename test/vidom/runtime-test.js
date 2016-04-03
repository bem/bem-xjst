var assert = require('assert');
var fixtures = require('../fixtures')('vidom');
var bemxjst = require('../../').vidom;

var test = fixtures.test;

describe('VIDOM compiler/Runtime', function() {

  // FIXME modify this test to check cases with
  // https://ru.bem.info/libs/bem-components/v2.4.0/desktop/radio-group/
  it('should render many items in content' , function() {
    test(function() {
      block('b1')(
        content()(function() {
          return [
            { block: 'b2' },
            { block: 'b3' }
          ];
        })
      )
    }, { block: 'b1' },
      [ 'div', { className: 'b1' },
        [ 'div', { className: 'b2' } ], [ 'div', { className: 'b3' } ] ]);
  });

  it('should not render ReactElement', function() {
    test(function() {},
      {
        block: 'b1',
        content: [
          { $$typeof: 'xxx' },
          { block: 'b2' },
          { $$typeof: 'yyy' }
        ]
      }, [ 'div', { className: 'b1' },
          { $$typeof: 'xxx' },
          [ 'div', { className: 'b2' } ],
          { $$typeof: 'yyy' } ]);
  });

  it('should render content as array', function() {
    test(function() {},
      { tag: 'section', content: [
        { block: 'b1' },
        { block: 'b2' }
      ] }, [ 'section', null,
        [ 'div', { className: 'b1' } ],
        [ 'div', { className: 'b2' } ] ]);
  });

  xit('should apply("content")', function() {
    test(function() {
      block('b1').def()(function() {
        return applyCtx([ apply('content'), this.ctx.tag ])
      });
    }, { block: 'b1', tag: '1', content: 'hahaha' },
      [ 'div', null, [ 'span', null, 'hahaha' ], [ 'span', null, '1' ] ]);
  });

  it('should render children with different types', function() {
    test(function() {
      block('b1')(
        content()(function() {
          return [
            's1',
            { elem: 'e1', content: 's' },
            's2',
            { elem: 'e2', content: 's' }
           ];
        })
      );
    },
    { block: 'b1' },
    [ 'div', { className: 'b1' },
      's1',
      [ 'div', { className: 'b1__e1' }, 's' ],
      's2',
      [ 'div', { className: 'b1__e2' }, 's' ] ]
    )
  });

  it('should wrap text into container', function() {
    test(function() {},
      [ 'str1', 'str2' ],
      [ 'div', null, [ 'span', null, 'str1' ], [ 'span', null, 'str2' ] ]);
  });

  describe('applyNext()', function() {
    it('should support applyNext()', function() {
      test(function() {
        block('b1').content()(function() {
          return '%' + applyNext() + '%';
        });
        block('b1').content()(function() {
          return '{' + applyNext() + '}';
        });
      },
      { block: 'b1', content: 'ohai' },
      [ 'div', { className: 'b1' }, '{%ohai%}' ]);
    });

    it('should support applyNext({ ... }) with changes', function() {
      test(function() {
        block('b1').content()(function() {
          return '%' + this.wtf + applyNext() + '%';
        });
        block('b1').content()(function() {
          return '{' + applyNext({ wtf: 'no ' }) + '}';
        });
      },
      { block: 'b1', content: 'ohai' },
      [ 'div', { className: 'b1' }, '{%no ohai%}' ]);
    });

    it('should support local', function() {
      test(function() {
        block('b1').content()(function() {
          return local({ tmp: 'b2' })(function() {
            return this.tmp;
          });
        });
      },
      { block: 'b1' },
      [ 'div', { className: 'b1' }, 'b2' ]);
    });

    it('should support visiting higher priority templates', function() {
      test(function() {
        block('b1').content()(function() {
          return applyNext({ wtf: true });
        });

        block('b1').match(function() {
          return this.wtf;
        }).content()('ok');
      },
      { block: 'b1' },
      [ 'div', { className: 'b1' }, 'ok' ]);
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
      },
      { block: 'b1' },
      [ 'div', { className: 'b1' }, 'ok' ]);
    });

    // TODO
    xit('should support recursive applyNext() over block boundary', function() {
      test(function() {
        block('b1').tag()('a');
        block('b1').bem()(false);
        block('b1').def()(function() {
          return '[ ' + applyNext() + ':' + applyNext() + ' ]';
        });
      },
      {
        block: 'b1',
        content: {
          block: 'b1',
          content: {
            block: 'b1',
            content: 'ok'
          }
        }
      },
      // @awinogradov 17.02.2016 - wtf?
      '[ <a>' +
        '[ <a>[<a>ok</a>:<a>ok</a> ]</a>:<a>[<a>ok</a>:<a>ok</a>]</a>]' +
          '</a>:<a>' +
        '[ <a>[<a>ok</a>:<a>ok</a> ]</a>:<a>[<a>ok</a>:<a>ok</a>]</a>]' +
      '</a> ]');
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
      },
      { block: 'b1' },
      [ 'div', { className: 'b1' },
        [ 'div', { className: 'b2' }, 'omg' ],
        [ 'br', { className: 'b3' } ]
       ]);
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
      },
      { block: 'b1' },
      [ 'div', { className: 'b1' },
        [ 'div', { className: 'b2' }, 'ohai' ]
       ]);
    });
  });

  describe('custom modes', function() {
    it('should support custom modes', function () {
      test(function() {
        block('b1').mode('custom')('ok');
        block('b1').content()(function() {
          return apply('custom');
        });
      },
      { block: 'b1' },
      [ 'div', { className: 'b1' }, 'ok' ]);
    });

    it('should support custom modes with changes', function () {
      test(function() {
        block('b1').mode('custom')(function() {
          return this.yikes;
        });
        block('b1').content()(function() {
          return apply('custom', { yikes: 'ok' });
        });
      },
      { block: 'b1' },
      [ 'div', { className: 'b1' }, 'ok' ]);
    });
  });

  it('should not render `undefined`', function () {
    test(function() {
    },
    [
      undefined,
      undefined,
      { block: 'b1' },
      undefined
     ],
    [ 'div', { className: 'b1' } ]);
  });

  it('should assume elem=\'\' is a falsey value', function () {
    test(function() {
      block('b1').elem('e1').def()(function() {
        return applyCtx(this.extend(this.ctx, {
          block: 'b2',
          elem: ''
        }));
      });
    },
    { block: 'b1' },
    [ 'div', { className: 'b1' } ]);
  });

  it('should ignore empty string as modName values', function() {
    test(function() {
    },
    {
      block: 'a',
      mods: { '': 'b' }
    },
    [ 'div', { className: 'a' } ]);
  });

  it('should ignore empty string as elemModName values', function() {
    test(function() {
    },
    {
      block: 'a',
      elem: 'b',
      elemMods: { '': 'c' }
    },
    [ 'div', { className: 'a__b' } ]);
  });

  it('should properly save context while render plain html items', function() {
    test(function() {
    },
    {
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
    },
    [ 'div', { className: 'aaa' },
      [ 'div', { className: 'aaa__xxx1' },
        [ 'div', { className: 'bbb__yyy1' },
          [ 'h1', null, 'h 1' ]
         ]
       ],
      [ 'div', { className: 'aaa__xxx2' } ]
     ]);
  });

  it('should return undefined on failed match', function() {
    test(function() {
      block('b1').content()(function() {
        return { elem: 'e1' };
      });

      block('b1').elem('e1').mod('a', 'b').tag()('span');
    },
    { block: 'b1' },
    [ 'div', { className: 'b1' },
      [ 'div', { className: 'b1__e1' } ]
     ]);
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
    }, { block: 'b1' },
      [ 'div', { className: 'b1' }, [ 'div', { className: 'b2' }, 'ok' ] ]);
  });

  it('should support objects as attrs values', function() {
    test(function() {
      block('b1').attrs()(function() {
        return { prop1: { block: 'b2' } };
      });

      block('b2').replace()('hello');
    }, { block: 'b1' }, [ 'div', { className: 'b1', prop1: 'hello' } ]);
  });

  describe('mods', function() {
    it('should lazily define mods', function() {
      test(function() {
        block('b1').content()(function() {
          return this.mods.a || 'yes';
        });
      }, { block: 'b1' }, [ 'div', { className: 'b1' }, 'yes' ]);
    });

    it('should support changing mods in runtime', function() {
      test(function() {
        block('b1').def()(function() {
          this.mods.a = 'b';
          return applyNext();
        });
      }, {
        block: 'b1'
      }, [ 'div', { className: 'b1 b1_a_b' } ]);
    });

    it('should inherit mods properly', function() {
      test(function() {
        block('b1').content()(function() {
          return { elem: 'e1', tag: 'span' };
        });
      }, {
        block: 'b1',
        mods: { a: 'b' }
      }, [ 'div', { className: 'b1 b1_a_b' },
        [ 'span', { className: 'b1__e1' } ] ]);
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
      }, [ 'div', { className: 'b1' }, [ 'span', { className: 'b1__e1' } ] ]);
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
      }, [ 'div', { className: 'b1 b1_a_b' },
        [ 'span', { className: 'b1__e1' } ] ]);
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
      }, [ 'div', { className: 'b1 b1_a_b' },
        [ 'div', { className: 'b2' }, 'yes' ] ]);
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
      }, [ 'div', { className: 'b1 b1_a_yes' },
        [ 'div', { className: 'b2' } ] ]);
    });

    it('should not treat elemMods as mods', function() {
      test(function() {}, {
        block: 'b1',
        elemMods: { m1: 'v1' }
      }, [ 'div', { className: 'b1' } ]);
    });
  });

  describe('elemMods', function() {
    it('should lazily define elemMods', function() {
      test(function() {
          block('b1').elem('e1').content()(function() {
            return this.elemMods.a || 'yes';
          });
        }, { block: 'b1', content: { elem: 'e1' } },
        [ 'div', { className: 'b1' },
          [ 'div', { className: 'b1__e1' }, 'yes' ] ]);
    });

    it('should take elemMods from BEMJSON', function() {
      test(function() {
        block('b1').elem('e1').content()(function() {
          return this.elemMods.a || 'no';
        });
      }, {
        block: 'b1',
        content: {
          elem: 'e1',
          elemMods: { a: 'yes' }
        }
      }, [ 'div', { className: 'b1' },
        [ 'div', { className: 'b1__e1 b1__e1_a_yes' }, 'yes' ] ]);
    });

    it('should restore elemMods', function() {
      test(function() {
        block('b2').elem('e1').content()(function() {
          return this.elemMods.a || 'yes';
        });
      }, {
        block: 'b1',
        content: {
          elem: 'e1',
          elemMods: {
            a: 'no'
          },
          content: {
            block: 'b2',
            elem: 'e1'
          }
        }

      }, [ 'div', { className: 'b1' },
        [ 'div', { className: 'b1__e1 b1__e1_a_no' },
          [ 'div', { className: 'b2__e1' }, 'yes' ] ] ]);
    });

    it('should not treat mods as elemMods', function() {
      test(function() {}, {
        block: 'b1',
        content: {
          elem: 'e1',
          mods: { m1: 'v1' }
        }
      }, [ 'div', { className: 'b1' }, [ 'div', { className: 'b1__e1' } ] ]);
    });

    it('should not treat mods as elemMods even if block exist', function() {
      test(function() {}, {
        block: 'b1',
        content: {
          block: 'b1',
          elem: 'e1',
          mods: { m1: 'v1' }
        }
      }, [ 'div', { className: 'b1' }, [ 'div', { className: 'b1__e1' } ] ]);
    });

    it('should not treat mods as elemMods in mixes', function() {
      test(function() {}, {
        block: 'b1',
        mix: {
          elem: 'e1',
          mods: { m1: 'v1' }
        }
      }, [ 'div', { className: 'b1 b1__e1' } ]);
    });

    it('should support changing elemMods in runtime', function() {
      test(function() {
        block('b1').elem('e1').def()(function() {
          this.elemMods.a = 'b';
          return applyNext();
        });
      }, {
        block: 'b1',
        elem: 'e1'
      }, [ 'div', { className: 'b1__e1 b1__e1_a_b' } ]);
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
      }, { block: 'b1' }, [ 'a', { className: 'b1 b2 b2_modname_modval' } ]);
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
      }, [ 'a', {
        className:
          'b1 b1_x_10 b2 b2_modname_modval b3__e3 b3__e3_modname_1' } ]);
    });

    it('should skip mix items if falsy', function() {
      test(function() {
      }, {
        block: 'b1',
        mix: [ null, '', false, undefined, 0, { block: 'b2' } ]
      }, [ 'div', { className: 'b1 b2' } ]);
    });

    it('should support singular mix', function() {
      test(function() {
        block('b1')(
          mix()({ block: 'b2' })
        );
      }, {
        block: 'b1'
      }, [ 'div', { className: 'b1 b2' } ]);
    });

    it('should support string mix', function() {
      test(function() {
        block('b1')(
          mix()('b2')
        );
      }, {
        block: 'b1'
      }, [ 'div', { className: 'b1 b2' } ]);
    });

    it('should support `undefined` mix', function() {
      test(function() {
        block('b1')(
          mix()(undefined)
        );
      }, {
        block: 'b1'
      }, [ 'div', { className: 'b1' } ]);
    });

    it('should support mix in json', function() {
      test(function() {
        block('b1')(
        );
      }, {
        block: 'b1',
        mix: { block: 'b2' }
      }, [ 'div', { className: 'b1 b2' } ]);
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
      }, [ 'div', { className: 'b1__e1 b2 b3' } ]);
    });

    it('should mix with block itself', function() {
      test(function() {
      }, {
        block: 'b1',
        elem: 'e1',
        mix: { block: 'b1' }
      }, [ 'div', { className: 'b1__e1 b1' } ]);
    });
  });

  describe('Context', function() {
    it('should have proper this.position', function() {
      test(function() {
        block('b1').content()(function() { return this.position; });
      }, [
        { block: 'b1' },
        { block: 'b1' },
        '',
        { block: 'b1' },
        {
          tag: 'div',
          content: 'blah'
        },
        { block: 'b1' }
       ], [ 'div', null ,
        [ 'div', { className: 'b1' }, '1' ],
        [ 'div', { className: 'b1' }, '2' ],
        [ 'div', { className: 'b1' }, '3' ],
        [ 'div', null, 'blah' ],
        [ 'div', { className: 'b1' }, '4' ] ]);
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
      }, [ 'div', { className: 'b1' }, 'hah' ]);
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
      }, [ 'div', { className: 'b1' }, 'hah' ]);
    });

    it('should support `.getLast()`', function() {
      test(function() {
        block('b1')(
          match(function() { return this.isLast(); })
            .mix()({ mods: { position: 'last' } })
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
       ], [ 'div', null,
          [ 'table', null,
            [ 'tr', { className: 'b1' },
              [ 'td', null ],
              [ 'td', null ]
             ]
           ],
          [ 'div', { className: 'b1' }, 'first' ],
          [ 'div', { className: 'b1 b1_position_last' }, 'last' ]
         ]);
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
        var arr = template.apply([ { block: 'b1' }, sep, { block: 'b1' } ]);

        assert.notEqual(arr[ 0 ], arr[1]);
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

        assert.equal(arr[ 0 ], arr[1]);
      });
    });
  });

  describe('attrs in BEMJSON', function() {
    it('should render with block', function () {
      test(function() {},
        { block: 'b1', attrs: { a: 'b' } },
        [ 'div', { className: 'b1', a: 'b' } ]);
    });

    it('should render with just tag', function () {
      test(function() {},
        { tag: 'span', attrs: { a: 'b' } },
        [ 'span', { a: 'b' } ]);
    });

    it('should properly render undefined as attrs value', function () {
      test(function() {},
        { attrs: { name: undefined } },
        [ 'div', null ]);
    });

    it('should properly render zero as attrs value', function () {
      test(function() {},
        { attrs: { test: 0 } },
        [ 'div', { test: '0' } ]);
    });

    it('should properly render empty string as attrs value', function () {
      test(function() {},
        { attrs: { test: '' } },
        [ 'div', { test: '' } ]);
    });

    it('should properly render false as attrs value', function () {
      test(
        function() {},
        { attrs: { disabled: false } },
        [ 'div', null ]);
    });

    it('should properly render true as attrs value', function () {
      test(function() {},
        { attrs: { disabled: true } },
        [ 'div', { disabled: 'true' } ]);
    });

    it('should properly render null as attrs value', function () {
      test(function() {},
        { attrs: { value: null } },
        [ 'div', null ]);
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
       ], [ 'div', { className: 'b1' },
        [ 'span', null, [ 'div', { className: 'b2' } ] ] ]);
    });

    it('should inherit block from the parent, and reset it back', function () {
      test(function() {
      }, {
        block: 'b2',
        content: [
          { block: 'b1', content: { elem: 'e1' } },
          { elem: 'e1' }
         ]
      }, [ 'div', { className: 'b2' },
          [ 'div', { className: 'b1' },
            [ 'div', { className: 'b1__e1' } ] ],
          [ 'div', { className: 'b2__e1' } ] ]);
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
       ], [ 'div', { className: 'b1' },
          [ 'div', { className: 'b1__e1' },
            [ 'span', null,
              [ 'div', { className: 'b2' } ] ] ] ]);
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
       ], [ 'div', { className: 'b1' },
          [ 'span', null,
            [ 'div', { className: 'b1__e1' } ] ] ]);
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
      } ], [ 'div', null,
            [ 'div', { className: 'b1' }, '#ok#' ],
            [ 'div', { className: 'b2' }, '#yes#' ],
            [ 'div', { className: 'b3' }, '#ya#' ] ]);
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
      } ], [ 'div', null,
            [ 'div', { className: 'b1' }, 'block' ],
            [ 'div', { className: 'b1__a' }, '%block-a%' ],
            [ 'div', { className: 'b3__b' }, '%ok%' ] ]);
    });
  });

  describe('adding templates at runtime', function() {
    it('should work', function() {
      var template = bemxjst.compile();

      assert.deepEqual(template.apply(
        { block: 'b1' }), [ 'div', { className: 'b1' } ]);

      template.compile(function() {
        block('b1').content()('ok');
      });

      assert.deepEqual(template.apply(
        { block: 'b1' }), [ 'div', { className: 'b1' }, 'ok' ]);
      assert.deepEqual(template.apply(
        { block: 'b2' }), [ 'div', { className: 'b2' } ]);

      template.compile(function() {
        block('b2').content()('ok');
      });

      assert.deepEqual(template.apply(
        { block: 'b1' }), [ 'div', { className: 'b1' }, 'ok' ]);
      assert.deepEqual(template.apply(
        { block: 'b2' }), [ 'div', { className: 'b2' }, 'ok' ]);

      template.compile(function() {
        block('b1').tag()('a');
      });

      assert.deepEqual(template.apply(
        { block: 'b1' }), [ 'a', { className: 'b1' }, 'ok' ]);
      assert.deepEqual(template.apply(
        { block: 'b2' }), [ 'div', { className: 'b2' }, 'ok' ]);
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
    }, 0, [ 'span', null, '0' ]);
  });

  describe('naming', function() {
    it('should support custom naming', function() {
      test(function() {},
        [ {
          block: 'b1',
          elem: 'e1',
          elemMods: {
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
       ], [ 'div', null,
          [ 'div', { className: 'b1$$e1 b1$$e1@@a@@b' } ],
          [ 'div', { className: 'b1$$e1' } ],
          [ 'div', { className: 'b1 b1$$e2' } ] ],
        {
          naming: {
            elem: '$$',
            mod: '@@'
          }
        }
      );
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
