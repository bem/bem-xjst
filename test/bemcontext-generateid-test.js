var assert = require('assert');
var bemxjst = require('./fixtures');

describe('BEMContext this.generateId()', function() {
  var template;

  beforeEach(function() {
    template = bemxjst.compile(function() {
      block('b1')(
        tag()(''),
        content()(function() {
          return this.generateId();
        })
      );
    });
  });

  it('starts with uniq', function() {
    var str = template.apply({ block: 'b1' });
    assert(str.indexOf('uniq') === 0);
  });

  it('should be unique in different applies', function() {
    assert.notEqual(
      template.apply({ block: 'b1' }),
      template.apply({ block: 'b1' })
    );
  });

  it('should be unique in one apply', function() {
    var sep = '❄';
    var str = template.apply([ { block: 'b1' }, sep, { block: 'b1' } ]);
    var arr = str.split(sep);

    assert.notEqual(arr[0], arr[1]);
  });

  it('should be equal for same ctx', function() {
    var sep = '❄';
    var template = bemxjst.compile(function() {
      var sep = '❄';
      block('b2')(
        tag()(''),
        content()(function() {
          return [ this.generateId(), sep, this.generateId() ];
        })
      );
    });
    var str = template.apply({ block: 'b2' });
    var arr = str.split(sep);

    assert.equal(arr[0], arr[1]);
  });
});
