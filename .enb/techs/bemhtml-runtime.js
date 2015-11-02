var bemxjst = require('enb-bemxjst/lib/bemxjst-processor');

module.exports = require('enb-bemxjst/techs/bem-xjst').buildFlow()
    .name('bemhtml-runtime')
    .target('target', '?.bemhtml.js')
    .builder(function() {
        return bemxjst('').replace('api.exportApply(exports);', '');
    })
    .createTech();
