var fixtures = require('./fixtures')('bemhtml');
var test = fixtures.test;
var assert = require('assert');
var bemxjst = require('../').bemhtml;

describe('Modes js', function() {
  it('should throw error when args passed to js mode', function() {
    assert.throws(function() {
      bemxjst.compile(function() {
        block('b1').js('blah');
      });
    });
  });

  it('should set js', function() {
    test(function() {
      block('button').js()(true);
    },
    { block: 'button' },
    '<div class="button i-bem" data-bem=\'{"button":{}}\'></div>');
  });

  it('should not set js', function() {
    test(function() {
      block('button').js()(false);
    },
    { block: 'button' },
    '<div class="button"></div>');
  });

  it('should not override user declarations', function() {
    test(function() {
      block('button').js()(true);
    },
    { block: 'button', js: false },
    '<div class="button"></div>');
  });

  it('should extend user js', function() {
    test(function() {
      block('button').js()({ a: 2 });
    },
    { block: 'button', js: { x: 1 } },
    '<div class="button i-bem" data-bem=\'{"button":{"x":1,"a":2}}\'></div>');
  });

  it('should extend user js, when it equal true', function() {
    test(function() {
      block('button').js()({ a: 1 });
    },
    { block: 'button', js: true },
    '<div class="button i-bem" data-bem=\'{"button":{"a":1}}\'></div>');
  });

  it('should not override later declarations #1', function() {
    test(function() {
      block('button').js()(false);
      block('button').js()(true);
    },
    { block: 'button' },
    '<div class="button i-bem" data-bem=\'{"button":{}}\'></div>');
  });

  it('should not override later declarations #2', function() {
    test(function() {
      block('button').js()(true);
      block('button').js()(false);
    },
    { block: 'button' },
    '<div class="button"></div>');
  });
});
