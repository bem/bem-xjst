var fixtures = require('./fixtures')('bemhtml');
var test = fixtures.test;

describe('BEMContext this.isFirst()', function() {
  it('should preserve position', function() {
    test(function() {
      block('button').def()(function() {
        if (this.isFirst()) this.mods.first = 'yes';
        return applyNext();
      });
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
      block('button').elem('inner').def()(function() {
        if (this.isFirst()) this.elemMods.first = 'yes';
        if (this.isLast()) this.elemMods.last = 'yes';
        return applyNext();
      });
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

  // TODO: https://github.com/bem/bem-xjst/issues/174
  xit('should calc isFirst/isLast for single element', function() {
    test(function() {
      block('button').elem('inner').def()(function() {
        if (this.isFirst()) this.elemMods.first = 'yes';
        if (this.isLast()) this.elemMods.last = 'yes';
        return applyNext();
      });
    },
    { block: 'button', content: { elem: 'inner' } },
    '<div class="button">' +
    '<div class="button__inner button__inner_first_yes' +
    ' button__inner_last_yes"></div>' +
    '</div>');
  });

  // TODO: https://github.com/bem/bem-xjst/issues/174
  xit('should ignore empty array items', function() {
    test(function() {
      block('button').def()(function() {
        if (this.isFirst()) this.mods.first = 'yes';
        if (this.isLast()) this.mods.last = 'yes';
        return applyNext();
      });
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
