var assert = require('assert');
var bemxjst = require('../').bemhtml;

describe('Modes def', function() {
  it('should throw error when args passed to def mode', function() {
    assert.throws(function() {
      bemxjst.compile(function() {
        block('b1').def('blah');
      });
    });
  });
});
