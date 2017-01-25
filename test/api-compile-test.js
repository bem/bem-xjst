var assert = require('assert');
var bemxjst = require('../').bemhtml;

describe('API compile', function() {
  it('should work with no arguments', function() {
    var template;

    assert.doesNotThrow(function() {
      template = bemxjst.compile();
    });

    assert.equal(template.apply({ block: 'b1' }), '<div class="b1"></div>');
  });

  it('should able to add templates in runtime', function() {
    var template = bemxjst.compile();

    assert.equal(template.apply({ block: 'b1' }), '<div class="b1"></div>');

    template.compile(function() {
      block('b1').content()('ok');
    });

    assert.equal(template.apply({ block: 'b1' }), '<div class="b1">ok</div>');
    assert.equal(template.apply({ block: 'b2' }), '<div class="b2"></div>');

    template.compile(function() {
      block('b2').content()('ok');
    });

    assert.equal(template.apply({ block: 'b1' }), '<div class="b1">ok</div>');
    assert.equal(template.apply({ block: 'b2' }), '<div class="b2">ok</div>');

    template.compile(function() {
      block('b1').tag()('a');
    });

    assert.equal(template.apply({ block: 'b1' }), '<a class="b1">ok</a>');
    assert.equal(template.apply({ block: 'b2' }), '<div class="b2">ok</div>');
  });

  it('should work with function with parameters', function() {
    var template;

    // Function with name and parameters
    /*jshint unused:false*/
    var functionWithName = function templates(a, b, c) {
      block('name').content()('yay');
    };

    assert.doesNotThrow(function() {
      template = bemxjst.compile(functionWithName);
    });

    assert.equal(template.apply({ block: 'name' }),
      '<div class="name">yay</div>');
  });

  it('should work with named function', function() {
    var template;

    // Function with name
    var functionWithName = function templates() {
      block('name').content()('yay');
    };

    assert.doesNotThrow(function() {
      template = bemxjst.compile(functionWithName);
    });

    assert.equal(template.apply({ block: 'name' }),
      '<div class="name">yay</div>');
  });

  it('should work with arrow function', function() {
    var template;
    var arrowFunction = function() {};
    arrowFunction.toString = function() {
      return '() => { block(\'a\').tag()(\'a\'); }';
    };

    assert.doesNotThrow(function() {
      template = bemxjst.compile(arrowFunction);
    });

    assert.equal(template.apply({ block: 'a' }),
      '<a class="a"></a>');
  });

  it('should work with arrow function with params', function() {
    var template;
    var arrowFunction = function() {};
    arrowFunction.toString = function() {
      return '(a, b, c) => { block(\'a\').tag()(\'a\'); }';
    };

    assert.doesNotThrow(function() {
      template = bemxjst.compile(arrowFunction);
    });

    assert.equal(template.apply({ block: 'a' }),
      '<a class="a"></a>');
  });

  it('should work with arrow function with _', function() {
    var template;
    var arrowFunction = function() {};
    arrowFunction.toString = function() {
      return '_ => { block(\'a\').tag()(\'a\'); }';
    };

    assert.doesNotThrow(function() {
      template = bemxjst.compile(arrowFunction);
    });

    assert.equal(template.apply({ block: 'a' }),
      '<a class="a"></a>');
  });

  describe('Production mode', function() {
    it('should render even if error in one block', function() {
      var template = bemxjst.compile(function() {
        block('b1').attrs()(function() {
          var attrs = applyNext();
          attrs.undef.foo = 'bar';
          return attrs;
        });
      }, { production: true });

      assert.equal(template.apply({
        block: 'page',
        content: { block: 'b1' }
      }), '<div class="page"></div>');
    });

    it('should throw error with one apply if production mode off', function() {
      var template = bemxjst.compile(function() {
        block('b1').attrs()(function() {
          var attrs = applyNext();
          attrs.foo = 'bar';
          return attrs;
        });
      });

      assert.throws(function() {
        template.apply({ block: 'b1' });
      });
    });

    it('should throw bem-xjst error on template with no block', function() {
      assert.throws(function() {
        bemxjst.compile(function() {
          attrs()(function() { return { a: 1 }; });
        });
      });
    });
  });

  describe('Runtime lint mode', function() {
    function captureStream(stream) {
      var oldWrite = stream.write;
      var buf = '';

      stream.write = function(chunk) {
        buf += chunk.toString();
        oldWrite.apply(stream, arguments);
      };

      return {
        unhook: function unhook() { stream.write = oldWrite; },
        captured: function() { return buf; }
      };
    }

    var hook;
    beforeEach(function() { hook = captureStream(process.stderr); });
    afterEach(function() { hook.unhook(); });

    it('should work with runtimeLint option', function() {
      var template = bemxjst.compile(function() {
        block('b__e').content()('test');
      }, { runtimeLint: true });

      template.apply({ block: 'b__e' });

      var stderr = hook.captured();
      assert.equal(
        stderr.substr(0, 17),
        '\nBEM-XJST WARNING'
      );
    });
  });

  describe('context option', function() {
    it('should work with context option', function() {
      assert.doesNotThrow(function() {
        var template = bemxjst.compile(function() {
          block('b').content()('test');
        }, { context: 'this' });

        template.apply({ block: 'b' });
      });
    });
  });
});
