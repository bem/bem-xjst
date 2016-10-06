var fixtures = require('./fixtures')('bemhtml');
var test = fixtures.test;

describe('BEMContext this.isFirst()', function() {
  it('should preserve position', function() {
    test(function() {
      block('button')
        .match(function() { return this.isFirst(); })
        .addMods()({ first: 'yes' });

      block('button').def()(function() {
        return applyNext();
      });
    },
    [
      { block: 'button' },
      { block: 'button' }
    ],
      '<div class="button button_first_yes"></div>' +
      '<div class="button"></div>');
  });

  it('should calc isFirst/isLast with array mess', function() {
    test(function() {
      block('button').elem('inner')(
        match(function() { return this.isFirst(); })
          .addElemMods()(function() { return { first: 'yes' }; }),

        match(function() { return this.isLast(); })
          .addElemMods()(function() { return { last: 'yes' }; })
      );
    },
    {
      block: 'button',
      content: [
        [ { elem: 'inner' } ],
        [ { elem: 'inner' }, [ { elem: 'inner' } ] ]
      ]
    },
    '<div class="button">' +
    '<div class="button__inner button__inner_first_yes"></div>' +
    '<div class="button__inner"></div>' +
    '<div class="button__inner button__inner_last_yes"></div>' +
    '</div>');
  });

  it('should calc isFirst/isLast for single element', function() {
    test(function() {
      block('button').elem('inner')(
        match(function() { return this.isFirst(); })
          .addElemMods()({ first: 'yes' }),
        match(function() { return this.isLast(); })
          .addElemMods()({ last: 'yes' })
      );
    },
    { block: 'button', content: { elem: 'inner' } },
    '<div class="button">' +
    '<div class="button__inner button__inner_first_yes' +
    ' button__inner_last_yes"></div>' +
    '</div>');
  });

  // TODO: https://github.com/bem/bem-xjst/issues/174
  it.skip('should ignore empty array items', function() {
    test(function() {
      block('button')(
        match(function() { return this.isFirst(); })
          .addMods()({ first: 'yes' }),
        match(function() { return this.isLast(); })
          .addMods()({ last: 'yes' })
      );
    },
    [
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
    ],
    '<div class="button button_first_yes"></div>' +
    '<div>' +
    '<div class="button button_first_yes"></div>' +
    '<div class="button"></div>' +
    '<div class="button button_last_yes"></div>' +
    '</div>');
  });
});
