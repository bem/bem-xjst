var fixtures = require('./fixtures')('bemhtml');
var test = fixtures.test;

describe('BEMJSON attrs', function() {
  it('should render without block by default', function () {
    test(function() {},
      { attrs: { a: 'b' } },
      '<div a="b"></div>');
  });

  it('should render with block', function () {
    test(function() {
    }, { block: 'b1', attrs: { a: 'b' } }, '<div class="b1" a="b"></div>');
  });

  it('should render with just tag', function () {
    test(function() {
    }, { tag: 'span', attrs: { a: 'b' } }, '<span a="b"></span>');
  });

  it('should not return undefined as attrs value', function() {
    test(function() {},
      { block: 'b', attrs: undefined },
      '<div class="b"></div>');
  });

  it('should not return null as attrs value', function() {
    test(function() {},
      { block: 'b', attrs: null },
      '<div class="b"></div>');
  });

  it('should not return Number as attrs value', function() {
    test(function() {},
      { block: 'b', attrs: 100 },
      '<div class="b"></div>');
  });

  it('should not return zero as attrs value', function() {
    test(function() {},
      { block: 'b', attrs: 0 },
      '<div class="b"></div>');
  });

  it('should not return NaN as attrs value', function() {
    test(function() {},
      { block: 'b', attrs: NaN },
      '<div class="b"></div>');
  });

  it('should not return String as attrs value', function() {
    test(function() {},
      { block: 'b', attrs: 'skipme' },
      '<div class="b"></div>');
  });

  it('should not return empty string as attrs value', function() {
    test(function() {},
      { block: 'b', attrs: '' },
      '<div class="b"></div>');
  });

  it('should not return true as attrs value', function() {
    test(function() {},
      { block: 'b', attrs: true },
      '<div class="b"></div>');
  });

  it('should not return false as attrs value', function() {
    test(function() {},
      { block: 'b', attrs: false },
      '<div class="b"></div>');
  });

  it('should not return Array as attrs value', function() {
    test(function() {},
      { block: 'b', attrs: [ 1, 2 ] },
      '<div class="b"></div>');
  });

  it('should support objects as attrs values', function() {
    test(function() {
      block('b1').attrs()(function() {
        return { prop1: { block: 'b2' } };
      });
      block('b2').replace()('hello');
    }, { block: 'b1' }, '<div class="b1" prop1="hello"></div>');
  });

  it('should escape double quotes and ampersands in values', function() {
    test(function() {
      block('b').attrs()(function() {
        return { attribute: '"tom&jerry"' };
      });
    }, { block: 'b' }, '<div class="b" attribute="&quot;tom&amp;jerry&quot;' +
      '"></div>');
  });

  // TODO: https://github.com/bem/bem-xjst/issues/188
  xit('should what?', function() {
    test(function() {
      block('b').attrs()(function() {
        return { class: 'opa' };
      });
    }, { block: 'b' }, '<div class="b opa"></div>');
  });
});
