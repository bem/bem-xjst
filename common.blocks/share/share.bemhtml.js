block('share').replace()(function() {
    return [
        {
            block: 'link',
            mix: {
                block: 'share',
                js: true
            },
            url: this.ctx.url,
            content: this.ctx.content
        },
        { block: 'share', elem: 'short-link' }
    ];
});

block('share').elem('short-link').tag()('input');
