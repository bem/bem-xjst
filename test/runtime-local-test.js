var fixtures = require('./fixtures')('bemhtml');
var test = fixtures.test;

describe('Runtime local()', function() {
  it('should support local()', function() {
    test(function() {
      block('b1').content()(function() {
        return local({ tmp: 'b2' })(function() {
          return this.tmp;
        });
      });
    }, { block: 'b1' }, '<div class="b1">b2</div>');
  });
});
