modules.define('demo', [ 'i-bem__dom', 'pretty', 'functions__debounce' ], function(provide, BEMDOM, pretty, debounce) {

    provide(BEMDOM.decl('demo', {
        onSetMod: {
            js: {
                inited: function() {

                    this._page = this.findBlockOutside('page');
                    this._engineSelector = this._page.findBlockInside('engine-selector');
                    this._$engineSelector = this._engineSelector.domElem;

                    var _this = this;
                    this.params.engine = this._$engineSelector.find('option:selected').val();
                    this._$engineSelector.on('change', function() {
                        _this.params.engine = _this._$engineSelector.find('option:selected').val();
                        _this._render();
                    });


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
            try {
                var bemhtml = {};

                var api = (this.params.engine === 'vidom')
                    ? new vidom({})
                    : new BEMHTML({});
                api.compile(this._getBEMHTML());
                api.exportApply(bemhtml);
            } catch(e) {
                this._html.setValue('BEMHTML error: ' + e.message + '\n' + e.stack);
                return;
            }

            var BEMJSON = safeEval(this._getBEMJSON());

            if (BEMJSON instanceof Error) {
                this._html.setValue('BEMJSON error: ' + BEMJSON.message + '\n' + BEMJSON.stack);
                return;
            }

            var compiledText = (this.params.engine === 'vidom') 
                    ? JSON.stringify(bemhtml.apply(BEMJSON), null, 4)
                    : pretty(bemhtml.apply(BEMJSON), { max_char: 1000});
            
            this._html.setValue(compiledText);
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
