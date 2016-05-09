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
        bemxjst: require('./techs/bemxjst'),
        htmlFromBemjson: require('enb-bemxjst/techs/bemjson-to-html'),
        babel: require('enb-babel/techs/js-babel'),
        prependModules: require('enb-babel/techs/prepend-modules')
    },
    enbBemTechs = require('enb-bem-techs'),
    levels = [
        { path: 'libs/bem-core/common.blocks', check: false },
        { path: 'libs/bem-core/desktop.blocks', check: false },
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

            [techs.bemxjst, {
                target: '?.browser.bemhtml.js',
                sourceSuffixes: ['bemhtml.js']
            }],

            [techs.htmlFromBemjson],

            // js
            [ techs.babel, {
                target: '?.es5.js'
            }],
            
            [ techs.prependModules, {
                source: '?.es5.js',
                target: '?.browser.js'
            }],

            // borschik
            [techs.borschik, { sourceTarget: '?.browser.js', destTarget: 'x?.js', freeze: true, minify: isProd }],
            [techs.borschik, { sourceTarget: '?.browser.bemhtml.js', destTarget: 'x?.browser.bemhtml.js', freeze: true, minify: isProd }],
            [techs.borschik, { sourceTarget: '?.css', destTarget: 'x?.css', freeze: true, minify: isProd }]
        ]);

        nodeConfig.addTargets(['?.html', 'x?.browser.bemhtml.js', 'x?.css', 'x?.js']);
    });
};
