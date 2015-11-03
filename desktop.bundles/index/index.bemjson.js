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
        { elem: 'js', url: 'https://cdnjs.cloudflare.com/ajax/libs/ace/1.2.2/ace.js' }
    ],
    content: [
            {
            elem: 'header',
            content: {
                block: 'header',
                version: BEMXJST_VERSION
            }
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
        },
        {
            block: 'github-fork-ribbon',
            url: GITHUB_URL,
            text: 'Fork me on GitHub'
        }
    ]
};
