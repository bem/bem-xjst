var assert = require('assert');
var bemxjst = require('../');

describe('API generate', function() {
  it('should work', function() {
    var bundle = bemxjst.generate();

    assert.equal(typeof bundle, 'string');
  });
});
