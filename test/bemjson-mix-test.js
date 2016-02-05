var fixtures = require('./fixtures')('bemhtml');
var test = fixtures.test;

describe('BEMJSON mix', function() {
  it('should return mix', function() {
    test(function() {
      block('button').def()(function() {
        return JSON.stringify(this.ctx.mix);
      });
    },
    { block: 'button', mix: { block: 'mix' } },
    '{"block":"mix"}');
  });

  it('should support mix in json', function() {
    test(function() {},
    {
      block: 'b1',
      mix: { block: 'b2' }
    },
    '<div class="b1 b2"></div>');
  });

  it('should mix with block itself', function() {
    test(function() { },
    {
      block: 'b1',
      elem: 'e1',
      mix: { block: 'b1' }
    },
    '<div class="b1__e1 b1"></div>');
  });

  it('should not propagate parent elem to JS params', function() {
    test(function() {},
    {
      block: 'b1',
      elem: 'e1',
      mix: { block: 'b2', js: true }
    },
    '<div class="b1__e1 b2 i-bem" data-bem=\'{"b2":{}}\'></div>');
  });
});
