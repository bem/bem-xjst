var fixtures = require('./fixtures');
var test = fixtures.test;
var assert = require('assert');
var bemxjst = require('../');

describe('Modes attrs', function() {
  it('should throw error when args passed to attrs mode', function() {
    assert.throws(function() {
      bemxjst.compile(function() {
        block('b1').attrs('blah');
      });
    });
  });

  it('should set attrs', function() {
    test(function() {
      block('checkbox').attrs()({
        name: undefined,
        type: 'button',
        disabled: false,
        hidden: true,
        value: null
      });
    },
    { block: 'checkbox' },
    '<div class="checkbox" type="button" disabled="false" hidden="true" ' +
    'value="null"></div>');
  });

  it('should use value from bemjson', function() {
    test(function() {
      block('button').attrs()({
        type: 'button',
        disabled: true
      });
    },
    {
      block: 'button',
      attrs: {
        type: 'link',
        disabled: undefined,
        name: 'button'
      }
    },
    '<div class="button" type="link" name="button"></div>');
  });
});
