var assert = require('assert');
var bemhtml = require('./fixtures');

describe('Runtime BEMContext', function() {
  it('should support extending of templates.BEMContext prototype', function() {
    var templates = bemhtml.compile();
    templates.BEMContext.prototype.myField = 'opa';
    templates.compile(function() {
      block('b').content()(function() { return this.myField; });
    });
    assert.equal(templates.apply({ block: 'b' }), '<div class="b">opa</div>');
  });

  it('should redefine templates.BEMContext prototype later', function() {
    var templates = bemhtml.compile();
    var bemjson = { block: 'b', tag: false };
    templates.BEMContext.prototype.what = 'hip';
    templates.compile(function() {
      block('b').content()(function() { return this.what; });
    });
    assert.equal(templates.apply(bemjson), 'hip');
    templates.BEMContext.prototype.what = 'hipier';
    assert.equal(templates.apply(bemjson), 'hipier');
  });
});
