var bemhtml = require('bem-xjst').bemhtml;

var templates = bemhtml.compile(function() {}, {
  xhtml: true
});

var html = bemhtml.apply({ block: 'page' });
