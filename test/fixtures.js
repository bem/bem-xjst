var bemxjst = require('../');
var assert = require('assert');
var utile = require('utile');
var vm = require('vm');

module.exports = function(engine) {
  function test(fn, data, expected, options) {
    if (!options) options = {};

    var template = bemxjst[engine].compile(fn, options);

    if (options.flush) {
      template._buf = [];
      template.BEMContext.prototype._flush = function flush(str) {
        if (str !== '')
          template._buf.push(str);
        return '';
      };
    }

    // Invoke multiple times
    var count = options.count || 1;
    for (var i = 0; i < count; i++) {
      try {
        assert.deepEqual(template.apply(data), expected, i);
      } catch (e) {
        console.error(e.stack);
        throw e;
      }
    }

    if (options.after)
      options.after(template);
  }

  function fail(fn, regexp) {
    assert.throws(function() {
      bemxjst[engine].compile(fn);
    }, regexp);
  }

  return {
    test: test,
    fail: fail
  };
}
