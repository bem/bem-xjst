modules.define('version-selector', [ 'i-bem__dom', 'querystring' ], function(provide, BEMDOM, qs) {

    provide(BEMDOM.decl('version-selector', {
        onSetMod: {
            js: {
                inited: function() {

                    var bPage = this.findBlockOutside('page');
                    var bDemo = bPage.findBlockInside('demo');
                    var bEngineSelector = bPage.findBlockInside('engine-selector');
                    var d = document;
                    var selector = this.params;
                    var transport;
                    var URL = 'https://rawgit.com/miripiruni/bem-xjst/';
                    var FILE = '/xindex.browser.bemhtml.js';
                    var TRANSPORT_ID = 'transport';
                    var select = this;

                    window.onpopstate = function(event) {
                        var ver = encodeURIComponent(qs.parse(location.href).version || '');

                        if (!ver) {
                            ver = JSON.parse(select.dataset.bem);
                            ver = ver['version-selector'].default.hash;
                        }

                        select.setValue(ver);
                    };

                    select.domElem.on('change', function(e) {
                        var val = e.target.value;
                        var freeze = function() {
                                transport && d.getElementById(TRANSPORT_ID).remove();
                                var demo = document.getElementsByClassName('demo')[0];
                                demo.classList.remove('demo_state_loaded');
                                demo.classList.add('demo_state_loading');
                            },
                            unfreeze = function() {
                                var demo = document.getElementsByClassName('demo')[0];
                                bDemo.changeEngine(bEngineSelector.domElem[0].value);
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
                        bDemo.save();
                    });
                    this.emit('ready');
                }
            }
        },

        setValue: function(value) {
            this.domElem.val(value).trigger('change');
            return this;
        },

        getValue: function() {
            return this.domElem.val();
        }
    }, {}));

});
