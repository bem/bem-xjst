var fixtures = require('./fixtures')('bemhtml');
var test = fixtures.test;
var assert = require('assert');
var bemxjst = require('../').bemhtml;

describe('Modes extend', function() {
  it('should throw error when args passed to extend mode', function() {
    assert.throws(function() {
      bemxjst.compile(function() {
        block('b1').extend('blah');
      });
    });
  });

  it('should support basic mode of operation', function () {
    test(function() {
      block('b1').content()('ok');
      block('b1').elem('e').content()('extended');
      block('b1').extend()(function() { return { elem: 'e' }; });
    }, { block: 'b1' }, '<div class="b1__e">extended</div>');
  });

  it('should have proper `this`', function () {
    test(function() {
      block('b1').content()('ok');
      block('b1').elem('e').content()('extended');
      block('b1').extend()(function() { return { elem: this.ctx.wtf }; });
    }, { block: 'b1', wtf: 'e' }, '<div class="b1__e">extended</div>');
  });

  it('should work as a singular function', function () {
    test(function() {
      block('b1').content()('ok');
      block('b1').elem('e').content()('extended');
      block('b1')(extend()(function() { return { elem: 'e' }; }));
    }, { block: 'b1' }, '<div class="b1__e">extended</div>');
  });

  it('should support inline argument', function () {
    test(function() {
      block('b1').content()('ok');
      block('b1').elem('e').content()('extended');
      block('b1').extend()({ elem: 'e' });
    }, { block: 'b1' }, '<div class="b1__e">extended</div>');
  });
});
