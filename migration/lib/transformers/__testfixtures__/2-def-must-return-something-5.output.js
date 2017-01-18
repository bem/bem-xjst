block('username').def()(function() {
    var size = this.ctx.size || 3;

    return applyCtx([
        {
            block: 'font',
            mods: { color: 'accent' },
            size: size,
            content: this.ctx.content[0]
        },
        {
            block: 'font',
            color: '#000000',
            size: size,
            content: this.ctx.content.substr(1)
        }
    ]);
});
