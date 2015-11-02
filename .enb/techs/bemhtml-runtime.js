var bemxjst = require('enb-bemxjst/lib/bemxjst-processor');

module.exports = require('enb-bemxjst/techs/bem-xjst').buildFlow()
    .name('bemhtml-runtime')
    .target('target', '?.bemhtml.js')
    .defineOption('exportName', 'BEMHTML')
    .defineOption('naming')
    .defineOption('requires', {})
    .useFileList(['bemhtml.js'])
    .builder(function(fileList) {
        return bemxjst('').replace('api.exportApply(exports);', '');
    })
    .createTech();
