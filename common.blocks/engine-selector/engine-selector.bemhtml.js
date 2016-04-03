block('engine-selector')(
    tag()('select'),

    js()(function() {
        return {
            default: this.ctx.versions[0]
        };
    }),

    content()(function() {
        return this.ctx.versions.map(function(item) {
            return {
                tag: 'option',
                attrs: { value: item.value },
                content: item.name
            };
        });
    })
);
