var fixtures = require('./fixtures')('bemhtml');
var test = fixtures.test;

describe('Modes prependContent', function() {
  it('should support prependContent', function() {
    test(function() {
      block('b').prependContent()(function() {
        return 'before';
      });
    },
    { block: 'b', content: { block: 'test' } },
    '<div class="b">before<div class="test"></div></div>');
  });

  it('should support prependContent with literal', function() {
    test(function() {
      block('b').prependContent()('before ');
    },
    { block: 'b', content: 'text' },
    '<div class="b">before text</div>');
  });

  it('should accumulate result', function() {
    test(function() {
      block('b')(
        prependContent()('2'),
        prependContent()('4')
      );
    },
    { block: 'b', content: ' is the answer' },
    '<div class="b">42 is the answer</div>');
  });

  it('should prepend things to content', function() {
    test(function() {
      block('b').content()('2');
      block('b').prependContent()('4');
    },
    { block: 'b', content: 'test' },
    '<div class="b">42</div>');
  });

  it('should prepend non simple values to content', function() {
    test(function() {
      block('foo').prependContent()({ elem: 'test' });
    },
    { block: 'foo' },
    '<div class="foo"><div class="foo__test"></div></div>');
  });

  it('should prepend function to content', function() {
    test(function() {
      block('foo').prependContent()(function() { return { elem: 'test' }; });
    },
    { block: 'foo' },
    '<div class="foo"><div class="foo__test"></div></div>');
  });
});
