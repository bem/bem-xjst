var bemhtml = require('bem-xjst').bemhtml;

var templates = bemhtml.compile(function() {}, {
  someOption: 1
});

var html = bemhtml.apply({ block: 'page' });
