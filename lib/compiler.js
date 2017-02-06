var fnToString = require('./bemxjst/utils').fnToString;
var engines = {
  bemhtml: require('./bemhtml'),
  bemtree: require('./bemtree')
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
  if (!options) options = {};
  var api = new engines[this.engineName](options);
  return api.getTemplate(getCode(code, options.runtimeLint), options);
};

Compiler.prototype.generate = function generate(code, options) {
  /* istanbul ignore else */
  if (!options) options = {};
  code = fnToString(code);

  var exportName = this.engineName.toUpperCase();

  var source = [
    '/// -------------------------------------',
    '/// --------- BEM-XJST Runtime Start ----',
    '/// -------------------------------------',
    'var ' + exportName + ' = function(module, exports) {',
    require('fs').readFileSync(
      require.resolve('./' + this.engineName + '/bundle'),
      'utf8'
    ),
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
