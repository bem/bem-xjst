module.exports = function logger(opts) {
  var shift = '>>>>'
  console.warn('BEM-XJST WARNING:');
  console.warn(shift, opts.descr);
  var start = opts.path.loc.start;
  console.warn(shift, opts.file.path + ':' + start.line + ':' + start.column);
  console.warn(shift, opts.file.source.slice(opts.path.start, opts.path.end));
  console.warn('\n');
};
