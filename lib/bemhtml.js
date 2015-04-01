var bemhtml = exports;

var fs = require('fs');

// Runtime
bemhtml.runtime = require('./bemhtml/runtime');
bemhtml.runtime.source =
    fs.readFileSync(require.resolve('./bemhtml/runtime/bundle')) + '';

// Compiler
bemhtml.Compiler = require('./bemhtml/compiler').Compiler;

// API functions
bemhtml.generate = require('./bemhtml/api').generate;
bemhtml.compile = require('./bemhtml/api').compile;
