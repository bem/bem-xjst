var fixtures = require('./fixtures')('bemhtml');
var test = fixtures.test;

describe('Runtime applyNext()', function() {
  it('should support applyNext()', function() {
    test(function() {
      block('b1').content()(function() {
        return '%' + applyNext() + '%';
      });
      block('b1').content()(function() {
        return '{' + applyNext() + '}';
      });
    }, { block: 'b1', content: 'ohai' }, '<div class="b1">{%ohai%}</div>');
  });

  it('should support changes', function() {
    test(function() {
      block('b1').content()(function() {
        return '%' + this.wtf + applyNext() + '%';
      });
      block('b1').content()(function() {
        return '{' + applyNext({ wtf: 'no ' }) + '}';
      });
    }, { block: 'b1', content: 'ohai' }, '<div class="b1">{%no ohai%}</div>');
  });

  it('should support changes for ctx', function() {
    test(function() {
      block('b1').def()(function() {
        return applyNext({ 'ctx.attrs': { id: 'test' } });
      });
    },
    { block: 'b1', content: 'ohai' },
    '<div class="b1" id="test">ohai</div>');
  });

  it('should support > 31 templates (because of the bit mask)', function() {
    test(function() {
      block('b1').content()(function() {
        return 'ok';
      });
      for (var i = 0; i < 128; i++) {
        /* jshint loopfunc:true */
        block('b1').content()(function() {
          return applyNext();
        });
      }
    }, { block: 'b1' }, '<div class="b1">ok</div>');
  });

  it('should support recursive applyNext() over block boundary', function() {
    test(function() {
      block('b1').tag()('a');
      block('b1').bem()(false);
      block('b1').def()(function() {
        return '[' + applyNext() + ':' + applyNext() + ']';
      });
    }, {
      block: 'b1',
      content: {
        block: 'b1',
        content: {
          block: 'b1',
          content: 'ok'
        }
      }
    }, '[<a>' +
      '[<a>[<a>ok</a>:<a>ok</a>]</a>:<a>[<a>ok</a>:<a>ok</a>]</a>]' +
      '</a>:<a>' +
      '[<a>[<a>ok</a>:<a>ok</a>]</a>:<a>[<a>ok</a>:<a>ok</a>]</a>]' +
      '</a>]');
  });

  it('should apply base matcher for element', function() {
    test(function() {
      block('button').elem('control').def()(function() {
        this.elemMods.type = 'span';
        return applyNext();
      });
      block('button').elem('control').elemMod('type', 'span').tag()('span');
    },
    { block: 'button', elem: 'control', elemMods: { disabled: true } },
    '<span class="button__control button__control_disabled' +
      ' button__control_type_span"></span>');
  });

  it('should apply templates for new mod', function() {
    test(function() {
      block('button').def()(function() {
        this.mods.type = 'span';
        return applyNext();
      });
      block('button').mod('type', 'span').tag()('span');
    },
    { block: 'button' },
    '<span class="button button_type_span"></span>');
  });

  it('should apply base matcher while wrapping', function() {
    test(function() {
      block('button').content()(function() {
        return [
          { elem: 'base-before' },
          applyNext(),
          { elem: 'base-after' }
        ];
      });
      block('button').content()(function() {
        return [
          { elem: 'before' },
          applyNext(),
          { elem: 'after' }
        ];
      });
    },
    { block: 'button', content: 'Hello' },
    '<div class="button">' +
      '<div class="button__before"></div>' +
      '<div class="button__base-before"></div>' +
      'Hello' +
      '<div class="button__base-after"></div>' +
      '<div class="button__after"></div>' +
    '</div>');
  });
});
