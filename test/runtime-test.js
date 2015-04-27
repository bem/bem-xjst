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
