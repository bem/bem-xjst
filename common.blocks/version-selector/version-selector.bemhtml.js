block('version-selector')(
    tag()('select'),

    js()(function() {
        return {
            default: this.ctx.versions[0],
            versions: this.ctx.versions
        };
    }),

    content()(function() {
        return this.ctx.versions.map(function(item) {
            return {
                tag: 'option',
                attrs: { value: item.name },
                content: item.name
            };
        });
    })
);
