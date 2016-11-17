var fixtures = require('./fixtures');
var test = fixtures.test;

describe('BEMContext: custom BEMJSON fields', function() {
  it('should preserve users fields', function() {
    test(function() {
      block('select').elem('control').def()(function() {
        this.lol = 333;
        return applyNext();
      });
      block('select').def()(function() {
        this.foo = 222;
        return applyNext();
      });
      block('select').mod('disabled', true).def()(function() {
        this.bar = 111;
        return applyNext();
      });
      block('select').elem('control').def()(function() {
        applyNext();
        return this.foo + this.bar + this.lol;
      });
    },
    {
      block: 'select',
      mods: { disabled: true },
      content: { elem: 'control' }
    },
    '<div class="select select_disabled">666</div>');
  });
});
