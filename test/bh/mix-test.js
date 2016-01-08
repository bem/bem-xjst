var fixtures = require('../fixtures')('bemhtml');
var compile = fixtures.compile;

describe('mix()(×)', function() {
  it('should return mix', function() {
    compile(function() {
      block('button').def()(function() {
        return JSON.stringify(this.ctx.mix);
      });
    })
      .apply({ block: 'button', mix: { block: 'mix' } })
      .should.equal('{"block":"mix"}');
  });

  it('should set single mix', function() {
    compile(function() {
      block('button').mix()({ block: 'mix' })
    })
      .apply({ block: 'button' })
      .should.equal('<div class="button mix"></div>');
  });

  it('should set single mix as function', function() {
    compile(function() {
      block('button').mix()(function() { return { block: 'mix' }; });
    })
      .apply({ block: 'button' })
      .should.equal('<div class="button mix"></div>');
  });

  it('should set array mix', function() {
    compile(function() {
      block('button').mix()([ { block: 'mix' } ]);
    })
      .apply({ block: 'button' })
      .should.equal('<div class="button mix"></div>');
  });

  it('should set array mix as function', function() {
    compile(function() {
      block('button').mix()(function() { return [ { block: 'mix' } ]; });
    })
      .apply({ block: 'button' })
      .should.equal('<div class="button mix"></div>');
  });

  xit('should extend user single mix', function() {
    compile(function() {
      block('button').mix()({ block: 'mix2' });
    })
      .apply({ block: 'button', mix: { block: 'mix1' } })
      .should.equal('<div class="button mix1 mix2"></div>');
  });

  xit('should extend user array mix', function() {
    compile(function() {
      block('button')(
        mix()([ { block: 'mix' } ])
      );
    })
      .apply({ block: 'button', mix: [ { block: 'user-mix' } ] })
      .should.equal('<div class="button user-mix mix"></div>');
  });

  xit('should extend later declarations', function() {
    compile(function() {
      block('button')(
        mix()({ block: 'mix2' })
      );
      block('button')(
        mix()({ block: 'mix1' })
      );
    })
      .apply({ block: 'button' })
      .should.equal('<div class="button mix1 mix2"></div>');
  });

  xit('should override later declarations with force flag', function() {
    compile(function() {
      block('button').force()(
        mix()({ block: 'mix2' })
      );
      block('button')(
        mix()({ block: 'mix1' })
      );
    })
      .apply({ block: 'button' })
      .should.equal('<div class="button mix2"></div>');
  });

  xit('should override user declarations with force flag', function() {
    compile(function() {
      block('button').force().mix()({ block: 'mix' });
    })
      .apply({ block: 'button', mix: { block: 'user-mix' } })
      .should.equal('<div class="button mix"></div>');
  });

  xit('should inherit block name', function() {
    compile(function() {
      block('button')(
        mix()([
          { mods: { disabled: true } },
          { elem: 'input', mods: { active: true } },
          { block: 'clearfix' }
        ])
      );
    })
      .apply({ block: 'button' })
      .should.equal(
        '<div class="button button_disabled button__input' +
        ' button__input_active clearfix"></div>'
      );
  });

  xit('should inherit element name', function() {
    compile(function() {
      block('button').elem('control')(
        mix()([
            { mods: { disabled: true } },
            { elem: 'input', mods: { active: true } },
            { block: 'clearfix' }
        ])
      )
    })
      .apply({ block: 'button', elem: 'control' })
      .should.equal(
        '<div class="button__control button__control_disabled button__input' +
        ' button__input_active clearfix"></div>'
      );
  });
});
