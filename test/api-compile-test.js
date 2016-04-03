var assert = require('assert');
var bemxjst = require('../').bemhtml;

describe('API compile', function() {
  it('should work', function() {
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
});
