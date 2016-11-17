var fixtures = require('./fixtures');
var test = fixtures.test;

describe('BEMContext this.isFirst()', function() {
  it('should preserve position', function() {
    test(function() {
      block('button')
        .match(function() { return this.isFirst(); })
        .def()(function() {
          this.mods = { first: 'yes' };
          return applyNext();
        }),

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

  // TODO: https://github.com/bem/bem-xjst/issues/174
  it.skip('should ignore empty array items', function() {
    test(function() {
      block('button')(
        match(function() { return this.isFirst(); })
          .def()(function() {
            this.elemMods = { first: 'yes' };
            return applyNext();
          }),
        match(function() { return this.isLast(); })
          .def()(function() {
            this.elemMods = { last: 'yes' };
            return applyNext();
          })
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
