block('header')(
    tag()('h1'),
    elem('link').def()(function() {
        return applyCtx({
            block: 'link',
            url: this.ctx.url,
            content: this.ctx.content
        });
    })
);
