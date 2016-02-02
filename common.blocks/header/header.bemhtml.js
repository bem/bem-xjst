block('header')(
    tag()('h1'),
    elem('link').replace()(function() {
        return {
            block: 'link',
            url: this.ctx.url,
            content: this.ctx.content
        };
    })
);
