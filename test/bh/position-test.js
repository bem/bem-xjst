var fixtures = require('../fixtures')('bemhtml');
var compile = fixtures.compile;

describe('.position', function() {
  it('should calc position', function() {
    compile(function() {
      block('button').elem('inner').def()(function() {
        this.elemMods.pos = this.position;
        return applyNext();
      })
    })
      .apply({
        block: 'button',
        content: [ { elem: 'inner' }, { elem: 'inner' }, { elem: 'inner' } ]
      })
      .should.equal(
        '<div class="button">' +
        '<div class="button__inner button__inner_pos_1"></div>' +
        '<div class="button__inner button__inner_pos_2"></div>' +
        '<div class="button__inner button__inner_pos_3"></div>' +
        '</div>'
      );
  });
  it('should calc position with array mess', function() {
    compile(function() {
      block('button').elem('inner').def()(function() {
        this.elemMods.pos = this.position;
        return applyNext();
      })
    })
      .apply({
        block: 'button',
        content: [
            [ { elem: 'inner' } ],
            [ { elem: 'inner' }, [ { elem: 'inner' } ] ]
        ]
      })
      .should.equal(
        '<div class="button">' +
        '<div class="button__inner button__inner_pos_1"></div>' +
        '<div class="button__inner button__inner_pos_2"></div>' +
        '<div class="button__inner button__inner_pos_3"></div>' +
        '</div>'
      );
  });
  xit('should calc position for single element', function() {
    compile(function() {
      block('button').elem('inner').def()(function() {
        this.elemMods.pos = this.position;
        return applyNext();
      })
    })
      .apply({ block: 'button', content: { elem: 'inner' } })
      .should.equal(
        '<div class="button">' +
        '<div class="button__inner button__inner_pos_1"></div>' +
        '</div>'
      );
  });
});
