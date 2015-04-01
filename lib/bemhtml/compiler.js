var bemhtml = require('../bemhtml');

var assert = require('assert');
var vm = require('vm');

function Compiler(options) {
  options = this.options = options || {};
};
exports.Compiler = Compiler;

Compiler.prototype.wrap = function wrap(code) {
  if (!this.options.wrap)
    return code;

  var opts = this.options;
  var exportName = opts.exportName || 'BEMHTML';
  var deps = opts.modulesDeps;
  var modulesDeps = deps ? ', ' + JSON.stringify(Object.keys(deps)) : '';
  var modulesProvidedDeps =  deps ? ', ' + Object.keys(deps).map(function(module) {
    var providedName = deps[module];
    return providedName === true ? module : providedName;
  }).join(', ') : '';

  return '(function(g) {\n' +
         '  var __bem_xjst = function(exports' + modulesProvidedDeps + ') {\n' +
         '     ' + code + ';\n' +
         '     return exports;\n' +
         '  }\n' +
         '  var defineAsGlobal = true;\n' +
         '  if(typeof exports === "object") {\n' +
         '    exports["' + exportName + '"] = __bem_xjst({}' + modulesProvidedDeps + ');\n' +
         '    defineAsGlobal = false;\n' +
         '  }\n' +
         '  if(typeof modules === "object") {\n' +
         '    modules.define("' + exportName + '"' + modulesDeps + ',\n' +
         '      function(provide' + modulesProvidedDeps + ') {\n' +
         '        provide(__bem_xjst({}' + modulesProvidedDeps + ')) });\n' +
         '    defineAsGlobal = false;\n' +
         '  }\n' +
         '  defineAsGlobal && (g["' + exportName + '"] = __bem_xjst({}' + modulesProvidedDeps + '));\n' +
         '})(this);'
};

Compiler.prototype.generate = function generate(code) {
  var locals = bemhtml.runtime.locals.join(', ');

  var source = '/// -------------------------------------\n' +
               '/// --------- BEM-XJST Runtime Start ----\n' +
               '/// -------------------------------------\n' +
               bemhtml.runtime.source + ';\n' +
               ';\n' +
               '/// -------------------------------------\n' +
               '/// --------- BEM-XJST Runtime End ------\n' +
               '/// -------------------------------------\n' +
               '\n' +
               'var api = new BEMHTML();\n' +
               '/// -------------------------------------\n' +
               '/// ------ BEM-XJST User-code Start -----\n' +
               '/// -------------------------------------\n' +
               'api.compile(function(' + locals + ') {\n' +
               code + ';\n' +
               '});\n' +
               'api.exportApply(exports);\n' +
               '/// -------------------------------------\n' +
               '/// ------ BEM-XJST User-code End -------\n' +
               '/// -------------------------------------\n';
  return this.wrap(source);
};

Compiler.prototype.compile = function compile(code) {
  var out = this.generate(code),
      exports = {};

  vm.runInNewContext(out, { exports: exports, console: console });

  return exports;
};
