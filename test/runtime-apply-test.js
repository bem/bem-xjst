var fixtures = require('./fixtures')('bemhtml');
var test = fixtures.test;

describe('Runtime apply()', function() {
  it('apply(\'content\') from def()', function() {
    test(function() {
      block('b').def()(function() {
        return apply('content');
      });
    }, { block: 'b', content: 'test' },
    'test');
  });

  it('apply(\'mix\') from def()', function() {
    test(function() {
      block('b').def()(function() {
        return apply('mix');
      });
    }, { block: 'b', mix: 'test' },
    'test');
  });

  it('apply(\'tag\') from tag()', function() {
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

  it('apply(\'tag\') from def()', function() {
    test(function() {
      block('b').def()(function() {
        return apply('tag');
      });
    }, { block: 'b', tag: 'a' },
    'a');
  });

  it('apply(\'bem\') from def()', function() {
    test(function() {
      block('b').def()(function() {
        return apply('bem');
      });
    }, { block: 'b', bem: false },
    false);
  });

  it('apply(\'cls\') from def()', function() {
    test(function() {
      block('b').def()(function() {
        return apply('cls');
      });
    }, { block: 'b', cls: 'test' },
    'test');
  });

  it('apply(\'attrs\') from def()', function() {
    test(function() {
      block('b').def()(function() {
        return apply('attrs');
      });
    }, { block: 'b', attrs: { target: '_blank' } },
    { target: '_blank' });
  });

  it('apply(\'js\') from def()', function() {
    test(function() {
      block('b').def()(function() {
        return apply('js');
      });
    }, { block: 'b', js: { data: 'test' } },
    { data: 'test' });
  });

  it('apply(\'usermode\') from def()', function() {
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

  it('apply(\'\') should lookup field from bemjson by default', function() {
    test(function() {
      block('b').def()(function() {
        return apply('test');
      });
    }, { block: 'b', test: 'bemjson' },
    'bemjson');
  });
});
