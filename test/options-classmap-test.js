var assert = require('assert');
var bemxjst = require('../').bemhtml;

describe('classMap', function() {
  it('should work', function() {
    var template = bemxjst.compile();
    assert.equal(template.apply({ block: 'b1' }), '<div class="b1"></div>');

    template = bemxjst.compile('', { classMap: { b1: 'ololo' } });
    assert.equal(template.apply({ block: 'b1' }), '<div class="ololo"></div>');

    template = bemxjst.compile('', { classMap: { b1__e1: 'ololo' } });
    assert.equal(template.apply({
      block: 'b1',
      elem: 'e1'
    }), '<div class="ololo"></div>');

    template = bemxjst.compile('', { classMap: {
      b1__e1: 'ololo',
      b2: 'bedva',
      b3: 'betri',
      b3_m1_v1: 'betrim1v1'
    } });
    assert.equal(template.apply({
      block: 'b1',
      elem: 'e1',
      mix: [
          { block: 'b2' },
          { block: 'b3', mods: { m1: 'v1' } }
      ]
    }), '<div class="ololo bedva betri betrim1v1"></div>');

    template = bemxjst.compile('', { classMap: {
      b1: 'ololo',
      anyclass: 'a1',
      anyclass2: 'a2'
    } });
    assert.equal(template.apply({
      block: 'b1',
      cls: 'anyclass anyclass2'
    }), '<div class="ololo a1 a2"></div>');

    template = bemxjst.compile('', { classMap: {
      b1: 'ololo',
      'i-bem': 'bem'
    } });
    assert.equal(template.apply({
      block: 'b1',
      js: true
    }), '<div class="ololo bem" data-bem=\'{"b1":{}}\'></div>');
  });
});
