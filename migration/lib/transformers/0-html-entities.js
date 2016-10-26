module.exports = function(file, api, opts) {
  var j = api.jscodeshift;

  var ret = j(file.source)
    .find(j.Literal)
    .filter(function(p) {
      return /\&[\w\D]+;/.test(p.value.value);
    });

  if (opts.lint) {
    if (ret.length === 0)
      return;

    ret.forEach(function(p) {
      log({
        descr: 'Use UTF-8 symbols instead of HTML entities. If you turn on escaping this code will be broken. With non visible UTF-8 symbols like non breaking space you can leave verbose comment in code.',
        path: p.value,
        ret: ret,
        file: file
      });
    });
  }
};
