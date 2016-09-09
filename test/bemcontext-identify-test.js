var assert = require('assert');
var bemxjst = require('./fixtures')('bemhtml');

describe('BEMContext this.identify()', function() {
  it('should work without arguments', function() {
    var template = bemxjst.compile(function() {
      block('b').def()(function() {
        return this.identify();
      });
    });

    // Compare first 10 symbols
    // to avoid bounce tests results because of new Date()
    assert.equal(template.apply({ block: 'b' }).substr(0, 10),
      ('uniq' + (+new Date()) + 1).substr(0, 10));
  });

  it('should work with one argument', function() {
    var template = bemxjst.compile(function() {
      block('b').def()(function() {
        var elem = { elem: 'e' };
        return [ this.identify(elem), this.identify(elem) ];
      });
    });

    var res = template.apply({ block: 'b' });

    assert.equal(res[0], res[1]);
  });

  it('should work with two arguments', function() {
    var template = bemxjst.compile(function() {
      block('b').def()(function() {
        var elem = { elem: 'e' };
        var i1 = this.identify(elem, true);
        this.identify(elem); // set private field in elem object
        var i2 = this.identify(elem, true);
        return [
          i1,
          i2
        ];
      });
    });

    var res = template.apply({ block: 'b' });

    assert.equal(res[0], undefined);
    assert.equal(res[1].substr(0, 11),
                ('uniq' + (+new Date()) + 1).substr(0, 11));
  });
});
