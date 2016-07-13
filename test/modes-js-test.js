var fixtures = require('./fixtures')('bemhtml');
var test = fixtures.test;
var assert = require('assert');

describe('Modes js', function() {
  it('should throw error when args passed to js mode', function() {
    assert.throws(function() {
      fixtures.compile(function() {
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

  it('should override user declarations', function() {
    test(function() {
      block('button').js()(true);
    },
    { block: 'button', js: false },
    '<div class="button i-bem" data-bem=\'{"button":{}}\'></div>');
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

  it('should override js from bemjson via js from templates', function() {
    test(function() {
      block('b').js()({ templ: '1' });
    },
    { block: 'b', js: { bemjson: '2' } },
    '<div class="b i-bem" data-bem=\'{"b":{"templ":"1"}}\'></div>');
  });
});
