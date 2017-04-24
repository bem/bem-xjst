var fixtures = require('./fixtures')('bemhtml');
var test = fixtures.test;
var assert = require('assert');
var bemxjst = require('../').bemhtml;

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
    '<div class="checkbox" type="button" hidden></div>');
  });

  it('should override bemjson attrs', function() {
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
    '<div class="button" type="button" disabled></div>');
  });

  it('should not modify state of bemxjst if attrs non simple', function() {
    test(function() {
      block('*')
        .match(function() { return this.block; })
        .def()(function(n) {
          return n.block === 'ERROR' ?  ('Good: ' + n.block) : applyNext();
        });

      block('image').attrs()({ alt: [ 'Река Ока' ] });
    },
    [
      {
        block: 'a',
        content: { block: 'image' }
      },
      {
        block: 'b',
        content: { block: 'error' }
      }
    ],
    '<div class="a"><div class="image" alt="Река Ока"></div></div>' +
      '<div class="b"><div class="error"></div></div>');
  });
});
