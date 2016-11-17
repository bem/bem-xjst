var fixtures = require('./fixtures');
var compile = fixtures.compile;
var test = fixtures.test;

describe('BEMJSON mods', function() {
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

  it('should return boolean mods', function() {
    tmpls.apply({ block: 'button', mods: { disabled: true } })
      .should.equal('{"disabled":true}');
  });

  it('should not treat mods as elemMods (already changed in next major)',
  function() {
    test(function() {}, {
      block: 'b1',
      content: {
        elem: 'e1',
        mods: { m1: 'v1' }
      }
    }, '<div class="b1"><div class="b1__e1 b1__e1_m1_v1"></div></div>');
  });

  it('should treat mods as elemMods even if block exist (already changed in ' +
  'next major)', function() {
    test(function() {}, {
      block: 'b1',
      content: {
        block: 'b1',
        elem: 'e1',
        mods: { m1: 'v1' }
      }
    }, '<div class="b1"><div class="b1__e1 b1__e1_m1_v1"></div></div>');
  });

  it('should treat mods as elemMods in mixes (already changed in next major)',
  function() {
    test(function() {}, {
      block: 'b1',
      mix: {
        elem: 'e1',
        mods: { m1: 'v1' }
      }
    }, '<div class="b1 b1__e1 b1__e1_m1_v1"></div>');
  });

  it('should not inherit mods from namesake parent block', function () {
    test(function() {}, {
      block: 'b1',
      mods: { a: 1 },
      content: { block: 'b1' }
    }, '<div class="b1 b1_a_1"><div class="b1"></div></div>');
  });
});
