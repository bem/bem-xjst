var bemxjst = require('../');
var assert = require('assert');
var utile = require('utile');
var vm = require('vm');

require('chai').should();

/**
 * test helper
 *
 * @param {?Function} fn - matchers
 * @param {BEMJSON} data - incoming bemjson
 * @param {String} expected - expected resulting html
 * @param {?Object} options - compiler options
 */
function test(fn, data, expected, options) {
  if (!options) options = {};

  var template = bemxjst.compile(fn, options)

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
      assert.equal(template.apply(data), expected, i);
    } catch (e) {
      console.error(e.stack);
      throw e;
    }
  }

  if (options.after)
    options.after(template);
}

exports.test = test;

function fail(fn, regexp) {
  assert.throws(function() {
    bemxjst.compile(fn);
  }, regexp);
}

exports.fail = fail;

function compile(fn, options) {
  if (typeof fn !== 'function') {
    options = fn;
    fn = function() {};
  }
  return bemxjst.compile(fn, options || {});
}

exports.compile = compile;
