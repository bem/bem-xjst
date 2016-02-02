var bemxjst = require('../');
var assert = require('assert');
var utile = require('utile');
var vm = require('vm');

require('chai').should();

module.exports = function(engine) {

  /**
   * test helper
   *
   * @param {?Function} fn - matchers
   * @param {BEMJSON} data - incoming bemjson
   * @param {String} expected - expected resulting html
   * @param {?Object} options - compiler options
   */
  function test(fn, data, expected, options) {
    if (typeof fn !== 'function') {
      options = expected;
      expected = data;
      data = fn;
      fn = function() {};
    }
    if (!options) options = {};

    var template = compile(fn, options);

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

  function compile(fn, options) {
    if (typeof fn !== 'function') {
      options = fn;
      fn = function() {};
    }
    return bemxjst[engine].compile(fn, options || {});
  }

  return {
    test: test,
    fail: fail,
    compile: compile
  };
}
