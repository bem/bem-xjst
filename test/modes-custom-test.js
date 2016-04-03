var fixtures = require('./fixtures')('bemhtml');
var test = fixtures.test;

describe('Modes custom', function() {
  it('should support custom modes', function () {
    test(function() {
      block('b1').mode('custom')('ok');
      block('b1').content()(function() {
        return apply('custom');
      });
    }, {
      block: 'b1'
    }, '<div class="b1">ok</div>');
  });

  it('should support custom modes with changes', function () {
    test(function() {
      block('b1').mode('custom')(function() {
        return this.yikes;
      });
      block('b1').content()(function() {
        return apply('custom', { yikes: 'ok' });
      });
    }, {
      block: 'b1'
    }, '<div class="b1">ok</div>');
  });
});
