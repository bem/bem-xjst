var fixtures = require('./fixtures');
var test = fixtures.test;

describe('BEMJSON content', function() {
  it('should render block by default as div', function () {
    test(function() {},
      [ { content: 'Hello, bemhtml!' } ],
      '<div>Hello, bemhtml!</div>');
  });
});
