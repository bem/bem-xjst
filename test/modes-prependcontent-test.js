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
});
