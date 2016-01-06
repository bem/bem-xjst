var fixtures = require('../fixtures')('bemhtml');
var compile = fixtures.compile;

describe('elem(×).elemMod(×)', function() {
  it('should match and process boolean elemMods', function() {
    compile(function() {
      block('button').elem('inner').elemMod('valid', true).tag()('span');
    })
      .apply({ block: 'button', content: { elem: 'inner', elemMods: { valid: true } } })
      .should.equal(
        '<div class="button"><span class="button__inner button__inner_valid"></span></div>'
      );
  });
  it('should match and process string elemMods', function() {
    compile(function() {
      block('button').elem('inner').elemMod('valid', 'yes').tag()('span');
    })
      .apply({ block: 'button', content: { elem: 'inner', elemMods: { valid: 'yes' } } })
      .should.equal(
        '<div class="button"><span class="button__inner button__inner_valid_yes"></span></div>'
      );
  });
  it('should not match string values of boolean elemMods', function() {
    compile(function() {
      block('button').elem('inner').elemMod('valid', true).tag()('span');
    })
      .apply({ block: 'button', content: { elem: 'inner', elemMods: { valid: 'valid' } } })
      .should.equal(
        '<div class="button"><div class="button__inner button__inner_valid_valid"></div></div>'
      );
  });
});
