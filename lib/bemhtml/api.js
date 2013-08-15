var bemhtml = require('../bemhtml');

exports.pretranslate = function pretranslate(ast, options) {
  return new bemhtml.Compiler(options).pretranslate(ast);
};

exports.translate = function translate(ast, options) {
  return new bemhtml.Compiler(options).translate(ast);
};

exports.pregenerate = function pregenerate(code, options) {
  return new bemhtml.Compiler(options).pregenerate(code);
};

exports.generate = function generate(code, options) {
  return new bemhtml.Compiler(options).generate(code);
};

exports.compile = function compile(code, options) {
  return new bemhtml.Compiler(options).compile(code);
};
