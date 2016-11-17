var fixtures = require('./fixtures');
var test = fixtures.test;
var assert = require('assert');

describe('Modes replace', function() {
  it('should throw error when args passed to replace mode', function() {
    assert.throws(function() {
      fixtures.compile(function() {
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

  it('should not match on removed mods', function () {
    test(function() {
      block('b1').mod('a', 'b').replace()(function() {
        return {
          block: 'b1',
          content: 'content'
        };
      });
    }, {
      block: 'b1',
      mods: { a: 'b' }
    }, '<div class="b1">content</div>');
  });
});
