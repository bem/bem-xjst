'use strict';

const {plugin} = require('./pluggable');

exports.bemhtml = plugin('bemhtml', function () {
  return require(`./lib/bemhtml`);
});

exports.bemtree = plugin('bemtree', function () {
  return require(`./lib/bemtree`);
});

exports.ddsl = plugin('ddsl', function () {
  return require('xjst-ddsl/lib/ddsl');
});
