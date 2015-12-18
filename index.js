var fs = require('fs');
var Compiler = require('./lib/compiler').Compiler;
var _cache = {};

function getEngine(engineName) {
  if (_cache[engineName]) return _cache[engineName];

  var runtime = require('./lib/' + engineName);
  var pathToBundle = require.resolve('./lib/' + engineName + '/bundle');
  var sourceBundle = fs.readFileSync(pathToBundle, 'utf8');

  runtime.source = sourceBundle;

  return _cache[engineName] = new Compiler(runtime);
}

module.exports = {
  get bemtree() { return getEngine('bemtree'); },
  get bemhtml() { return getEngine('bemhtml'); }
};
