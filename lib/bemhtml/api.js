var bemhtml = require('../bemhtml');

exports.generate = function(code, options) {
  return new bemhtml.Compiler(options).generate(code, options);
};

exports.compile = function(code, options) {
  return new bemhtml.Compiler(options).compile(code);
};
