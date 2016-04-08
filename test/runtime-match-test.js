var fixtures = require('./fixtures')('bemhtml');
var test = fixtures.test;

describe('Runtime Match', function() {
  it('should call body function in BEMContext context', function() {
    test(function() {
      block('b').def()(function() {
        return this.constructor.name;
      });
    }, { block: 'b' }, 'ContextChild');
  });

  it('should pass BEMContext as the first argument', function() {
    test(function() {
      block('b').def()(function(ctx) {
        return ctx.constructor.name;
      });
    }, { block: 'b' }, 'ContextChild');
  });

  it('should pass BEMContext instance to custom mode', function() {
    test(function() {
      block('b').mode('custom')(function(ctx) {
        return ctx.constructor.name;
      });
      block('b').def()(function() {
        return apply('custom');
      });
    }, { block: 'b' }, 'ContextChild');
  });

  it('should pass bemjson node as the second argument', function() {
    test(function() {
      block('b').def()(function(_, json) {
        return json.foo;
      });
    }, { block: 'b', foo: 'bar' }, 'bar');
  });

  it('should pass json to custom mode', function() {
    test(function() {
      block('b').mode('custom')(function(_, json) {
        return json.foo;
      });
      block('b').def()(function() {
        return apply('custom');
      });
    }, { block: 'b', foo: 'bar' }, 'bar');
  });

  it('should pass BEMContext instance and json to match method body',
    function() {
    test(function() {
      block('b').match(function(ctx, json) {
        this._what = json.foo + ' ' + ctx.constructor.name;
        return true;
      }).def()(function() {
        return this._what;
      });
    }, { block: 'b', foo: 'This is' }, 'This is ContextChild');
  });

  it('should pass BEMContext instance and json to replace body. #226',
    function() {
    test(function() {
      block('b').replace()(function(ctx, json) {
        return json.foo + ' ' + ctx.constructor.name;
      });
    }, { block: 'b', foo: 'This is' }, 'This is ContextChild');
  });

  it('should pass BEMContext instance and json to wrap body',
    function() {
    test(function() {
      block('b').wrap()(function(ctx, json) {
        return json.foo + ' ' + ctx.constructor.name;
      });
    }, { block: 'b', foo: 'This is' }, 'This is ContextChild');
  });

  it('should pass BEMContext instance and json to once body',
    function() {
    test(function() {
      block('b').def().once()(function(ctx, json) {
        return json.foo + ' ' + ctx.constructor.name;
      });
    }, { block: 'b', foo: 'This is' }, 'This is ContextChild');
  });
});
