modules.define('demo', [ 'i-bem__dom', 'pretty', 'functions__debounce', 'querystring' ], function(provide, BEMDOM, pretty, debounce, qs) {

    provide(BEMDOM.decl('demo', {
        onSetMod: {
            js: {
                inited: function() {
                    
                    var bPage = this.findBlockOutside('page');
                    
                    this._versionSelect = bPage.findBlockInside('version-selector');
                    this._engineSelect = bPage.findBlockInside('engine-selector');
                    this._templates = this.findBlockOn('templates', 'editor');
                    this._bemjson = this.findBlockOn('bemjson', 'editor');
                    this._result = this.findBlockOn('result', 'editor');
                    this._debouncedOnChange = debounce(this._onChange, 150, this);

                    this._templates.on('change', this._debouncedOnChange);
                    this._bemjson.on('change', this._debouncedOnChange);

                    this._versionSelect.on('ready', function() {
                        this._load();
                        this.setMod('state', 'loaded');
                    }, this);
                }
            }
        },
        _onChange: function() {
            this._render();
            this.save();
        },
        _getTemplate: function() {
            return this._templates.getValue();
        },
        _getBEMJSON: function() {
            return this._bemjson.getValue();
        },
        changeEngine: function(name) {
            this._engine = window[name];
            this._render();
        },

        _render: function() {
            try {
                var api = new this._engine({}),
                    template = {};

                api.compile(this._getTemplate());
                api.exportApply(template);
            } catch(e) {
                this._result.setValue('Template error: ' + e.message + '\n' + e.stack);
                return;
            }

            var BEMJSON = safeEval(this._getBEMJSON());

            if (BEMJSON instanceof Error) {
                this._result.setValue('BEMJSON error: ' + BEMJSON.message + '\n' + BEMJSON.stack);
                return;
            }

            var finalCode = template.apply(BEMJSON);
            if (this._engine === BEMHTML) {
                finalCode = pretty(finalCode, {max_char: 1000});
            }
            this._result.setValue(finalCode);
        },
        save: function() {
            store.set('playground', this._getState());
            history.pushState({}, document.title, location.pathname + '?' + qs.stringify(this._getState()));
        },
        _load: function() {
            var data = parseParams(location.search.split('?')[1]) ||
                this._getStateFromCache() ||
                this._getState();

            this._setState(data);
        },
        _getStateFromCache: function() {
            var cache = store.get('playground') || {};

            if (this.params.version !== cache.version) {
                return null;
            }
            return cache;
        },
        _getState: function() {
            return {
                version: this._versionSelect.getValue(),
                engine: this._engineSelect.getValue(),
                template: this._getTemplate(),
                bemjson: this._getBEMJSON()
            };
        },
        _setState: function(data) {
            this._templates.setValue(data.template);
            this._bemjson.setValue(data.bemjson);
            this._versionSelect.setValue(data.version);
            this._engineSelect.setValue(data.engine);
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

            // Support param 'bemhtml' as alias param 'template'
            if (hash[0] === 'bemhtml') {
                hash[0] = 'template';
            }

            // Allow plus sign as a space
            ret[hash[0]] = decodeURIComponent(hash[1].replace(/\+/g, ' '));
        }

        return ret;
    }

    function safeEval(str) {
        try {
            return (new Function('return ' + str.trim()))();
        } catch(e) {
            return e;
        }
    }

});
