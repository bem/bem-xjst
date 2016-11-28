var fixtures = require('./fixtures')('bemhtml');
var test = fixtures.test;
var assert = require('assert');

describe('Modes extend', function() {
  it('should throw error when args passed to extend mode', function() {
    assert.throws(function() {
      fixtures.compile(function() {
        block('b1').extend('blah');
      });
    });
  });

  it('should support basic mode of operation', function () {
    test(function() {
      block('b')(
        extend()(function() { return { test: 'it work’s' }; }),
        content()(function() { return this.test; })
      );
    }, { block: 'b' }, '<div class="b">it work’s</div>');
  });

  it('should support inline argument', function () {
    test(function() {
      block('b')(
        extend()({ test: 'it work’s' }),
        content()(function() { return this.test; })
      );
    }, { block: 'b' }, '<div class="b">it work’s</div>');
  });

  it('should have proper `this`', function () {
    test(function() {
      block('b')(
        extend()(function() { return { test: this.ctx.wtf }; }),
        content()(function() { return this.test; })
      );
    }, { block: 'b', wtf: 'it work’s' }, '<div class="b">it work’s</div>');
  });

  it('should proxy data', function () {
    test(function() {
      block('b').extend()(function() { return { test: 42 }; });
      block('*').attrs()(function() { return { life: this.test }; });
    },
    {
      block: 'b',
      content: { block: 'a', content: { block: 'c' } }
    },
    '<div class="b" life="42"><div class="a" life="42">' +
      '<div class="c" life="42"></div></div></div>');
  });

  it('should extend ctx', function () {
    test(function() {
      block('b').extend()(function() { return { 'ctx.content': 42 }; });
    },
    { block: 'b' },
    '<div class="b">42</div>');
  });

  it('should support applyNext', function () {
    test(function() {
      block('b').extend()(function() { return { 'ctx.content': 1 }; });
      block('b').extend()(function() {
        return { 'ctx.attrs': { id: 'test' } }; });
    },
    { block: 'b' },
    '<div class="b" id="test">1</div>');
  });

  it('should pass BEMContext instance and json to extend body',
    function() {
    test(function() {
      block('b')(
        extend()(function(ctx, json) {
          return { bar: json.foo + ' ' + ctx.constructor.name };
        }),
        content()(function() { return this.bar; })
      );
    }, { block: 'b', foo: 'This is' },
    '<div class="b">This is ContextChild</div>');
  });
});
