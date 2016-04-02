var fixtures = require('../fixtures')('vidom');

var test = fixtures.test;
var fail = fixtures.fail;

describe('VIDOM compiler/Tree', function() {
  it('should compile example code', function() {
    test(function() {
      block('b1').tag()(
        elem('e1')('a'),
        elem('e2').match(function() {
          return this.ctx.hooray();
        })(function() {
          return apply({ a: 1 });
        })
      );
    },
    { block: 'b1', elem: 'e1' },
    [ 'a', { className: 'b1__e1' } ]);
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
    },
    { block: 'b1' },
    [ 'div', { className: 'b1' },
      [ 'div', { className: 'b1__e1' } ]
     ]);
  });

  it('should replace this.elem properly in hashmaps', function() {
    test(function() {
      block('b1')(
        content()({
          elem: 'e1',
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
    },
    { block: 'b1' },
    [ 'div', { className: 'b1' },
      [ 'span', { className: 'b1__e1' }, 'b1' ]
     ]);
  });

  it('should support block without mode()', function() {
    test(function() {
      block('b1')(function() {
        return applyNext();
      });
    },
    { block: 'b1' },
    [ 'div', { className: 'b1' } ]);
  });

  describe('replace()', function() {
    it('should support basic mode of operation', function () {
      test(function() {
        block('b1').content()('ok');
        block('b2').content()('replaced');
        block('b1').replace()(function () { return { block: 'b2' }; });
      },
      { block: 'b1' },
      [ 'div', { className: 'b2' }, 'replaced' ]);
    });

    it('should have proper `this`', function () {
      test(function() {
        block('b1').content()('ok');
        block('b2').content()('replaced');
        block('b1').replace()(function () { return { block: this.ctx.wtf }; });
      },
      { block: 'b1', wtf: 'b2' },
      [ 'div', { className: 'b2' }, 'replaced' ]);
    });

    it('should work as a singular function', function () {
      test(function() {
        block('b1').content()('ok');
        block('b2').content()('replaced');
        block('b1')(replace()(function () { return { block: 'b2' }; }));
      },
      { block: 'b1' },
      [ 'div', { className: 'b2' }, 'replaced' ]);
    });

    it('should support inline argument', function () {
      test(function() {
        block('b1').content()('ok');
        block('b2').content()('replaced');
        block('b1').replace()({ block: 'b2' });
      },
      { block: 'b1' },
      [ 'div', { className: 'b2' }, 'replaced' ]);
    });
  });

  describe('extend()', function() {
    it('should support basic mode of operation', function () {
      test(function() {
        block('b1').content()('ok');
        block('b1').elem('e').content()('extended');
        block('b1').extend()(function() { return { elem: 'e' }; });
      },
      { block: 'b1' },
      [ 'div', { className: 'b1__e' }, 'extended' ]);
    });

    it('should have proper `this`', function () {
      test(function() {
        block('b1').content()('ok');
        block('b1').elem('e').content()('extended');
        block('b1').extend()(function() { return { elem: this.ctx.wtf }; });
      },
      { block: 'b1', wtf: 'e' },
      [ 'div', { className: 'b1__e' }, 'extended' ]);
    });

    it('should work as a singular function', function () {
      test(function() {
        block('b1').content()('ok');
        block('b1').elem('e').content()('extended');
        block('b1')(extend()(function() { return { elem: 'e' }; }));
      },
      { block: 'b1' },
      [ 'div', { className: 'b1__e' }, 'extended' ]);
    });

    it('should support inline argument', function () {
      test(function() {
        block('b1').content()('ok');
        block('b1').elem('e').content()('extended');
        block('b1').extend()({ elem: 'e' });
      },
      { block: 'b1' },
      [ 'div', { className: 'b1__e' }, 'extended' ]);
    });
  });

  it('should support custom matches', function () {
    test(function() {
      block('b1').content()('!');
      block('b1').match(function() { return this.ctx.test2; }).content()('ok');
      block('b1').match(function() { return this.ctx.test1; }).content()('!');
    },
    { block: 'b1', test2: true },
    [ 'div', { className: 'b1' }, 'ok' ]);
  });

  it('should support mod() match', function () {
    test(function() {
      block('b1').content()('!');
      block('b1').mod('key', 'val').content()('ok');
    },
    { block: 'b1', mods: { key: 'val' } },
    [ 'div', { className: 'b1 b1_key_val' }, 'ok' ]);
  });

  it('should support elemMod() match', function () {
    test(function() {
      block('b1').content()('!');
      block('b1').elem('e1').elemMod('key', 'val').content()('ok');
    },
    { block: 'b1', elem: 'e1', elemMods: { key: 'val' } },
    [ 'div', { className: 'b1__e1 b1__e1_key_val' }, 'ok' ]);
  });

  it('should group properly after elem', function() {
    test(function() {
      block('b1').content()('ok');
      block('b1').elem('css').content()('!');
    },
    { block: 'b1' },
    [ 'div', { className: 'b1' }, 'ok' ]);
  });

  it('should order templates properly', function() {
    test(function() {
      block('page').elem('css')(
        bem()(false),
        tag()('style'),
        match(function() { return this.ctx.url; })(
          tag()('link'),
          attrs()(function() {
            return { rel: 'stylesheet', href: this.ctx.url };
          })
        )
      );
    },
    { block: 'page', elem: 'css', url: 'ohai' },
    [ 'link', { rel: 'stylesheet', href: 'ohai' } ]);
  });

  it('should support oninit', function() {
    test(function() {
      oninit(function(exports) {
        exports.apply = function() {
          return 'ok';
        };
      });
    },
    {},
    'ok');
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
    },
    { block: 'page' },
    [ 'div', { className: 'page' }, 'ok' ]);
  });

  it('should support `.once()`', function() {
    test(function() {
      block('b1').content()(function() {
        return 'second';
      });
      block('b1').once().content()(function() {
        return 'first';
      });
    },
    [
      { block: 'b1' },
      { block: 'b1' }
     ],
    [ 'div', null,
      [ 'div', { className: 'b1' }, 'first' ],
      [ 'div', { className: 'b1' }, 'second' ] ],
    { count: 5 });
  });

  it('should support early `.once()`', function() {
    test(function() {
      block('b1').content()(function() {
        return 'second';
      });
      block('b1').once().match(function() {
        return !this.ctx.early;
      }).content()(function() {
        return 'first';
      });
    },
    [
      { block: 'b1', early: true },
      { block: 'b1' }
     ],
    [ 'div', null,
      [ 'div', { className: 'b1' }, 'second' ],
      [ 'div', { className: 'b1' }, 'first' ] ],
    { count: 5 });
  });

  it('should support `.wrap()`', function() {
    test(function() {
      block('b1').wrap()(function() {
        return {
          block: 'wrap',
          content: this.ctx
        }
      });
    },
    [
      {
        block: 'b1',
        tag: 'a',
        content: {
          block: 'b1',
          tag: 'a'
        }
      }
     ],
    [ 'div', { className: 'wrap' },
      [ 'a', { className: 'b1' },
         [ 'div', { className: 'wrap' },
           [ 'a', { className: 'b1' } ]
          ]
       ]
     ]
    );
  });

  it('should support predicates after `wrap()`', function() {
    test(function() {
      block('b1')(
        wrap().match(function() {
          return this.ctx.key;
        })(function() {
          return {
            block: 'wrap',
            content: this.ctx
          }
        })
      );
    },
    [
      {
        block: 'b1',
        tag: 'a',
        key: 'val'
      }
     ],
    [ 'div', { className: 'wrap' },
      [ 'a', { className: 'b1' } ]
     ]);
  });

  it('should support `.xjstOptions()`', function() {
    test(function() {
      block('b1').xjstOptions({ who: 'cares' }).content()(function() {
        return 'ok';
      });
    },
    { block: 'b1' },
    [ 'div', { className: 'b1' }, 'ok' ]);
  });

  it('should verify match() argument', function() {
    fail(function() {
      block('b1').match('123')('123');
    }, /Wrong.*match.*argument/);
  });

  it('should execute matches in right order', function() {
    test(function() {
      block('bla')(
        tag()('span'),
        // this.ctx.d is undefined
        match(function() { return this.ctx.d; })(
          tag()('a'),
          attrs()(match(function() { return this.ctx.d.a; })(function() {
            // this will throw error
            return { f: 1 };
          }))
        )
      );
    },
    { block: 'bla' },
    [ 'span', { className: 'bla' } ]);
  });

  it('should transform array of strings to string', function() {
    test(function() {
      block('a')(
        content()(function() {
          return [ 'hi', ' there' ];
        })
      );
    },
    { block: 'a' },
    [ 'div', { className: 'a' }, 'hi there' ]);
  });
});
