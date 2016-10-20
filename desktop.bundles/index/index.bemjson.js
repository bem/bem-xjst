var package = require('../../package.json'),
    BEMXJST_VERSION = package.version,
    GITHUB_URL = package.repository.url,
    fs = require('fs'),
    defaults = {
        bemhtml: fs.readFileSync('default_bemhtml.js', 'utf8'),
        bemjson: fs.readFileSync('default_bemjson.js', 'utf8')
    };

module.exports = {
    block: 'page',
    title: 'BEM-XJST ' + BEMXJST_VERSION + ' Demo',
    head: [
        { elem: 'meta', attrs: { name: 'viewport', content: 'width=device-width, initial-scale=1' } },
        { elem: 'css', url: 'xindex.css' }
    ],
    scripts: [
        { elem: 'js', url: 'xindex.js' },
        { elem: 'js', url: 'xindex.browser.bemhtml.js' },
        { elem: 'js', url: 'https://cdnjs.cloudflare.com/ajax/libs/ace/1.2.2/ace.js' },
        { elem: 'js', url: 'https://apis.google.com/js/client.js' }
    ],
    content: [
        {
            block: 'header',
            mix: { block: 'page', elem: 'header' },
            content: [
                {
                    elem: 'title',
                    content: [
                        {
                            elem: 'link',
                            url: 'https://github.com/bem/bem-xjst/',
                            content: 'BEM-XJST'
                        },
                        ' Demo'
                    ]
                },
                {
                    elem: 'misc',
                    content: [
                        {
                            block: 'version-selector',
                            mix: { block: 'header', elem: 'item' },
                            mods: { state: 'loading' },
                            versions: [
                                { name: "8.3.1", hash: "61050a14ebee85b44658e5a3f8a9a293baf1fcb1" },
                                { name: "8.2.0", hash: "f2fe3a24fa622f1f1525e8488f7421a695a47b32" },
                                { name: "8.1.0", hash: "c3ee07ae700b201e542e01ef8284df2c434b4da3" },
                                { name: "8.0.0", hash: "3a173128a2c48c00a0d2b39675c2697528d1586f" },
                                { name: "7.3.0", hash: "18657319611b03955ffff6cd605e44a83d5e95e7" },
                                { name: "7.2.0", hash: "4bb2278bce08d5d8eedabe4697dd3181d4dace5e" },
                                { name: "7.1.0", hash: "f923acfcdb13f9b87f14eeea19a54e90fede7ec4" },
                                { name: "7.0.3", hash: "9ab35c851867276e68465f52db6e1ed3ddd015be" },
                                { name: "6.5.5", hash: "71679f146dd10eeba2b7600fff243d74462bd8b2" },
                                { name: "6.4.3", hash: "f3c11eb332a3642b297ffa99b89650757d57c32c" },
                                { name: "6.3.1", hash: "ba4456962e0c458ddd1a42c599fa8403803b2175" },
                                { name: '6.2.0', hash: '5427c34b03bc805a5578a714cbd645f388f415a7' },
                                { name: '6.1.0', hash: '1b8cd3ba9cbc2ef71b8bf87c83f869449b1ef6ac' },
                                { name: '6.0.1', hash: '128a78910f92a28227533bf59abd1f816f2a4fc2' },
                                { name: '5.1.0', hash: '255b93952490c78e825bbbe799ebe4c3dbd85316' },
                                { name: '5.0.0', hash: '56efa7b910025064083f9a0468e5d60907e57b5e' },
                                { name: '4.3.4', hash: 'c9356910da4497be35db09e2786e7a6d3996aac4' },
                                { name: '4.3.3', hash: '78e08d58d285dd3529f3f39e53da3194df886e8b' },
                                { name: '4.3.1', hash: 'eb84226926d737bcdf406824ea1d1585912397cc' }
                            ]
                        },
                        {
                            elem: 'item',
                            content: [
                                'Engine:',
                                'BEMHTML' // TODO: engine select
                            ].join(' ')
                        },
                        {
                            block: 'link',
                            mix: { block: 'header', elem: 'item' },
                            url: 'https://github.com/bem/bem-xjst/tree/master/docs/ru',
                            target: '_blank',
                            content: 'Documentation'
                        },
                        {
                            block: 'link',
                            mix: { block: 'header', elem: 'item' },
                            url: 'https://github.com/bem/bem-xjst/releases/',
                            target: '_blank',
                            content: 'Changelog'
                        },
                        {
                            block: 'share',
                            mix: { block: 'header', elem: 'item' },
                            url: '/',
                            content: 'Share link'
                        }
                    ]
                }
            ]
        },
        {
            block: 'demo',
            js: {
                version: BEMXJST_VERSION + '_2' // инвалидация дефолтных значений
            },
            mods: { state: 'loading' },
            content: [
                {
                    elem: 'content',
                    content: [
                        {
                            elem: 'top',
                            content: [
                                {
                                    block: 'editor',
                                    mix: { block: 'demo', elem: 'bemjson' },
                                    code: defaults.bemjson
                                },
                                {
                                    block: 'editor',
                                    mix: { block: 'demo', elem: 'bemhtml' },
                                    code: defaults.bemhtml
                                }
                            ]
                        },
                        {
                            elem: 'bottom',
                            content: {
                                block: 'editor',
                                js: {
                                    readOnly: true,
                                    showInvisibles: true,
                                    mode: 'ace/mode/html',
                                    showGutter: false
                                },
                                mix: { block: 'demo', elem: 'html' },
                                code: ''
                            }
                        }
                    ]
                },
                {
                    elem: 'paranja',
                    content: {
                        elem: 'spinner',
                        content: {
                            block: 'spin',
                            mods: { visible: true }
                        }
                    }
                }
            ]
        }
    ]
};
