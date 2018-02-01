var fixtures = require('./fixtures')('bemhtml');
var test = fixtures.test;

describe('BEMJSON bem', function() {
  it('should not render class if bem equals false', function () {
    test(function() {},
      { block: 'b', bem: false },
      '<div></div>');
  });

  it('should render class if bem equals false and cls field is set',
    function () {
    test(function() {},
      { cls: 'test', bem: false },
      '<div class="test"></div>');
  });

  it('should render class if bem equals true', function () {
    test(function() {},
      { block: 'b', bem: true },
      '<div class="b"></div>');
  });

  it('should render class if bem equals undefined', function() {
    test(function() {},
      { block: 'b', bem: undefined },
      '<div class="b"></div>');
  });

  it('should render class if bem equals null', function() {
    test(function() {},
      { block: 'b', bem: null },
      '<div></div>');
  });

  it('should render class if bem equals Number', function() {
    test(function() {},
      { block: 'b', bem: 100 },
      '<div class="b"></div>');
  });

  it('should render class if bem equals zero', function() {
    test(function() {},
      { block: 'b', bem: 0 },
      '<div></div>');
  });

  it('should render class if bem equals NaN', function() {
    test(function() {},
      { block: 'b', bem: NaN },
      '<div></div>');
  });

  it('should render class if bem equals String', function() {
    test(function() {},
      { block: 'b', bem: 'skipme' },
      '<div class="b"></div>');
  });

  it('should render class if bem equals empty string', function() {
    test(function() {},
      { block: 'b', bem: '' },
      '<div></div>');
  });

  it('should not return Array as attrs value', function() {
    test(function() {},
      { block: 'b', bem: [ 1, 2 ] },
      '<div class="b"></div>');
  });

  it('should output cls value if bem:false', function() {
    test(function() {
        block('b').js()(true);
      },
      [
        { block: 'b', bem: false, cls: 'anything' },
        { block: 'b', bem: false }
      ],
      '<div class="anything"></div><div></div>');
  });
});
