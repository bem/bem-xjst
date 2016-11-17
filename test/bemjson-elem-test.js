var fixtures = require('./fixtures');
var test = fixtures.test;

describe('BEMJSON elem', function() {
  it('should assume elem=\'\' is a falsey value', function() {
    test(function() {
      block('b1').elem('e1').def()(function() {
        return applyCtx(this.extend(this.ctx, {
          block: 'b2',
          elem: ''
        }));
      });
    }, { block: 'b1' }, '<div class="b1"></div>');
  });

  it('wildcard elem should be called before the matched templates',
    function() {
    test(function() {
      block('b1').content()(function() {
        return 'block';
      });
      block('b1').elem('a').content()(function() {
        return 'block-a';
      });
      block('b1').elem('*').content()(function() {
        return '%' + applyNext() + '%';
      });
    }, [ {
      block: 'b1'
    }, {
      block: 'b1',
      elem: 'a'
    }, {
      block: 'b3',
      elem: 'b',
      content: 'ok'
    } ], '<div class="b1">block</div>' +
      '<div class="b1__a">%block-a%</div>' +
      '<div class="b3__b">%ok%</div>');
  });
});
