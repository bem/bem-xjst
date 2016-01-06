var fixtures = require('../fixtures')('bemhtml');
var compile = fixtures.compile;

describe('.isFirst() / .isLast()', function() {
  it('should calc isFirst/isLast', function() {
    compile(function() {
      block('button').elem('inner').def()(function() {
        this.isFirst() && (this.elemMods.first = 'yes');
        this.isLast() && (this.elemMods.last = 'yes');
        return applyNext();
      });
    })
      .apply({
        block: 'button',
        content: [ { elem: 'inner' }, { elem: 'inner' }, { elem: 'inner' } ]
      })
      .should.equal(
        '<div class="button">' +
        '<div class="button__inner button__inner_first_yes"></div>' +
        '<div class="button__inner"></div>' +
        '<div class="button__inner button__inner_last_yes"></div>' +
        '</div>'
      );
  });

  it('should calc isFirst/isLast with array mess', function() {
    compile(function() {
      block('button').elem('inner').def()(function() {
        this.isFirst() && (this.elemMods.first = 'yes');
        this.isLast() && (this.elemMods.last = 'yes');
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
        '<div class="button__inner button__inner_first_yes"></div>' +
        '<div class="button__inner"></div>' +
        '<div class="button__inner button__inner_last_yes"></div>' +
        '</div>'
      );
  });

  xit('should calc isFirst/isLast for single element', function() {
    compile(function() {
      block('button').elem('inner').def()(function() {
        this.isFirst() && (this.elemMods.first = 'yes');
        this.isLast() && (this.elemMods.last = 'yes');
        return applyNext();
      });
    })
      .apply({ block: 'button', content: { elem: 'inner' } })
      .should.equal(
        '<div class="button">' +
        '<div class="button__inner button__inner_first_yes button__inner_last_yes"></div>' +
        '</div>'
      );
  });

  xit('should ignore empty array items', function() {
    compile(function() {
      block('button').def()(function() {
        this.isFirst() && (this.mods.first = 'yes');
        this.isLast() && (this.mods.last = 'yes');
        return applyNext();
      });
    })
      .apply([
        false,
        { block: 'button' },
        {
          content: [
            false,
            { block: 'button' },
            { block: 'button' },
            { block: 'button' },
            [ null ]
          ]
        },
        null
      ])
      .should.equal(
        '<div class="button button_first_yes"></div>' +
        '<div>' +
        '<div class="button button_first_yes"></div>' +
        '<div class="button"></div>' +
        '<div class="button button_last_yes"></div>' +
        '</div>'
      );
  });
});
