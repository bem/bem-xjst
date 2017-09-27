var fs = require('fs');
var bemxjst = require('../../../');
const BUNDLE = 'bundle.bemhtml.js';
const TMPL = 'b1.bemhtml.js';

var bundle = bemxjst.bemhtml.generate(fs.readFileSync(TMPL, 'utf8'), {
    to: BUNDLE,
    sourceMap: { from: TMPL, include: false }
});

// Create bundle with bem-xjst enginge and templates
fs.writeFileSync(BUNDLE,
    'require(\'source-map-support\').install();' +
    bundle.content +
    'bemhtml.apply({block:"b1"});\n//# sourceMappingURL=' + BUNDLE + '.map');

// Create source map file
fs.writeFileSync(BUNDLE + '.map', JSON.stringify(bundle.sourceMap, null, '\t'));
