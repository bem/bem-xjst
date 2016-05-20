var fixtures = require('./fixtures')('bemhtml');
var compile = fixtures.compile;

describe('BEMJSON cls', function() {
  it('should not return undefined as cls value', function() {
    compile('')
      .apply({ cls: undefined })
      .should.equal('<div></div>');
  });

  it('should not return null as cls value', function() {
    compile('')
      .apply({ cls: null })
      .should.equal('<div></div>');
  });

  it('should return Number as cls value', function() {
    compile('')
      .apply({ cls: -100 })
      .should.equal('<div class="-100"></div>');
  });

  it('should not return zero as cls value', function() {
    compile('')
      .apply({ cls: 0 })
      .should.equal('<div></div>');
  });

  it('should not return NaN as cls value', function() {
    compile('')
      .apply({ cls: NaN })
      .should.equal('<div></div>');
  });

  it('should return String as cls value', function() {
    compile('')
      .apply({ cls: 'name' })
      .should.equal('<div class="name"></div>');
  });

  it('should not return empty string as cls value', function() {
    compile('')
      .apply({ cls: '' })
      .should.equal('<div></div>');
  });

  it('should return true as cls value', function() {
    compile('')
      .apply({ cls: true })
      .should.equal('<div class="true"></div>');
  });

  it('should not return false as cls value', function() {
    compile('')
      .apply({ cls: false })
      .should.equal('<div></div>');
  });

  it('should return Array as cls value', function() {
    compile('')
      .apply({ cls: [] })
      .should.equal('<div class=""></div>');
  });

  it('should not return Object as cls value', function() {
    compile('')
      .apply({ cls: { a: 1, b: 2 } })
      .should.equal('<div class="[object Object]"></div>');
  });

  it('should trim cls', function() {
    compile('')
      .apply({ cls: '   hello    ' })
      .should.equal('<div class="hello"></div>');
  });

  it('should escape cls', function() {
    compile('')
      .apply({ block: 'b', cls: '">' })
      .should.equal('<div class="b &quot;>"></div>');
  });
});
