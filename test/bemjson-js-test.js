var fixtures = require('./fixtures')('bemhtml');
var compile = fixtures.compile;

describe('BEMJSON js', function() {
  it('should not return undefined as js value', function() {
    compile('')
      .apply({ block: 'b', js: undefined })
      .should.equal('<div class="b"></div>');
  });

  it('should not return null as js value', function() {
    compile('')
      .apply({ block: 'b', js: null })
      .should.equal('<div class="b"></div>');
  });

  it('should return Number as js value', function() {
    compile('')
      .apply({ block: 'b', js: -100 })
      .should.equal('<div class="b i-bem" data-bem=\'{"b":-100}\'></div>');
  });

  it('should not return zero as js value', function() {
    compile('')
      .apply({ block: 'b', js: 0 })
      .should.equal('<div class="b"></div>');
  });

  it('should not return NaN as js value', function() {
    compile('')
      .apply({ block: 'b', js: NaN })
      .should.equal('<div class="b"></div>');
  });

  it('should return String as js value', function() {
    compile('')
      .apply({ block: 'b', js: 'jsval' })
      .should.equal('<div class="b i-bem" data-bem=\'{"b":"jsval"}\'></div>');
  });

  it('should not return empty string as js value', function() {
    compile('')
      .apply({ block: 'b', js: '' })
      .should.equal('<div class="b"></div>');
  });

  it('should return true as js value', function() {
    compile('')
      .apply({ block: 'b', js: true })
      .should.equal('<div class="b i-bem" data-bem=\'{"b":{}}\'></div>');
  });

  it('should not return false as js value', function() {
    compile('')
      .apply({ block: 'b', js: false })
      .should.equal('<div class="b"></div>');
  });

  it('should return Array as js value', function() {
    compile('')
      .apply({ block: 'b', js: [] })
      .should.equal('<div class="b i-bem" data-bem=\'{"b":[]}\'></div>');
  });

  it('should return Object as js value', function() {
    compile('')
      .apply({ block: 'button', js: { a: 1, b: 2 } })
      .should.equal('<div class="button i-bem" data-bem=\'{"button":{"a":1,' +
        '"b":2}}\'></div>');
  });

  it('should escape js values', function() {
    compile('')
      .apply({ block: 'b', js: { a: '\'Sid&Nancy\'', b: '\'Tom&Jerry\'' } })
      .should.equal('<div class="b i-bem" data-bem=\'{"b":{"a":"&#39;Sid&amp;' +
        'Nancy&#39;","b":"&#39;Tom&amp;Jerry&#39;"}}\'></div>');
  });

  describe('elemJsInstances option', function() {
    it('should not render i-bem for elems be default', function() {
      compile('')
        .apply({ block: 'b', elem: 'e', js: true })
        .should.equal('<div class="b__e" data-bem=\'{"b__e":{}}\'></div>');
    });

    it('should render i-bem for elems with elemJsInstances option', function() {
      compile(function() {}, { elemJsInstances: true })
        .apply({ block: 'b', elem: 'e', js: true })
        .should
          .equal('<div class="b__e i-bem" data-bem=\'{"b__e":{}}\'></div>');
    });

    it('should render i-bem when mixed with other block with js', function() {
      var tmpls = compile(function() {}, { elemJsInstances: true });

      tmpls.apply({
          block: 'a',
          js: true,
          mix: { block: 'b', elem: 'e', js: true }
        })
        .should.equal('<div class="a b__e i-bem"' +
          ' data-bem=\'{"a":{},"b__e":{}}\'></div>');

      tmpls.apply({
        block: 'b',
        elem: 'e',
        js: true,
        mix: { block: 'a', js: true }
      })
      .should.equal('<div class="b__e a i-bem"' +
        ' data-bem=\'{"b__e":{},"a":{}}\'></div>');
    });
  });
});
