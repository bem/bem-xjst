var fixtures = require('./fixtures')('bemhtml');
var test = fixtures.test;
var assert = require('assert');
var bemxjst = require('../').bemhtml;

describe('Modes replace', function() {
  it('should throw error when args passed to replace mode', function() {
    assert.throws(function() {
      bemxjst.compile(function() {
        block('b1').replace('blah');
      });
    });
  });

  it('should support basic mode of operation', function () {
    test(function() {
      block('b1').content()('ok');
      block('b2').content()('replaced');
      block('b1').replace()(function () { return { block: 'b2' }; });
    }, { block: 'b1' }, '<div class="b2">replaced</div>');
  });

  it('should have proper `this`', function () {
    test(function() {
      block('b1').content()('ok');
      block('b2').content()('replaced');
      block('b1').replace()(function () { return { block: this.ctx.wtf }; });
    }, { block: 'b1', wtf: 'b2' }, '<div class="b2">replaced</div>');
  });

  it('should work as a singular function', function () {
    test(function() {
      block('b1').content()('ok');
      block('b2').content()('replaced');
      block('b1')(replace()(function () { return { block: 'b2' }; }));
    }, { block: 'b1' }, '<div class="b2">replaced</div>');
  });

  it('should support inline argument', function () {
    test(function() {
      block('b1').content()('ok');
      block('b2').content()('replaced');
      block('b1').replace()({ block: 'b2' });
    }, { block: 'b1' }, '<div class="b2">replaced</div>');
  });

  it('should not protected from infinite loop', function() {
    assert.throws(function() {
      block('b1').replace()({ block: 'b2' });
      block('b2').replace()({ block: 'b1' });
    });
  });
});
