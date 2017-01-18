var log = require('./logger');

function Transformer() {
  this.init();
};

Transformer.prototype.init = function() {};

Transformer.prototype.description = '';

Transformer.prototype.replace = function(ret) {
  return ret;
};

Transformer.prototype.find = function(file) {
  return file;
};

Transformer.prototype.run = function(file, api, opts) {
  var j = api.jscodeshift;
  var ret = this.find(file, j);
  var config = opts.config ? require(opts.config) : {};

  if (!config.quote) config.quote = 'single';

  if (opts.lint) {
    if (ret.length === 0) return;
    this.log(ret, file);
    return;
  }

  return this.replace(ret, j).toSource(config);
};

Transformer.prototype.log = function(ret, file) {
  var t = this;

  ret.forEach(function(p) {
    log({
      descr: t.description,
      path: p.value,
      ret: ret,
      file: file
    });
  });
};

module.exports = Transformer;
