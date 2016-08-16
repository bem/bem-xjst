var fixtures = require('./fixtures')('bemhtml');
var test = fixtures.test;

describe('Modes addJs', function() {
  it('should support addJs', function() {
    test(function() {
      block('button')(
        addJs()(function() {
          return { test: 1 };
        })
      );
    },
    { block: 'button' },
    '<div class="button i-bem" data-bem=\'{"button":{"test":1}}\'></div>');
  });

  it('should support addJs with object literal', function() {
    test(function() {
      block('button').addJs()({ test: 1 });
    },
    { block: 'button' },
    '<div class="button i-bem" data-bem=\'{"button":{"test":1}}\'></div>');
  });

  it('should rewrite js from bemjson if no other js templates',
    function() {
    test(function() {
      block('button')(
        addJs()(function() {
          return { test: 2 };
        })
      );
    },
    { block: 'button', js: { test: 1 } },
    '<div class="button i-bem" data-bem=\'{"button":{"test":2}}\'></div>');
  });

  it('should accumulate result', function() {
    test(function() {
      block('button')(
        addJs()(function() {
          return { one: 1 };
        }),
        addJs()(function() {
          return { two: 42 };
        })
      );
    },
    { block: 'button' },
    '<div class="button i-bem" ' +
      'data-bem=\'{"button":{"one":1,"two":42}}\'></div>');
  });

  it('should extend js from js mode', function() {
    test(function() {
      block('button')(
        js()(function() {
          return { film: 'lost' };
        }),
        addJs()(function() {
          return { type: 'serial' };
        })
      );
    },
    { block: 'button' },
    '<div class="button i-bem" ' +
      'data-bem=\'{"button":{"film":"lost","type":"serial"}}\'></div>');
  });
});
