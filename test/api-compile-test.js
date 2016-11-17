var assert = require('assert');
var bemxjst = require('../');

describe('API compile', function() {
  it('should work with no arguments', function() {
    var template;

    assert.doesNotThrow(function() {
      template = bemxjst.compile();
    });

    assert.equal(template.apply({ block: 'b1' }), '<div class="b1"></div>');
  });

  it('should able to add templates in runtime', function() {
    var template = bemxjst.compile();

    assert.equal(template.apply({ block: 'b1' }), '<div class="b1"></div>');

    template.compile(function() {
      block('b1').content()('ok');
    });

    assert.equal(template.apply({ block: 'b1' }), '<div class="b1">ok</div>');
    assert.equal(template.apply({ block: 'b2' }), '<div class="b2"></div>');

    template.compile(function() {
      block('b2').content()('ok');
    });

    assert.equal(template.apply({ block: 'b1' }), '<div class="b1">ok</div>');
    assert.equal(template.apply({ block: 'b2' }), '<div class="b2">ok</div>');

    template.compile(function() {
      block('b1').tag()('a');
    });

    assert.equal(template.apply({ block: 'b1' }), '<a class="b1">ok</a>');
    assert.equal(template.apply({ block: 'b2' }), '<div class="b2">ok</div>');
  });

  describe('Production mode', function() {
    it('should render even if error in one block', function() {
      var template = bemxjst.compile(function() {
        block('b1').attrs()(function() {
          var attrs = applyNext();
          attrs.undef.foo = 'bar';
          return attrs;
        });
      }, { production: true });

      assert.equal(template.apply({
        block: 'page',
        content: { block: 'b1' }
      }), '<div class="page"></div>');
    });

    it('should throw error with one apply if production mode off', function() {
      var template = bemxjst.compile(function() {
        block('b1').attrs()(function() {
          var attrs = applyNext();
          attrs.foo = 'bar';
          return attrs;
        });
      });

      assert.throws(function() {
        template.apply({ block: 'b1' });
      });
    });
  });
});
