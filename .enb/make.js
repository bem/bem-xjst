var techs = {
        // essential
        fileProvider: require('enb/techs/file-provider'),
        fileMerge: require('enb/techs/file-merge'),

        // optimization
        borschik: require('enb-borschik/techs/borschik'),

        // css
        stylus: require('enb-stylus/techs/stylus'),

        // js
        browserJs: require('enb-js/techs/browser-js'),
        // bemhtml
        bemhtml: require('enb-bemxjst/techs/bemhtml'),
        bemhtmlRuntime: require('./techs/bemhtml-runtime'),
        htmlFromBemjson: require('enb-bemxjst/techs/bemjson-to-html')
    },
    enbBemTechs = require('enb-bem-techs'),
    levels = [
        { path: 'libs/bem-core/common.blocks', check: false },
        { path: 'libs/bem-core/desktop.blocks', check: false },
        { path: 'libs/bem-components/common.blocks', check: false },
        { path: 'libs/bem-components/desktop.blocks', check: false },
        { path: 'libs/bem-components/design/common.blocks', check: false },
        { path: 'libs/bem-components/design/desktop.blocks', check: false },
        'common.blocks'
    ];

module.exports = function(config) {
    var isProd = process.env.YENV === 'production';

    config.nodes('*.bundles/*', function(nodeConfig) {
        nodeConfig.addTechs([
            // essential
            [enbBemTechs.levels, { levels: levels }],
            [techs.fileProvider, { target: '?.bemjson.js' }],
            [enbBemTechs.bemjsonToBemdecl],
            [enbBemTechs.deps],
            [enbBemTechs.files],

            // css
            [techs.stylus, {
                autoprefixer: {
                    browsers: ['last 2 versions']
                }
            }],

            // bemhtml
            [techs.bemhtml, {
                sourceSuffixes: ['bemhtml', 'bemhtml.js']
            }],

            [techs.bemhtmlRuntime, {
                target: '?.browser.bemhtml.js',
                sourceSuffixes: ['bemhtml.js']
            }],

            [techs.htmlFromBemjson],

            // js
            [techs.browserJs, {
                target: '?.js',
                includeYM: true
            }],

            // borschik
            [techs.borschik, { sourceTarget: '?.js', destTarget: '_?.js', freeze: true, minify: isProd }],
            [techs.borschik, { sourceTarget: '?.browser.bemhtml.js', destTarget: '_?.browser.bemhtml.js', freeze: true, minify: isProd }],
            [techs.borschik, { sourceTarget: '?.css', destTarget: '_?.css', freeze: true, minify: isProd }]
        ]);

        nodeConfig.addTargets(['?.html', '_?.browser.bemhtml.js', '_?.css', '_?.js']);
    });
};
