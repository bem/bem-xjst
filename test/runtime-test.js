var fixtures = require('./fixtures');

var test = fixtures.test;

describe('BEMHTML compiler/Runtime', function() {
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

  it('should support applyNext({ ... })', function() {
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

  it('should not render `undefined`', function () {
    test(function() {
    }, [
      undefined,
      undefined,
      { block: 'b1' },
      undefined
    ], '<div class="b1"></div>');
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

      block('b1').elem('e1').mod('a', 'b').tag('span');
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
      }, '<div class="b1 b2 i-bem" data-bem="{&quot;b1&quot;:{}}"></div>');
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

    it('should support mix in json', function() {
      test(function() {
        block('b1')(
        );
      }, {
        block: 'b1',
        mix: { block: 'b2' }
      }, '<div class="b1 b2"></div>');
    });
  });

  describe('position in Context', function() {
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
});
