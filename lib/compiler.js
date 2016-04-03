var vm = require('vm');

function Compiler(runtime) {
  this.runtime = runtime;
}

exports.Compiler = Compiler;

Compiler.prototype.generate = function generate(code, options) {
  if (!options) options = {};

  // It is fine to compile without templates at first
  if (!code)
    code = '';

  // Yeah, let people pass functions to us!
  if (typeof code === 'function')
    code = code.toString().replace(/^function\s*\(\)\s*{|}$/g, '');

  var exportName = options.exportName || 'BEMHTML';
  var engine = options.engine || 'BEMHTML';

  var locals = this.runtime.prototype.locals;

  var source = [
    '/// -------------------------------------',
    '/// --------- BEM-XJST Runtime Start ----',
    '/// -------------------------------------',
    'var ' + exportName + ' = function(module, exports) {',
    this.runtime.source + ';',
    '  return module.exports ||',
    '      exports.' + exportName + ';',
    '}({}, {});',
    '/// -------------------------------------',
    '/// --------- BEM-XJST Runtime End ------',
    '/// -------------------------------------',
    '',
    'var api = new ' + engine + '(' + JSON.stringify(options) + ');',
    '/// -------------------------------------',
    '/// ------ BEM-XJST User-code Start -----',
    '/// -------------------------------------',
    'api.compile(function(' + locals.join(', ') + ') {',
    code + ';',
    '});',
    'api.exportApply(exports);',
    '/// -------------------------------------',
    '/// ------ BEM-XJST User-code End -------',
    '/// -------------------------------------\n'
  ].join('\n');

  return source;
};

Compiler.prototype.compile = function compile(code, options) {
  if (!options) options = {};

  var out = this.generate(code, options);
  out = '(function(exports, console) {' + out + '})';
  var exports = {};

  var fn = options.context === 'this' ?
    vm.runInThisContext(out) :
    vm.runInNewContext(out);

  fn(exports, console);

  return exports;
};
