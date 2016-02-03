var bemhtml = require('bem-xjst').bemhtml;
var bundle = bemhtml.generate();

module.exports = require('enb/lib/build-flow').create()
    .name('bemxjst')
    .target('target', '?.bemxjst.js')
    .builder(function() {
        return bundle.replace('api.exportApply(exports);', '');
    })
    .createTech();
