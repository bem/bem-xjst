var readFileSync = require('fs').readFileSync;
var SourceMapFile = require('enb-source-map/lib/file');
var utils = require('./bemxjst/utils');
var fnToString = utils.fnToString;
var engines = {
  bemhtml: require('./bemhtml'),
  bemtree: require('./bemtree')
};
var bundles = {
  bemhtml: readFileSync(require.resolve('./bemhtml/bundle'), 'utf8'),
  bemtree: readFileSync(require.resolve('./bemtree/bundle'), 'utf8')
};
var EOL = require('os').EOL;

function Compiler(engineName) {
  this.engineName = engineName;
}

function getCode(code, isRuntimeLint) {
  return fnToString(code) +
    ';' +
    (isRuntimeLint ? fnToString(require('../runtime-lint')) : '');
}

function getDeps(requires) {
  var deps = {
    global: {},
    globalNames: [],
    commonJS: {},
    commonJSNames: [],
    ym: {},
    ymNames: [],
    ymLibs: [],
    ymVarsString: '',
    ymEngineLibs: '',
    defineAsGlobal: false
  };

  if (!requires) {
    deps.defineAsGlobal = true;
    return deps;
  }

  for (var lib in requires) {
    if (requires.hasOwnProperty(lib)) {
      if (requires[lib].globals) {
        deps.global[lib] = requires[lib].globals.replace(/\./g, '"]["');
        deps.globalNames.push(lib);
        deps.defineAsGlobal = true;
      }

      if (requires[lib].commonJS) {
        deps.commonJS[lib] = requires[lib].commonJS;
        deps.commonJSNames.push(lib);
      }

      if (requires[lib].ym) {
        deps.ymNames.push(lib);
        deps.ym[lib] = requires[lib].ym;
      }

      deps.ymLibs.push(lib);
    }
  }

  if (deps.ymLibs.length) {
    deps.ymVarsString = deps.ymLibs.reduce(function(vars, item, index) {
      return vars + (vars ? ',' : '') + '"' + item + '"' + ':dep' + index;
    }, '');

    deps.ymEngineLibs = 'engine.libs = {' +
      deps.ymLibs.map(function(item, index) {
        return '"' + item + '":dep' + index;
      }).join(',') + '};';
  }

  return deps;
}

Compiler.prototype.compile = function compile(code, options) {
  options = options || {};
  var api = new engines[this.engineName](options);
  return api.getTemplate(getCode(code, options.runtimeLint), options);
};

