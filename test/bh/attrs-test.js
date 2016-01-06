var fixtures = require('../fixtures')('bemhtml');
var compile = fixtures.compile;

describe('attrs()(×)', function() {
  it('should return empty attrs', function() {
    compile(function() {
      block('button').def()(function() {
        return typeof this.ctx.attrs;
      });
    })
      .apply({ block: 'button' })
      .should.equal('undefined');
  });

  it('should return attrs', function() {
    compile(function() {
      block('button').def()(function() {
        return this.ctx.attrs.type;
      });
    })
      .apply({ block: 'button', attrs: { type: 'button' } })
      .should.equal('button');
  });

  xit('should set attrs', function() {
    compile(function() {
      block('checkbox').attrs()({
        name: undefined,
        type: 'button',
        disabled: false,
        hidden: true,
        value: null
      });
    })
      .apply({ block: 'checkbox' })
      .should.equal('<div class="checkbox" type="button" hidden></div>');
  });

  it('should not override user attrs', function() {
    compile(function() {
      block('button').attrs()({
        type: 'button',
        disabled: true
      });
    })
      .apply({
        block: 'button',
        attrs: {
          type: 'link',
          disabled: undefined,
          name: 'button'
        }
      })
      .should.equal('<div class="button" type="link" name="button"></div>');
  });

  xit('should not override later declarations', function() {
    compile(function() {
      block('button')(
        attrs()({ type: 'control', tabindex: 0 })
      );
      block('button')(
        attrs()({ type: 'button' })
      );
    })
      .apply({ block: 'button' }).should.equal('<div class="button" type="button" tabindex="0"></div>');
  });

  xit('should override later declarations with force flag', function() {
    compile(function() {
      block('button').force()(
        attrs()({ type: 'control' })
      );
      block('button')(
        attrs()({ type: 'button', tabindex: 0 })
      )
    })
      .apply({ block: 'button' }).should.equal('<div class="button" type="control" tabindex="0"></div>');
  });

  xit('should override user declarations with force flag', function() {
    compile(function() {
      block('button')(
        attrs().force()({
          type: 'button',
          disabled: undefined
        })
      );
    })
      .apply({
        block: 'button',
        attrs: {
          type: 'link',
          disabled: 'disabled',
          name: 'button'
        }
      }).should.equal('<div class="button" type="button" name="button"></div>');
  });
});
