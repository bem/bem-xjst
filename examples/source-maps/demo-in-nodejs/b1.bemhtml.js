block('b1').tag()('blah');
block('b1').content()(function() {
    return this.ctx.a.b.c;
});
