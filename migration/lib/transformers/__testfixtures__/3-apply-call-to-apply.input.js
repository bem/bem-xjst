var bemhtml = require('bem-xjst').bemhtml;

var templates = bemhtml.compile(function() {});

var html = bemhtml.apply.call({ block: 'page' });

var apply = bemhtml.apply;

apply.call({ block: 'page' });
