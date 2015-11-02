modules.define('editor', ['i-bem__dom'], function(provide, BEMDOM) {

    provide(BEMDOM.decl('editor', {
        onSetMod: {
            js: {
                inited: function() {

                    var editor = ace.edit(this.elem('textarea').get(0));

                    editor.setTheme('ace/theme/solarized_light');
                    editor.setShowInvisibles(this.params.showInvisibles);
                    editor.setReadOnly(this.params.readOnly);
                    editor.setFontSize(this.params.fontSize);
                    editor.setShowPrintMargin(false);
                    editor.$blockScrolling = Infinity;
                    editor.getSession().setMode(this.params.mode);

                    editor.on('change', function(e) {
                        this.emit('change');
                    }.bind(this));

                    this._editor = editor;

                }
            }
        },
        getDefaultParams: function() {
            return {
                fontSize: '14px',
                mode: 'ace/mode/javascript'
            };
        },
        getValue: function() {
            return this._editor.getSession().getValue();
        },
        setValue: function(value) {
            this._editor.getSession().setValue(value);
            return this;
        }
    }, {}));

});
