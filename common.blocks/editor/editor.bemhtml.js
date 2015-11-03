block('editor')(
    js()(true),
    content()(function() {
        return {
            elem: 'textarea',
            content: this.ctx.code
        }
    })
);
