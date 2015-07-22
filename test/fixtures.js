var bemxjst = require('../');
var assert = require('assert');
var utile = require('utile');
var vm = require('vm');

function test(fn, data, expected, options) {
  if (!options) options = {};

  var body = fn.toString().replace(/^function\s*\(\)\s*{|}$/g, '');
  var fns = [
    bemxjst.compile(body, options)
  ];

  fns.forEach(function(fn, i) {
    try {
      assert.equal(fn.apply.call(data || {}), expected, i);
    } catch (e) {
      console.error(e.stack);
      throw e;
    }
  });
}
exports.test = test;
