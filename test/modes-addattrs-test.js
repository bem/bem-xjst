var fixtures = require('./fixtures')('bemhtml');
var test = fixtures.test;

describe('Modes addAttrs', function() {
  it('should support addAttrs', function() {
    test(function() {
      block('button')(
        addAttrs()(function() {
          return { id: 'test' };
        })
      );
    },
    { block: 'button' },
    '<div class="button" id="test"></div>');
  });

  it('should support addAttrs with object literal', function() {
    test(function() {
      block('button').addAttrs()({ id: 'test' });
    },
    { block: 'button' },
    '<div class="button" id="test"></div>');
  });

  it('should rewrite attrs from bemjson if no other attrs templates',
    function() {
    test(function() {
      block('button')(
        addAttrs()(function() {
          return { id: 'from-tmpls' };
        })
      );
    },
    { block: 'button', attrs: { id: 'from-data' } },
    '<div class="button" id="from-tmpls"></div>');
  });

  it('should accumulate result', function() {
    test(function() {
      block('button')(
        addAttrs()(function() {
          return { one: 'true' };
        }),
        addAttrs()(function() {
          return { two: 'false' };
        })
      );
    },
    { block: 'button' },
    '<div class="button" one="true" two="false"></div>');
  });

  it('should extend attrs from attrs mode', function() {
    test(function() {
      block('button')(
        attrs()(function() {
          return { id: 'action' };
        }),
        addAttrs()(function() {
          return { name: 'test' };
        })
      );
    },
    { block: 'button' },
    '<div class="button" id="action" name="test"></div>');
  });
});
