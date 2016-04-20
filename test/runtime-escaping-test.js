var fixtures = require('./fixtures')('bemhtml');
var test = fixtures.test;

describe('Content escaping', function() {
  it('should escape content if escapeContent option flag is set', function() {
    test(function() {},
      { block: 'b', content: '<script>' },
      '<div class="b">&lt;script&gt;</div>',
      { escapeContent: true });
  });

  it('shouldn’t escape content if escapeContent option flag is set to false',
    function() {
    test(function() {},
      { block: 'b', content: '<script>' },
      '<div class="b"><script></div>',
      { escapeContent: false });
  });

  it('shouldn’t escape content with html field',
    function() {
    test(function() {},
      { block: 'markup', content: { html: '<script>' } },
      '<div class="markup"><script></div>',
      { escapeContent: true });
  });

  // (miripiruni) this will be changed in next major release
  it('shouldn’t escape content by default',
    function() {
    test(function() {},
      { block: 'b', content: '<script>' },
      '<div class="b"><script></div>');
  });

  it('should expect raw html', function() {
    test(function() {
    }, { html: '<unescaped>' },
    '<unescaped>');
  });

  it('should ignore other props if html exists', function() {
    test(function() {
    }, { block: 'b', html: '<unescaped>', content: 'safe text' },
    '<div class="b">safe text</div>');
  });

  it('should ignore html with non string value', function() {
    test(function() {
    }, [ { html: [ '<danger>' ] },
      { html: { toString: function () { return '<lol>'; } } } ],
    '<div></div><div></div>');
  });
});
