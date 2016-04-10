modules.define('demo', [ 'i-bem__dom', 'pretty', 'functions__debounce' ], function(provide, BEMDOM, pretty, debounce) {

    provide(BEMDOM.decl('demo', {
        onSetMod: {
            js: {
                inited: function() {

                    this._page = this.findBlockOutside('page');
                    this._engineSelector = this._page.findBlockInside('engine-selector');
                    this._$engineSelector = this._engineSelector.domElem;

                    this.params.engine = this._$engineSelector.find('option:selected').val();

                    this._$engineSelector.on('change', function() {
                        this.params.engine = this._$engineSelector.find('option:selected').val();
                        this._render();
                    }.bind(this));

                    this._engines = {
                        vidom: vidom,
                        bemhtml: BEMHTML,
                        bemjson: {}
                    };

                    this._bemhtml = this.findBlockOn('bemhtml', 'editor');
                    this._bemjson = this.findBlockOn('bemjson', 'editor');
                    this._html = this.findBlockOn('html', 'editor');

                    this._debouncedOnChange = debounce(this._onChange, 150, this);

                    this._bemhtml.on('change', this._debouncedOnChange);
                    this._bemjson.on('change', this._debouncedOnChange);

                    this._load() || this._render();

                    this.delMod('state');

                    setTimeout(function() {
                        this.setMod('state', 'loaded');
                    }.bind(this), 150);

                }
            }
        },

        _getEngine: function(engineName, engines) {
            var bemhtml = {};
            var compiledText = '';
            var _engine = engines[engineName];
            return {
                render: function (bemjson) {
                    var BEMJSON = safeEval(bemjson);

                    if (BEMJSON instanceof Error) {
                        return 'BEMJSON error: ' + BEMJSON.message + '\n' + BEMJSON.stack;
                    }

                    try {
                        switch (engineName) {
                            case 'vidom':
                            {
                                var api = new _engine({});
                                api.compile(bemjson);
                                api.exportApply(bemhtml);
                                compiledText = JSON.stringify(bemhtml.apply(BEMJSON), null, 4);
                                break;
                            }
                            case 'bemhtml':
                            {
                                var api = new _engine({});
                                api.compile(bemjson);
                                api.exportApply(bemhtml);
                                compiledText = pretty(bemhtml.apply(BEMJSON), {max_char: 1000});
                                break;
                            }
                            case 'bemjson':
                            {
                                compiledText = JSON.stringify(BEMJSON, null, 4);
                                break;
                            }
                        }
                    } catch (e) {
                        return engineName.toUpperCase() + ' error: ' + e.message + '\n' + e.stack;
                    }
                    return compiledText;
                }
            }

        },

        _onChange: function() {
            this._render();
            this._save();
        },
        _getBEMHTML: function() {
            return this._bemhtml.getValue();
        },
        _getBEMJSON: function() {
            return this._bemjson.getValue();
        },
        _render: function() {
            var engine = this._getEngine(this.params.engine, this._engines);
            this._html.setValue(engine.render(this._getBEMJSON()));
        },
        _save: function() {
            var bemhtml = this._getBEMHTML(),
                bemjson = this._getBEMJSON();

            store.set('playground', {
                version: this.params.version,
                bemhtml: bemhtml,
                bemjson: bemjson
            });

            history.pushState({}, document.title, location.pathname + '?' + [
                    'bemhtml=' + encodeURIComponent(bemhtml),
                    'bemjson=' + encodeURIComponent(bemjson)
                ].join('&'));
        },
        _load: function() {
            var data = parseParams(location.search.split('?')[1]) || store.get('playground');

            if (!data || (data.version && data.version !== this.params.version)) {
                return false;
            }

            if (data.bemhtml) {
                this._bemhtml.setValue(data.bemhtml);
            }

            if (data.bemjson) {
                this._bemjson.setValue(data.bemjson);
            }

            return !!(data.bemhtml || data.bemjson)
        }
    }, {}));

    function parseParams(params) {
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
    }

    function safeEval(str) {
        try {
            return (new Function('return ' + str))();
        } catch(e) {
            return e;
        }
    }

});
