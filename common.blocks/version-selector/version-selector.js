modules.define('version-selector', [ 'i-bem__dom', 'querystring' ], function(provide, BEMDOM, qs) {

    provide(BEMDOM.decl('version-selector', {
        onSetMod: {
            js: {
                inited: function() {

                    var d = document;
                    var selector = this.params;
                    var transport;
                    var URL = 'https://rawgit.com/miripiruni/bem-xjst/';
                    var FILE = '/xindex.browser.bemhtml.js';
                    var TRANSPORT_ID = 'transport';
                    var select = d.getElementsByClassName('version-selector')[0];

                    window.onpopstate = function(event) {
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
                            },
                            freeze = function() {
                                transport && d.getElementById(TRANSPORT_ID).remove();
                                var demo = document.getElementsByClassName('demo')[0];
                                demo.classList.remove('demo_state_loaded');
                                demo.classList.add('demo_state_loading');
                            },
                            unfreeze = function() {
                                var demo = document.getElementsByClassName('demo')[0];
                                demo.classList.remove('demo_state_loading');
                                demo.classList.add('demo_state_loaded');
                            };

                        freeze();

                        transport = d.createElement('script');
                        transport.id = TRANSPORT_ID;
                        transport.src = URL + val + FILE;
                        d.body.appendChild(transport);

                        transport.onload = function() {
                            unfreeze();
                        };

                        transport.onerror = function() {
                            console.error('Unable to load ' + this.src);
                            unfreeze();
                        };

                        var params = parseParams(location.search.replace('?', ''));
                        // TODO (miripiruni): params.version = this.selectedOptions[0].innerText;
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
