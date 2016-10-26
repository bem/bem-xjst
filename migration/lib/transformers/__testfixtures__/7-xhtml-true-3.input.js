var bemhtml = require('bem-xjst').bemhtml;

var templates = bemhtml.compile(function() {}, {
  test: 1,
  xhtml: false
});

var html = bemhtml.apply({ block: 'page' });
