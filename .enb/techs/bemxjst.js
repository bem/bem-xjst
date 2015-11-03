var bemxjst = require('bem-xjst').generate;

module.exports = require('enb/lib/build-flow').create()
    .name('bemxjst')
    .target('target', '?.bemxjst.js')
    .builder(function() {
        return bemxjst('').replace('api.exportApply(exports);', '');
    })
    .createTech();
