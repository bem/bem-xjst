var fixtures = require('./fixtures')('bemhtml');
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
    '<div class="b1">&lt;div class="b2"&gt;ok&lt;/div&gt;</div>');
  });
});
