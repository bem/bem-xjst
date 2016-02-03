modules.define('version-selector', [ 'i-bem__dom', 'querystring' ], function(provide, BEMDOM, qs) {

    provide(BEMDOM.decl('version-selector', {
        onSetMod: {
            js: {
                inited: function() {

                    var d = document;
                    var w = window;
                    var selector = this.params;
                    var transport;
                    var URL = 'https://rawgit.com/miripiruni/bem-xjst/';
                    var FILE = '/xindex.browser.bemhtml.js';
                    var TRANSPORT_ID = 'transport';
                    var select = d.getElementsByClassName('version-selector')[0];

                    w.onpopstate = function(event) {
                        var ver = encodeURIComponent(qs.parse(location.href).bemxjst_version || '');
                        var select = d.getElementsByClassName('version-selector')[0];

                        if (!ver) {
                            ver = JSON.parse(select.dataset.bem);
                            ver = ver['version-selector'].default.hash;
                        }

                        select.value = ver;
                    };

                    select.onchange = function onVersionChange(e) {
                        var val = e.target.value;
                        var parseParams = function parseParams(params) {
                                var ret = {},
                                    hash,
                                    hashes = params && params.split('&');

                                if (!params) {
                                    return;
                                }

                                for (var i = 0; i < hashes.length; i++) {
                                    hash = hashes[i].split('=');
                                    // Allow plus sign as a space
                                    ret[hash[0]] = decodeURIComponent(hash[1].replace(/\+/g, ' '));
                                }

                                return ret;
                            };

                        transport && d.getElementById(TRANSPORT_ID).remove();
                        transport = d.createElement('script');
                        transport.id = TRANSPORT_ID;
                        transport.src = URL + val + FILE;
                        d.body.appendChild(transport);

                        var params = parseParams(location.search.replace('?', ''));
                        params.bemxjst_version = val;
                        params.toString = function() {
                            var params = this;

                            return Object.keys(this)
                                .filter(function(p) { return p !== 'toString'; })
                                .map(function(p) {
                                    return p + '=' + encodeURIComponent(params[p]);
                                }).join('&');
                        };

                        history.pushState({}, d.title, location.pathname + '?' + params.toString());

                    };

                }
            }
        }
    }, {}));

});
