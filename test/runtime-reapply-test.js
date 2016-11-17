var fixtures = require('./fixtures');
var test = fixtures.test;

describe('Runtime this.reapply()', function() {
  it('should support this.reapply()', function() {
    test(function() {
      block('b1').content()(function() {
        this.wtf = 'fail';
        return this.reapply({ block: 'b2' });
      });

      block('b2').content()(function() {
        return this.wtf || 'ok';
      });
    },
    { block: 'b1' },
    '<div class="b1"><div class="b2">ok</div></div>');
  });
});
