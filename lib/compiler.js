var fnToString = require('./bemxjst/utils').fnToString;
var readFileSync = require('fs').readFileSync;
var engines = {
  bemhtml: require('./bemhtml'),
  bemtree: require('./bemtree')
};
var bundles = {
  bemhtml: readFileSync(require.resolve('./bemhtml/bundle'), 'utf8'),
  bemtree: readFileSync(require.resolve('./bemtree/bundle'), 'utf8')
};

function Compiler(engineName) {
  this.engineName = engineName;
}

function getCode(code, isRuntimeLint) {
  return isRuntimeLint ?
    (fnToString(code) + ';' + fnToString(require('../runtime-lint')))
      : fnToString(code);
}

Compiler.prototype.compile = function compile(code, options) {
  options = options || {};
  var api = new engines[this.engineName](options);
  return api.getTemplate(getCode(code, options.runtimeLint), options);
};

Compiler.prototype.generate = function generate(code, options) {
  options = options || {};
  code = fnToString(code);

  var exportName = this.engineName.toUpperCase();

  var source = [
    '/// -------------------------------------',
    '/// --------- BEM-XJST Runtime Start ----',
    '/// -------------------------------------',
    'var ' + exportName + ' = function(module, exports) {',
      bundles[this.engineName],
      ';',
    '  return module.exports ||',
    '      exports.' + exportName + ';',
    '}({}, {});',
    '/// -------------------------------------',
    '/// --------- BEM-XJST Runtime End ------',
    '/// -------------------------------------',
    '',
    'var api = new ' + exportName + '(' + JSON.stringify(options) + ');',
    '/// -------------------------------------',
    '/// ------ BEM-XJST User-code Start -----',
    '/// -------------------------------------',
    'api.compile(function(',
    require('./bemxjst').prototype.locals.join(', '),
    ') {',
    getCode(code, options.runtimeLint) + ';',
    '});',
    'api.exportApply(exports);',
    '/// -------------------------------------',
    '/// ------ BEM-XJST User-code End -------',
    '/// -------------------------------------\n'
  ].join('\n');

  return source;
};

module.exports = Compiler;
