var fixtures = require('./fixtures')('bemhtml');
var test = fixtures.test;
var assert = require('assert');
var bemxjst = require('../').bemhtml;
var compile = fixtures.compile;

describe('Modes cls', function() {
  it('should throw error when args passed to cls mode', function() {
    assert.throws(function() {
      bemxjst.compile(function() {
        block('b1').cls('blah');
      });
    });
  });

  it('should set cls', function() {
    test(function() {
      block('button').cls()('btn');
    },
    { block: 'button' },
    '<div class="button btn"></div>');
  });

  it('should not override later declarations', function() {
    test(function() {
      block('button').cls()('control');
      block('button').cls()('btn');
    },
    { block: 'button' },
    '<div class="button btn"></div>');
  });

  it('should trim cls', function() {
    compile(function() {
      block('button').cls()('  one two  ');
    })
      .apply({ block: 'button' })
      .should.equal('<div class="button one two"></div>');
  });

  it('should escape cls', function() {
    compile(function() {
      block('button').cls()('">');
    })
      .apply({ block: 'button' })
      .should.equal('<div class="button &quot;>"></div>');
  });
});
