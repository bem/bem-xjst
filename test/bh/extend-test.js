var fixtures = require('../fixtures')('bemhtml');
var compile = fixtures.compile;

describe('extend', function() {
  it('should extend empty target', function() {
    compile(function() {
      block('button').def()(function() {
        return this.extend(null, { foo: 'bar' }).foo;
      })
    })
      .apply({ block: 'button' })
      .should.equal('bar');
  });
  it('should extend object', function() {
    compile(function() {
      block('button').def()(function() {
        return this.extend(
            { foo: 'bar' },
            { foo: 'foo' }
        ).foo;
      })
    })
      .apply({ block: 'button' })
      .should.equal('foo');
  });
});
