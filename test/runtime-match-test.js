var fixtures = require('./fixtures');
var test = fixtures.test;

describe('Runtime Match', function() {
  it('should call body function in BEMContext context', function() {
    test(function() {
      block('b').def()(function() {
        return this.constructor.name;
      });
    }, { block: 'b' }, 'ContextChild');
  });
});
