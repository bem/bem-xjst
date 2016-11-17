var fixtures = require('./fixtures');
var test = fixtures.test;
var fail = fixtures.fail;

describe('Modes match', function() {
  it('should support custom matches', function () {
    test(function() {
      block('b1').content()('!');
      block('b1').match(function() { return this.ctx.test2; }).content()('ok');
      block('b1').match(function() { return this.ctx.test1; }).content()('!');
    }, { block: 'b1', test2: true }, '<div class="b1">ok</div>');
  });

  it('should verify match() argument', function() {
    fail(function() {
      block('b1').match('123')('123');
    }, /Wrong.*match.*argument/);
  });

  it('should execute matches in right order', function() {
    test(function() {
      block('bla')(
        tag()('span'),
        // this.ctx.d is undefined
        match(function() { return this.ctx.d; })(
          tag()('a'),
          attrs()(match(function() { return this.ctx.d.a; })(function() {
            // this will throw error
            return { f: 1 };
          }))
        )
      );
    }, {
      block: 'bla'
    }, '<span class="bla"></span>');
  });
});
