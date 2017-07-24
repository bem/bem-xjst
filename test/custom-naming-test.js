var fixtures = require('./fixtures')('bemhtml');
var test = fixtures.test;

describe('Custom delimeters for BEM naming', function() {
  it('should support custom naming', function() {
    test(function() {
    }, [
      {
        block: 'b1',
        elem: 'e1',
        elemMods: {
          a: 'b'
        }
      },
      {
        block: 'b1',
        elem: 'e1'
      },
      {
        block: 'b1',
        mix: { elem: 'e2' }
      }
    ], '<div class="b1$$e1 b1$$e1@@a@@b"></div>' +
      '<div class="b1$$e1"></div>' +
      '<div class="b1 b1$$e2"></div>', {
      naming: {
        elem: '$$',
        mod: '@@'
      }
    });
  });

  it('should support custom naming ' +
    'for modName and modVal delimeters', function() {
    test(function() {
    }, [
      {
        block: 'b1',
        elem: 'e1',
        elemMods: { a: 'b' }
      }
    ], '<div class="b1__e1 b1__e1--a_b"></div>', {
      naming: {
        elem: '__',
        mod: { name: '--', val: '_' }
      }
    });
  });
});
