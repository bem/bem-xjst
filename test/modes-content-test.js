var fixtures = require('./fixtures')('bemhtml');
var test = fixtures.test;
var assert = require('assert');
var bemxjst = require('../').bemhtml;

describe('Modes content', function() {
  it('should throw error when args passed to content mode', function() {
    assert.throws(function() {
      bemxjst.compile(function() {
        block('b1').content('blah');
      });
    });
  });

  it('should set bemjson content', function() {
    test(function() {
      block('button').content()({ elem: 'text' });
    },
    { block: 'button' },
    '<div class="button"><div class="button__text"></div></div>');
  });

  it('should set bemjson array content', function() {
    test(function() {
      block('button').content()([ { elem: 'text1' }, { elem: 'text2' } ]);
    },
    { block: 'button' },
    '<div class="button">' +
      '<div class="button__text1"></div><div class="button__text2"></div>' +
    '</div>');
  });

  it('should set bemjson string content', function() {
    test(function() {
      block('button').content()('Hello World');
    },
    { block: 'button' },
    '<div class="button">Hello World</div>');
  });

  it('should set bemjson numeric content', function() {
    test(function() {
      block('button').content()(123);
    },
    { block: 'button' },
    '<div class="button">123</div>');
  });

  it('should set bemjson zero-numeric content', function() {
    test(function() {
      block('button').content()(0);
    },
    { block: 'button' },
    '<div class="button">0</div>');
  });

  it('should not override later declarations', function() {
    test(function() {
      block('button').content()({ elem: 'text2' });
      block('button').content()({ elem: 'text1' });
    },
    { block: 'button' },
    '<div class="button"><div class="button__text1"></div></div>');
  });
});
