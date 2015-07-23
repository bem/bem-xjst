var bemxjst = require('../');
var assert = require('assert');
var utile = require('utile');
var vm = require('vm');

function fn2str(fn) {
  return fn.toString().replace(/^function\s*\(\)\s*{|}$/g, '');
}

function test(fn, data, expected, options) {
  if (!options) options = {};

  var body = fn2str(fn);
  var template = bemxjst.compile(body, options)

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
      assert.equal(template.apply.call(data || {}), expected, i);
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
  var body = fn2str(fn);
  assert.throws(function() {
    bemxjst.compile(body);
  }, regexp);
}
exports.fail = fail;
