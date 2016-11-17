var fixtures = require('./fixtures');
var test = fixtures.test;

describe('BEMContext ctx object: tests for expected fields', function() {
  it('should support this.ctx.content', function() {
    test(function() {
      block('b').def()(function() {
        return this.ctx.content;
      });
    },
    { block: 'b', content: 'Hello' },
    'Hello');
  });

  it('should support this.ctx.cls', function() {
    test(function() {
      block('b').def()(function() {
        return this.ctx.cls;
      });
    },
    { block: 'b', cls: 'btn' },
    'btn');
  });

  it('should support this.ctx.bem', function() {
    test(function() {
      block('b').def()(function() {
        return this.ctx.bem.toString();
      });
    },
    { block: 'b', bem: false },
    'false');
  });

  it('should support this.ctx.js', function() {
    test(function() {
      block('b').def()(function() {
        return this.ctx.js.toString();
      });
    },
    { block: 'b', js: true },
    'true');
  });

  // TODO: нужно больше кейсов про вложенный BEMJSON
  it('should support this.ctx.block', function() {
    test(function() {
      block('b').def()(function() {
        return this.ctx.block;
      });
    },
    { block: 'b' },
    'b');
  });

  it('should support this.ctx.elem', function() {
    test(function() {
      block('b').elem('e').def()(function() {
        return this.ctx.elem;
      });
    },
    { block: 'b', elem: 'e' },
    'e');
  });

  it('should support this.ctx.mod', function() {
    test(function() {
      block('b').def()(function() {
        return this.ctx.mods.m;
      });
    },
    { block: 'b', mods: { m: 'v' } },
    'v');
  });

  it('should support this.ctx.elemMods', function() {
    test(function() {
      block('b').elem('e').def()(function() {
        return this.ctx.elemMods.m;
      });
    },
    { block: 'b', elem: 'e', elemMods: { m: 'v' } },
    'v');
  });

  it('should support this.ctx.attrs', function() {
    test(function() {
      block('b').def()(function() {
        return this.ctx.attrs.a;
      });
    },
    { block: 'b', attrs: { a: 'b' } },
    'b');
  });

  it('should support this.ctx.mix', function() {
    test(function() {
      block('b').def()(function() {
        return this.ctx.mix.block;
      });
    },
    { block: 'b', mix: { block: 'mixed' } },
    'mixed');
  });

  it('should support this.ctx.tag', function() {
    test(function() {
      block('b').def()(function() {
        return this.ctx.tag;
      });
    },
    { block: 'b', tag: 'a' },
    'a');
  });

  it('should support custom fields in this.ctx', function() {
    test(function() {
      block('b').def()(function() {
        return this.ctx.user;
      });
    },
    { block: 'b', user: 'omg' },
    'omg');
  });
});
