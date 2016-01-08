var fixtures = require('../fixtures')('bemhtml');
var compile = fixtures.compile;

describe('.applyNext()', function() {
  it('should apply templates for new mod', function() {
    compile(function() {
      block('button').def()(function() {
        this.mods.type = 'span';
        return applyNext();
      });
      block('button').mod('type', 'span').tag()('span');
    })
      .apply({ block: 'button' })
      .should.equal(
        '<span class="button button_type_span"></span>'
      );
  });

  it('should apply base matcher for element', function() {
    compile(function() {
      block('button').elem('control').def()(function() {
        this.elemMods.type = 'span';
        return applyNext();
      });
      block('button').elem('control').elemMod('type', 'span').tag()('span');
    })
      .apply({ block: 'button', elem: 'control', elemMods: { disabled: true } })
      .should.equal(
        '<span class="button__control button__control_disabled button__control_type_span"></span>'
      );
  });

  it('should apply base matcher for content', function() {
    compile(function() {
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
    })
      .apply({ block: 'button', content: 'Hello' })
      .should.equal(
        '<div class="button">' +
          '<div class="button__before"></div>' +
          '<div class="button__base-before"></div>' +
          'Hello' +
          '<div class="button__base-after"></div>' +
          '<div class="button__after"></div>' +
        '</div>'
      );
  });

  xit('should apply base matcher while wrapping', function() {
    compile(function() {
      block('button').content()(function() {
        return [
          { elem: 'base-before' },
          applyNext(),
          { elem: 'base-after' }
        ];
      });
      block('button').content()(function() {
        var res = applyNext();
        return [
          { elem: 'before' },
          this.ctx,
          { elem: 'after' }
        ];
      });
    })
      .apply({ block: 'button', content: 'Hello' })
      .should.equal(
        '<div class="button__before"></div>' +
          '<div class="button__base-before"></div>' +
          '<div class="button">' +
            'Hello' +
          '</div>' +
          '<div class="button__base-after"></div>' +
        '<div class="button__after"></div>'
      );
  });

  it('should preserve tParam', function() {
    compile(function() {
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
    })
      .apply({ block: 'select', mods: { disabled: true }, content: { elem: 'control' } })
      .should.match(/666/);
  });

  it('should preserve position', function() {
    compile(function() {
      block('button').def()(function() {
        this.isFirst() && (this.mods.first = 'yes');
        this.isLast() && (this.mods.last = 'yes');
        return applyNext();
      });
      block('button').def()(function() {
        return applyNext();
      });
    })
      .apply([
        { block: 'button' },
        { block: 'button' },
        { block: 'button' }
      ]).should.equal(
        '<div class="button button_first_yes"></div>' +
        '<div class="button"></div>' +
        '<div class="button button_last_yes"></div>'
      );
  });
});
