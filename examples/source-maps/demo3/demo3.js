var fs = require('fs'),
    bemxjst = require('../../../').bemhtml,
    tmpl = 'b3.bemhtml.js',
    bundle = 'bundle.bemhtml.js';

var result = bemxjst.generate(fs.readFileSync(tmpl, 'utf8'), {
    to: bundle,
    sourceMap: {
      prev: 'block(\'a\').tag()(\'a\');',
      from: tmpl
    },
});

fs.writeFileSync(bundle, result);
