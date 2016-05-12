block('engine-selector')(
    tag()('select'),

    js()(function() {
        return {
            default: this.ctx.engines[0]
        };
    }),

    content()(function() {
        return this.ctx.engines.map(function(item) {
            return {
                tag: 'option',
                attrs: { value: item.toLowerCase() },
                content: item
            };
        });
    })
);
