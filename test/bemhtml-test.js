var fixtures = require('./fixtures')('bemhtml');
var test = fixtures.test;
var compile = fixtures.compile;

describe('BEMHTML engine tests', function() {
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
    }, { block: 'b1' }, '<div class="b1"><span class="b1__e1">b1</span></div>');
  });

  it('should group properly after elem', function() {
    test(function() {
      block('b1').content()('ok');
      block('b1').elem('css').content()('!');
    }, { block: 'b1' }, '<div class="b1">ok</div>');
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
    }, {
      block: 'page', elem: 'css', url: 'ohai'
    }, '<link rel="stylesheet" href="ohai">');
  });

  it('should support `.xjstOptions()`', function() {
    test(function() {
      block('b1').xjstOptions({ who: 'cares' }).content()(function() {
        return 'ok';
      });
    }, {
      block: 'b1'
    }, '<div class="b1">ok</div>');
  });

  describe('xhtml option', function() {
    it('should close short tags by default', function() {
      compile('')
        .apply({ tag: 'br' })
        .should.equal('<br>');
    });

    it('should not close short tags with xhtml: false', function() {
      compile(function() {}, { xhtml: false })
        .apply({ block: 'b', tag: 'br' })
        .should.equal('<br class="b">');
    });
  });

  describe('omitOptionalEndTags option', function() {
    it('should omit optional end tags with option', function() {
      compile(function() {}, { omitOptionalEndTags: true })
        .apply({ tag: 'p', content: 'test' })
        .should.equal('<p>test');
    });

    it('should’t omit optional end tags without option', function() {
      compile('')
        .apply({ tag: 'p', content: 'test' })
        .should.equal('<p>test</p>');
    });

    it('should’t omit optional end tags with option if tag is mandatory',
      function() {
      compile(function() {}, { omitOptionalEndTags: true })
        .apply({ tag: 'form', content: 'test' })
        .should.equal('<form>test</form>');
    });

    it('should omit optional end tags from templates with option', function() {
      compile(function() { block('para').tag()('p'); },
        { omitOptionalEndTags: true })
        .apply({ block: 'para', content: 'test' })
        .should.equal('<p class="para">test');
    });

    it('should’t omit optional end tags from templates w/o option', function() {
      compile(function() { block('para').tag()('p'); })
        .apply({ block: 'para', content: 'test' })
        .should.equal('<p class="para">test</p>');
    });

    it('should’t omit optional end tags from templates with option ' +
      'if tag is mandatory', function() {
      compile(function() { block('f').tag()('form'); },
      { omitOptionalEndTags: true })
        .apply({ block: 'f', content: 'test' })
        .should.equal('<form class="f">test</form>');
    });
  });

  describe('unquotedAttrs option', function() {
    it('should render class attr w/o quotes if spec allows', function() {
      test(function() {},
        { block: 'b' },
        '<div class=b></div>',
        { unquotedAttrs: true });
    });

    it('should’t render class attr w/o quotes if mix', function() {
      test(function() {},
        { block: 'b', mix: 'mixed' },
        '<div class="b mixed"></div>',
        { unquotedAttrs: true });
    });

    it('should render id attr if spec allows', function() {
      test(function() {},
        { block: 'b', attrs: { id: 'nospace' } },
        '<div class=b id=nospace></div>',
        { unquotedAttrs: true });
    });

    it('should’t render id attr if there is space in value', function() {
      test(function() {},
        { block: 'b', attrs: { id: 'space test' } },
        '<div class=b id="space test"></div>',
        { unquotedAttrs: true });
    });

    it('should render class if there is no space in value', function() {
      test(function() {},
        { block: 'b', bem: false, cls: 'test' },
        '<div class=test></div>',
        { unquotedAttrs: true });
    });
  });
});
