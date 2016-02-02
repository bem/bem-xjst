block('link')(
    tag()('a'),
    attrs()(function() {
        return {
            target: this.ctx.target,
            href: this.ctx.url
        };
    })
);
