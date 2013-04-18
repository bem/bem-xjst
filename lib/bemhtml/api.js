var bemhtml = require('../bemhtml');

exports.translate = function translate(ast, options) {
  return new bemhtml.Compiler(options).translate(ast);
};

exports.generate = function generate(code, options) {
  return new bemhtml.Compiler(options).generate(code);
};

exports.compile = function compile(code, options) {
  return new bemhtml.Compiler(options).compile(code);
};