Compiler.prototype.generate = function generate(code, options) {
  options = options || {};
  var exportName = options.exportName || this.engineName.toUpperCase();
  var sourceMap = options.sourceMap;

  if (!options.to) options.to = process.cwd();
  var file = new SourceMapFile(options.to, { sourceMap: sourceMap });

  code = fnToString(code);

  var deps = getDeps(options.requires);
  var bemxjstOpts = utils.extend({}, options);
  if (bemxjstOpts.sourceMap) {
    bemxjstOpts.sourceMap = true;
  }

  file
    .writeContent([
      'var ' + exportName + ';',
      '(function(global) {',
        'function buildBemXjst(libs) {',
          'var exports;',

          '/* BEM-XJST Runtime Start */',
          'var ' + exportName + ' = function(module, exports) {',
             bundles[this.engineName] + ';',
            'return module.exports || exports.' + exportName + ';',
          '}({}, {});',

          'var api = new ' + exportName + '(' + JSON.stringify(options) + ');',

          'api.compile(function(' +
            require('./bemxjst').prototype.locals.join(', ') +
          ') {',
            '/* BEM-XJST User code here: */'
    ].join(EOL));

  if (sourceMap && sourceMap.from) {
    file.writeFileContent(sourceMap.from, code);
  } else {
    file.writeContent(getCode(code, options.runtimeLint));
  }

  file
    .writeContent([
      ';oninit(function(exports, context) {',
        'var BEMContext = exports.BEMContext || context.BEMContext;',
        // Provides third-party libraries from different modular systems
        'BEMContext.prototype.require = function(lib) {',
         'return this._libs[lib];',
        '};',
      '});'
    ].join(EOL))
    .write(';')
    .writeContent([
          '});',

        'exports = api.exportApply(exports);',
        'if (libs) exports.BEMContext.prototype._libs = libs;',

        'return exports;',
      '};',

      options.commonJSModules,

      'var glob = this.window || this.global || this;',
      'var exp = typeof exports !== "undefined" ? exports : global;',

      // Provide to YModules
      'if (typeof modules === "object") {',

      // re-define YM modules to require keys
      deps.ymNames.length !== 0 ?
        deps.ymNames.map(function(dep) {
          var ymLib = deps.ym[dep];

          return 'modules.define(' +
            '"' + dep + '"' + ',' +
            '["' + ymLib + '"],' +
            'function(provide, ymlib) {' +
            'provide(ymlib);' +
            '});';
        }).join(EOL) : '',

      // wrap CommonJS deps
      deps.commonJSNames.length !== 0 ?
        deps.commonJSNames.map(function(dep) {
          var commonPath = deps.commonJS[dep];

          return 'modules.define(' +
            '"' + dep + '"' + ',' +
            'function(provide, prev) {' +
            'provide(require("' + commonPath + '") || prev);' +
            '});';
        }).join(EOL) : '',

      // wrap global deps
      deps.globalNames.length !== 0 ?
        deps.globalNames.map(function(dep) {
          var globName = deps.global[dep];

          return 'modules.define(' +
            '"' + dep + '"' + ',' +
            'function(provide, prev) {' +
            'provide(glob["' + globName + '"] || prev);' +
            '});';
        }).join(EOL) : '',

      'modules.define("' + exportName + '",' +
        JSON.stringify(deps.ymLibs) + ',' +
        'function(provide' +
        (deps.ymLibs.length ? ',' + deps.ymLibs.map(function(i, index) {
          return 'dep' + index;
        }).join(',') : '') + ') { ' +
          'var engine = buildBemXjst({' + deps.ymVarsString + '});' +
          deps.ymEngineLibs +
            'provide(engine);' +
          '}' +
       ');',

     '} else {',

      'var _libs = {};',

      // Provide with CommonJS
      deps.commonJSNames.length !== 0 ?
        deps.commonJSNames.map(function(dep) {
          var commonPath = deps.commonJS[dep];
          return '_libs["' + dep + '"] = ' +
            'glob && typeof glob["' + dep + '"] ' +
            '!== "undefined" ? ' +
            'glob["' + dep + '"] : require("' + commonPath + '");';
        }).join(EOL) : '',

      // Provide to global scope
      deps.globalNames.length !== 0 ?
        deps.globalNames.map(function(dep) {
          var globName = deps.global[dep];
          return 'typeof glob["' + globName + '"] !== "undefined" && (' +
            '_libs["' + dep + '"] = ' +
            'glob["' + globName + '"]);';
        }).join(EOL) : '',
      'if (Object.keys(_libs).length) {',
        exportName + ' = buildBemXjst(_libs);',
        'exp["' + exportName + '"] = ' + exportName + ';',
        'exp["' + exportName + '"].libs = _libs;',
      '} else {',
        exportName + '= buildBemXjst(' +
        (deps.defineAsGlobal ? 'glob' : '{}') + ');',
        'exp["' + exportName + '"] = ' + exportName + ';' +
        'exp["' + exportName + '"].libs = ' +
        (deps.defineAsGlobal ? 'glob' : '{}') + ';',
      '}',

    '}',

    '})(typeof window !== "undefined" ? ' +
      'window : typeof global !== "undefined" ? global : this);'
  ].join(EOL));

  return options.sourceMap && options.sourceMap.include === false ?
    {
      content: file.getContent(),
      sourceMap: file.getSourceMap()
    } :
    file.render();
};

module.exports = Compiler;
