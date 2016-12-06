var xjst = require('bem-xjst');
var bemhtml = xjst.bemhtml.generate();
var bemtree = xjst.bemtree.generate('', { exportName: 'BEMTREE' });

module.exports = require('enb/lib/build-flow').create()
    .name('bemxjst')
    .target('target', '?.bemxjst.js')
    .builder(function() {
        return bemhtml.replace('api.exportApply(exports);', '')
            .concat(bemtree).replace('api.exportApply(exports);', '');
    })
    .createTech();
