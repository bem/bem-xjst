var assert = require('assert');
var bemxjst = require('../').bemhtml;

describe('API generate', function() {
  it('should work', function() {
    var bundle = bemxjst.generate();

    assert.equal(typeof bundle, 'string');
  });

  it('should work with options', function() {
    var bundle = bemxjst.generate('', { xhtml: true });

    assert.equal(typeof bundle, 'string');
  });
});
