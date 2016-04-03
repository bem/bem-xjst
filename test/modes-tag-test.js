var fixtures = require('./fixtures')('bemhtml');
var test = fixtures.test;
var assert = require('assert');
var bemxjst = require('../').bemhtml;

describe('Modes tag', function() {
  it('should throw error when args passed to tag mode', function() {
    assert.throws(function() {
      bemxjst.compile(function() {
        block('b1').tag('span');
      });
    });
  });

  it('should set empty tag', function() {
    test(function() {
      block('link').tag()('');
      block('button').tag()(false);
    },
    {
      block: 'button',
      content: {
        block: 'link',
        content: 'link'
      }
    },
    'link');
  });

  it('should set html tag', function() {
    test(function() {
      block('button').tag()('button');
    },
    { block: 'button' },
    '<button class="button"></button>');
  });

  it('should override user tag', function() {
    test(function() {
      block('button').tag()('button');
    },
    { block: 'button', tag: 'a' },
    '<button class="button"></button>');
  });

  it('user can choose between tag in bemjson ' +
    'and custom value in templates', function() {
    test(function() {
      block('b').tag()(function() {
        return this.ctx.tag || 'strong';
      });
    },
    [ { block: 'b', tag: 'em' }, { block: 'b' } ],
    '<em class="b"></em><strong class="b"></strong>');
  });

  it('should not override later declarations', function() {
    test(function() {
      block('button').tag()('input');
      block('button').tag()('button');
    },
    { block: 'button' },
    '<button class="button"></button>');
  });
});
