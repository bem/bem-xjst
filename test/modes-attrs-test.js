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

  it('should not override user attrs', function() {
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

  describe('Style cases', function() {
    it('should convert style attrs to inline styles', function() {
      test(function() {
        block('b').attrs()({
          style: {
            background: '#000',
            padding: '10px 20px'
          }
        });
      },
      { block: 'b' },
      '<div class="b" style="background:#000;padding:10px 20px;"></div>');
    });

    it('should merge style from bemjson with templates', function() {
      test(function() {
        block('b').attrs()({
          style: {
            background: '#000'
          }
        });
      },
      { block: 'b', attrs: { style: { color: 'red' } } },
      '<div class="b" style="background:#000;color:red;"></div>');
    });
  });
});
