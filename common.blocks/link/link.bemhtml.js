block('link')(
    tag()('a'),
    attrs()(function() {
        return {
            href: this.ctx.url
        };
    })
);
