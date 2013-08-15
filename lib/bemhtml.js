var bemhtml = exports;

// Runtime
bemhtml.runtime = require('./bemhtml/runtime');

// Compiler
bemhtml.Compiler = require('./bemhtml/compiler').Compiler;

// API functions
bemhtml.pretranslate = require('./bemhtml/api').pretranslate;
bemhtml.translate = require('./bemhtml/api').translate;
bemhtml.pregenerate = require('./bemhtml/api').pregenerate;
bemhtml.generate = require('./bemhtml/api').generate;
bemhtml.compile = require('./bemhtml/api').compile;
