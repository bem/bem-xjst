var fixtures = require('./fixtures')('bemhtml');
var test = fixtures.test;

describe('BEMContext this.extend()', function() {
  it('should extend empty target', function() {
    test(function() {
      block('button').def()(function() {
        return this.extend(null, { foo: 'bar' }).foo;
      });
    },
    { block: 'button' },
    'bar');
  });

  it('should extend object', function() {
    test(function() {
      block('button').def()(function() {
        return this.extend(
            { foo: 'bar' },
            { foo: 'foo' }
        ).foo;
      });
    },
    { block: 'button' },
    'foo');
  });

  it('should always return new object', function() {
    test(function() {
      var obj = { foo: 'bar' };
      block('button').def()(function() {
        return String(this.extend(null, obj) !== obj);
      });
    },
    { block: 'button' },
    'true');
  });

  it('should always return new object', function() {
    test(function() {
      block('button').def()(function() {
        return JSON.stringify(this.extend(null, null));
      });
    },
    { block: 'button' },
    '{}');
  });
});
