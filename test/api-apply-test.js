var assert = require('assert');
var bemxjst = require('../').bemhtml;

describe('API apply', function() {
  it('should throw error with one apply', function() {
    // There is no bemxjst.compile()
    assert.throws(function() {
      bemxjst.apply({ block: 'b' });
    });
  });

  it('should throw errors with many applies', function() {
    // There is no bemxjst.compile()
    assert.throws(function() {
      bemxjst.apply({ block: 'b' });
    });
    assert.throws(function() {
      bemxjst.apply({ block: 'b' });
    });
  });
});
