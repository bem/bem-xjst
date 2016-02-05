var fixtures = require('./fixtures')('bemhtml');
var test = fixtures.test;
var assert = require('assert');
var bemxjst = require('../').bemhtml;

describe('Modes once', function() {
  it('should throw error when args passed to once mode', function() {
    assert.throws(function() {
      bemxjst.compile(function() {
        block('b1').once('blah');
      });
    });
  });

  it('should support `.once()`', function() {
    test(function() {
      block('b1').content()(function() {
        return 'second';
      });
      block('b1').once().content()(function() {
        return 'first';
      });
    }, [ {
      block: 'b1'
    }, {
      block: 'b1'
    } ], '<div class="b1">first</div><div class="b1">second</div>', {
      count: 5
    });
  });

  it('should support early `.once()`', function() {
    test(function() {
      block('b1').content()(function() {
        return 'second';
      });
      block('b1').once().match(function() {
        return !this.ctx.early;
      }).content()(function() {
        return 'first';
      });
    }, [ {
      block: 'b1',
      early: true
    }, {
      block: 'b1'
    } ], '<div class="b1">second</div><div class="b1">first</div>', {
      count: 5
    });
  });
});
