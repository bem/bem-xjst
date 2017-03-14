var fixtures = require('./fixtures')('bemhtml');
var test = fixtures.test;

describe('Modes appendContent', function() {
  it('should support appendContent', function() {
    test(function() {
      block('button').appendContent()(function() {
        return 'some text';
      });
    },
    { block: 'button', content: { block: 'test' } },
    '<div class="button"><div class="test"></div>some text</div>');
  });

  it('should support appendContent with literal', function() {
    test(function() {
      block('button').appendContent()('more text');
    },
    { block: 'button', content: 'text' },
    '<div class="button">textmore text</div>');
  });

  it('should accumulate result', function() {
    test(function() {
      block('button')(
        appendContent()('tmpls_1'),
        appendContent()('tmpls_2')
      );
    },
    { block: 'button', content: { block: 'test' } },
    '<div class="button"><div class="test"></div>tmpls_1tmpls_2</div>');
  });

  it('should append things to content', function() {
    test(function() {
      block('button').content()({ block: 'tmpl_1' });
      block('button').appendContent()('tmpl_2');
      block('tmpl_1').tag()('span');
    },
    { block: 'button', content: 'test' },
    '<div class="button"><span class="tmpl_1"></span>tmpl_2</div>');
  });

  it('should append non simple values to content', function() {
    test(function() {
      block('foo').appendContent()({ elem: 'test' });
    },
    { block: 'foo' },
    '<div class="foo"><div class="foo__test"></div></div>');
  });

  it('should append function to content', function() {
    test(function() {
      block('foo').appendContent()(function() { return { elem: 'test' }; });
    },
    { block: 'foo' },
    '<div class="foo"><div class="foo__test"></div></div>');
  });
});
