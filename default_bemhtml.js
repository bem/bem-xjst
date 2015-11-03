block('button')(
    tag()('button'),
    attrs()(function() {
        return {
            role: 'button',
            name: this.ctx.name
        };
    }),
    content()(
        function() {
            var ctx = this.ctx,
                content = [ctx.icon];
            'text' in ctx && content.push({ elem: 'text', content: ctx.text });
            return content;
        },
        match(function() { return typeof this.ctx.content !== 'undefined'; })(function() {
            return this.ctx.content;
        })
    )
);

block('icon')(
    tag()('span'),
    attrs()(function() {
        var attrs = {},
            url = this.ctx.url;
        if (url) attrs.style = 'background-image:url(' + url + ')';
        return attrs;
    })
);
