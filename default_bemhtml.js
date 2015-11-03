block('char')(
    content()(function() {
        return [
            this.position,
            ' — ',
            this.ctx.char
        ];
    })
);