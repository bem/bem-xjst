var fixtures = require('./fixtures')('bemhtml');
var test = fixtures.test;
var assert = require('assert');
var bemxjst = require('../').bemhtml;

describe('Modes bem', function() {
  it('should throw error when args passed to bem mode', function() {
    assert.throws(function() {
      bemxjst.compile(function() {
        block('b1').bem('blah');
      });
    });
  });

  it('should return bem by default', function() {
    test(function() {
      block('button').def()(function() {
        return typeof this.ctx.bem;
      });
    },
    { block: 'button' },
    'undefined');
  });

  it('should set bem to false', function() {
    test(function() {
      block('button').bem()(false);
    },
    { block: 'button' },
    '<div></div>');
  });

  it('should not override later declarations', function() {
    test(function() {
      block('button').bem()(false);
      block('button').bem()(true);
    },
    { block: 'button' },
    '<div class="button"></div>');
  });
});
