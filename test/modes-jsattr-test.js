var assert = require('assert');
var bemxjst = require('../').bemhtml;

describe('Modes jsAttr', function() {
  it('should throw error when args passed to jsAttr mode', function() {
    assert.throws(function() {
      bemxjst.compile(function() {
        block('b1').jsAttr('blah');
      });
    });
  });
});
