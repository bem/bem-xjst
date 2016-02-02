var fixtures = require('../fixtures')('bemhtml');
var compile = fixtures.compile;

describe('.mods()', function() {
  var tmpls;
  beforeEach(function() {
    tmpls = compile(function() {
      block('button').def()(function() {
        return JSON.stringify(this.mods);
      });
      block('button').elem('*').def()(function() {
        return JSON.stringify(this.mods);
      });
    });
  });

  it('should return empty mods', function() {
    tmpls.apply({ block: 'button' }).should.equal('{}');
  });

  it('should return mods', function() {
    tmpls.apply({ block: 'button', mods: { type: 'button' } })
      .should.equal('{"type":"button"}');
  });

  xit('should return elem mods', function() {
    tmpls.apply({ block: 'button', elem: 'control',
        elemMods: { type: 'button' } })
      .should.equal('{"type":"button"}');
  });

  it('should return boolean mods', function() {
    tmpls.apply({ block: 'button', mods: { disabled: true } })
      .should.equal('{"disabled":true}');
  });

  xit('should set mods', function() {
    compile(function() {
      block('button')(
        mods()({ type: 'button', disabled: true })
      );
    })
      .apply({ block: 'button' })
      .should.equal('<div class="button button_type_button button_disabled">' +
        '</div>');
  });

  xit('should not override user mods', function() {
    compile(function() {
      block('button')(
        mods()({
          type: 'button',
          disabled: true
        })
      );
    })
      .apply({
        block: 'button',
        mods: {
          type: 'link',
          disabled: undefined
        }
      })
      .should.equal('<div class="button button_type_link"></div>');
  });

  xit('should not override later declarations', function() {
    compile(function() {
      block('button')(
        mods()({ type: 'control' })
      );
      block('button')(
        mods()({ type: 'button', disabled: true })
      );
    })
      .apply({ block: 'button' }).should.equal(
        '<div class="button button_type_button button_disabled"></div>');
  });

  xit('should override later declarations with force flag', function() {
    compile(function() {
      block('button').force()(
        mods()({ type: 'control' })
      );
      block('button')(
        mods()({ type: 'button' })
      )
    })
      .apply({ block: 'button' })
      .should.equal('<div class="button button_type_control"></div>');
  });

  xit('should override user declarations with force flag', function() {
    compile(function() {
      block('button').force()(
        mods()({ type: 'button' })
      );
    })
      .apply({ block: 'button', mods: { type: 'link' } })
      .should.equal('<div class="button button_type_button"></div>');
  });
});
