var fixtures = require('./fixtures');
var test = fixtures.test;

describe('Runtime apply()', function() {
  it.skip('apply(\'content\') from def()', function() {
    // Test ported from higher major versions
    // this bug already fixed in next versions
    test(function() {
      block('b').def()(function() {
        return apply('content');
      });
    }, { block: 'b', content: 'test' },
    'test');
  });

  it.skip('apply(\'mix\') from def()', function() {
    // Test ported from higher major versions
    // this bug already fixed in next versions
    test(function() {
      block('b').def()(function() {
        return apply('mix');
      });
    }, { block: 'b', mix: 'test' },
    'test');
  });

  it.skip('apply(\'tag\') from tag()', function() {
    // Test ported from higher major versions
    // this bug already fixed in next versions
    test(function() {
      block('b').tag()(function() {
        return 'span';
      });
      block('b').tag()(function() {
        return apply('tag');
      });
    }, { block: 'b', tag: 'a' },
    '<span class="b"></span>');
  });

  it.skip('apply(\'tag\') from def()', function() {
    // Test ported from higher major versions
    // this bug already fixed in next versions
    test(function() {
      block('b').def()(function() {
        return apply('tag');
      });
    }, { block: 'b', tag: 'a' },
    'a');
  });

  it.skip('apply(\'bem\') from def()', function() {
    // Test ported from higher major versions
    // this bug already fixed in next versions
    test(function() {
      block('b').def()(function() {
        return apply('bem');
      });
    }, { block: 'b', bem: false },
    false);
  });

  it.skip('apply(\'cls\') from def()', function() {
    // Test ported from higher major versions
    // this bug already fixed in next versions
    test(function() {
      block('b').def()(function() {
        return apply('cls');
      });
    }, { block: 'b', cls: 'test' },
    'test');
  });

  it.skip('apply(\'attrs\') from def()', function() {
    // Test ported from higher major versions
    // this bug already fixed in next versions
    test(function() {
      block('b').def()(function() {
        return apply('attrs').target;
      });
    }, { block: 'b', attrs: { target: '_blank' } },
    '_blank');
  });

  it.skip('apply(\'js\') from def()', function() {
    // Test ported from higher major versions
    // this bug already fixed in next versions
    test(function() {
      block('b').def()(function() {
        return apply('js').data;
      });
    }, { block: 'b', js: { data: 'test' } },
    'test');
  });

  it.skip('apply(\'usermode\') from def()', function() {
    // Test ported from higher major versions
    // this bug already fixed in next versions
    test(function() {
      block('b').def()(function() {
        return apply('usermode');
      });
    }, { block: 'b', usermode: 'test' },
    'test');
  });

  it('apply(\'undefusermode\') from def()', function() {
    test(function() {
      block('b').def()(function() {
        return apply('undefusermode');
      });
    }, { block: 'b' },
    undefined);
  });
});
