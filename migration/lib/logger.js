module.exports = function logger(opts) {
  'use strict';
  var file = opts.file;
  var path = opts.path;
  var start = path.loc.start;

  console.warn([
    'BEM-XJST WARNING:',
    opts.descr,
    [ file.path, start.line, start.column ].join(':'),
    file.source.slice(path.start, path.end),
    '\n'
  ].join('\n>>>>'));
};
