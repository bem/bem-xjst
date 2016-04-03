var fixtures = require('./fixtures')('bemhtml');
var test = fixtures.test;

describe('BEMJSON elemMods', function() {
  it('should support elemMods', function() {
    test(function() {},
      {
        block: 'b',
        elem: 'e',
        elemMods: { type: 'button' }
      },
      '<div class="b__e b__e_type_button"></div>');
  });

  it('should take elemMods from BEMJSON', function() {
    test(function() {
      block('b1').elem('e1').content()(function() {
        return this.elemMods.a || 'no';
      });
    }, {
      block: 'b1',
      content: {
        elem: 'e1',
        elemMods: { a: 'yes' }
      }
    }, '<div class="b1"><div class="b1__e1 b1__e1_a_yes">yes</div></div>');
  });

  it('should restore elemMods', function() {
    test(function() {
      block('b2').elem('e1').content()(function() {
        return this.elemMods.a || 'yes';
      });
    }, {
      block: 'b1',
      content: {
        elem: 'e1',
        elemMods: {
          a: 'no'
        },
        content: {
          block: 'b2',
          elem: 'e1'
        }
      }

    }, '<div class="b1"><div class="b1__e1 b1__e1_a_no">' +
      '<div class="b2__e1">yes</div></div></div>');
  });


  it('should not treat elemMods as mods', function() {
    test(function() {}, {
      block: 'b1',
      elemMods: { m1: 'v1' }
    }, '<div class="b1"></div>');
  });
});
