var Compiler = require('./lib/compiler');
var _cache = {};

function getEngine(engineName) {
  var engine = _cache[engineName];

  return engine || (engine = new Compiler(engineName));
};


module.exports = {
  get bemtree() { return getEngine('bemtree'); },
  get bemhtml() { return getEngine('bemhtml'); }
};
