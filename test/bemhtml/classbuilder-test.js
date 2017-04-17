var fixtures = require('../fixtures')('bemhtml');

var test = fixtures.test;
var fail = fixtures.fail;

describe('BEMHTML ClassBuilder', function() {
  describe('buildClass()', function() {
    it('without arguments', function() {
      test(function() {
        block('a').content()(function() {
          return this.buildClass();
        });
      }, { block: 'a', tag: false }, '');
    });

    it('with empty object as argument', function() {
      test(function() {
        block('a').content()(function() {
          return this.buildClass({});
        });
      }, { block: 'a', tag: false }, '');
    });

    it('block', function() {
      test(function() {
        block('a').content()(function() {
          return this.buildClass({ block: 'b1' });
        });
      }, { block: 'a', tag: false }, 'b1');
    });

    it('block with element', function() {
      test(function() {
        block('a').content()(function() {
          return this.buildClass({ block: 'b1', elem: 'e' });
        });
      }, { block: 'a', tag: false }, 'b1__e');
    });

    it('element without block', function() {
      test(function() {
        block('a').content()(function() {
          return this.buildClass({ elem: 'e' });
        });
      }, { block: 'a', tag: false }, '');
    });

    it('block with modName and modVal', function() {
      test(function() {
        block('a').content()(function() {
          return this.buildClass({
            block: 'b1',
            modName: 'm',
            modVal: 'v'
          });
        });
      }, { block: 'a', tag: false }, 'b1_m_v');
    });

    it('block, element with modName and modVal', function() {
      test(function() {
        block('a').content()(function() {
          return this.buildClass({
            block: 'b1',
            elem: 'e',
            modName: 'm',
            modVal: 'v'
          });
        });
      }, { block: 'a', tag: false }, 'b1__e_m_v');
    });
  });
});
