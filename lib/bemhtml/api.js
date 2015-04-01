var bemhtml = require('../bemhtml');

exports.generate = function generate(code, options) {
  return new bemhtml.Compiler(options).generate(code);
};

exports.compile = function compile(code, options) {
  return new bemhtml.Compiler(options).compile(code);
};
