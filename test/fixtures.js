var assert = require('assert');

require('chai').should();

module.exports = function(engine) {
  function compile(fn, options) {
    if (typeof fn !== 'function') {
      options = fn;
      fn = function() {};
    }

    if (!options) options = {};

    var engineName = options.engine || 'BEMHTML';
    var Engine = require('../lib/' + engineName.toLowerCase() + '/bundle');
    var api = new Engine(options);
    var template = {};

    api.compile(fn);
    api.exportApply(template);

    return template;
  }

  function fail(fn, regexp) {
    assert.throws(function() {
      compile(fn, { engine: engine });
    }, regexp);
  }

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

  return {
    test: test,
    fail: fail,
    compile: compile
  };
};
