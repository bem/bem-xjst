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

  it('should render i-bem for elems with elemJsInstances option', function() {
    test(function() {
      block('b').elem('e').js()(true);
    },
    { block: 'b', elem: 'e' },
    '<div class="b__e i-bem" data-bem=\'{"b__e":{}}\'></div>',
    { elemJsInstances: true });
  });

  it('should merge js from templates and js from bemjson', function() {
    test(function() {
      block('b').js()({ templ: '1' });
    },
    { block: 'b', js: { bemjson: '2' } },
    '<div class="b i-bem" data-bem=\'{"b":{"bemjson":' +
      '"2","templ":"1"}}\'></div>');
  });
});
