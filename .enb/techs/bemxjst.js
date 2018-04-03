var xjst = require('bem-xjst');
var bemhtml = xjst.bemhtml.generate('', { exportName: 'BEMHTML' });
var bemtree = xjst.bemtree.generate('', { exportName: 'BEMTREE' });

module.exports = require('enb/lib/build-flow').create()
    .name('bemxjst')
    .target('target', '?.bemxjst.js')
    .builder(function() {
        return bemhtml
            //.replace('api.exportApply(exports);', '')
            .replace('if (typeof modules === "object") {', 'if (false && typeof modules === "object") {')
            .replace('BEMHTML = buildBemXjst(_libs)', 'BEMHTML = buildBemXjst')
            .replace('BEMHTML= buildBemXjst(glob)', 'BEMHTML = buildBemXjst')
            .concat(bemtree)
            //.replace('api.exportApply(exports);', '')
            .replace('if (typeof modules === "object") {', 'if (false && typeof modules === "object") {')
            .replace('BEMTREE = buildBemXjst(_libs)', 'BEMTREE = buildBemXjst')
            .replace('BEMTREE= buildBemXjst(glob)', 'BEMTREE = buildBemXjst')
            .concat(require('./i18n'));
    })
    .createTech();
