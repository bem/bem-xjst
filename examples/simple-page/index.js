var bemxjst = require('bem-xjst');
var data = require('./data');

// In this section we convert JSON from backend to BEMJSON
var bemtreeRuntime = bemxjst
  .bemtree
  .compile(require('./bemtree-templates'));
var bemjson = bemtreeRuntime.apply({ block: 'root', data: data });

// In this section we convert BEMJSON to HTML
var bemhtmlRuntime = bemxjst
  .bemhtml
  .compile(require('./bemhtml-templates'), { xhtml: false });
var html = bemhtmlRuntime.apply(bemjson);

console.log(html);
