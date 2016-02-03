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
    title: 'BEM-XJST ' + BEMXJST_VERSION + ' online demo',
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
                        ' Online Demo'
                    ]
                },
                {
                    elem: 'misc',
                    content: [
                        {
                            block: 'version-selector',
                            mods: { state: 'loading' },
                            versions: [
                                { name: '5.0.0', hash: '56efa7b910025064083f9a0468e5d60907e57b5e' },
                                { name: '4.3.4', hash: 'c9356910da4497be35db09e2786e7a6d3996aac4' },
                                { name: '4.3.3', hash: '78e08d58d285dd3529f3f39e53da3194df886e8b' },
                                { name: '4.3.1', hash: 'eb84226926d737bcdf406824ea1d1585912397cc' }
                            ]
                        },
                        {
                            block: 'link',
                            url: 'https://github.com/bem/bem-xjst/releases/',
                            target: '_blank',
                            content: 'Changelog'
                        },
                        {
                            block: 'share',
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
