block('header')(
    elem('title').tag()('h1'),
    elem('link').replace()(function() {
        return {
            block: 'link',
            url: this.ctx.url,
            content: this.ctx.content
        };
    })
);
