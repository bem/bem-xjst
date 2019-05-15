var assert = require('assert');
var bemhtml = require('../').bemhtml;
var sinon = require('sinon');

describe('BEMContext: custom error logger', function() {
  it('should use custom function', function() {
    var templates = bemhtml.compile(function() {
      block('b1').attrs()(function() {
        var attrs = applyNext();
        attrs.foo = 'bar';
        return attrs;
      });
    }, { production: true });

    var p = templates.BEMContext.prototype;
    p.onError = function(context, e) {
      console.info('>>> Error occurred', context.ctx, e);
    };
    var onError = sinon.spy(p, 'onError');

    assert.doesNotThrow(function() {
      assert.equal(templates.apply({ block: 'b1' }), '');
    });

    sinon.assert.calledOnce(onError);
  });
});
