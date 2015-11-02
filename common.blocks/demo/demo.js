modules.define('demo', ['i-bem__dom', 'pretty', 'functions__debounce'], function(provide, BEMDOM, pretty, debounce) {

    var CURRENT_VERSION = '4.2.5';

    function notEval(str) {
        try {
            return (new Function('return ' + str))();
        } catch(e) {
            return e;
        }
    }

    provide(BEMDOM.decl('demo', {
        onSetMod : {
            'js' : {
                'inited' : function() {

                    this._bemhtml = this.findBlockOn('bemhtml', 'editor');
                    this._bemjson = this.findBlockOn('bemjson', 'editor');
                    this._html = this.findBlockOn('html', 'editor');

                    this._debouncedOnChange = debounce(this._onChange, 150, this);

                    this._bemhtml.on('change', this._debouncedOnChange);
                    this._bemjson.on('change', this._debouncedOnChange);

                    this._load() || this._render();

                    this.findBlockInside('spin').delMod('visible');
                    this.delMod('state');

                    setTimeout(function() {
                        this.setMod('state', 'loaded');
                    }.bind(this), 150);

                }
            }
        },
        _onChange : function() {
            this._render();
            this._save();
        },
        _getBEMHTML : function() {
            return this._bemhtml.getValue();
        },
        _getBEMJSON : function() {
            return this._bemjson.getValue();
        },
        _render : function() {

            try {

                var api = new BEMHTML({}),
                    bemhtml = {};

                api.compile(this._getBEMHTML());
                api.exportApply(bemhtml);

            } catch(e) {
                this._html.setValue('BEMHTML error: ' + e.message + '\n' + e.stack);
                return;
            }

            var BEMJSON = notEval(this._getBEMJSON());

            if (BEMJSON instanceof Error) {
                this._html.setValue('BEMJSON error: ' + BEMJSON.message + '\n' + BEMJSON.stack);
                return;
            }

            this._html.setValue(pretty(bemhtml.apply(BEMJSON)));

        },
        _save : function() {
            store.set('playground', {
                version: CURRENT_VERSION,
                bemhtml: this._getBEMHTML(),
                bemjson: this._getBEMJSON()
            });
        },
        _load : function() {
            var data = store.get('playground');
            if (!data || data.version !== CURRENT_VERSION) {
                return false;
            }
            if (data.bemhtml) {
                this._bemhtml.setValue(data.bemhtml);
            }
            if (data.bemjson) {
                this._bemjson.setValue(data.bemjson);
            }
            return !!(data.bemhtm || data.bemjson)
        }
    }, {}));

});
