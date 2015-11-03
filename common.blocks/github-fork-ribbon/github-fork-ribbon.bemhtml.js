block('github-fork-ribbon').content()(function() {
    return {
        elem: 'ribbon',
        content: {
            block: 'link',
            mix: { block: 'github-fork-ribbon', elem: 'link' },
            url: this.ctx.url,
            content: this.ctx.text
        }
    };
});