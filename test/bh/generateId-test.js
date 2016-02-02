var fixtures = require('../fixtures')('bemhtml');
var compile = fixtures.compile;

describe('.generateId()', function() {
  var bemhtml;

  beforeEach(function() {
    bemhtml = compile(function() {
      block('b1').def()(function() { return this.generateId(); })
    });
  });

  it('starts with uniq', function() {
    bemhtml
      .apply({ block: 'b1' })
      .should.match(/^uniq/);
  });

  it('should be unique in different applies', function() {
    var id1 = bemhtml.apply({ block: 'b1' });
    var id2 = bemhtml.apply({ block: 'b1' });
    id1.should.not.equal(id2);
  });

  it('should be unique in one apply', function() {
    var sep = '❄';
    var str = bemhtml.apply([ { block: 'b1' }, sep, { block: 'b1' } ]);
    var ids = str.split(sep);

    ids[0].should.not.equal(ids[1]);
  });

  it('should be equal for same ctx', function() {
    var bemhtml = compile(function() {
      block('b2').def()(function() {
        return [ this.generateId(), '❄', this.generateId() ].join('');
      });
    });
    var str = bemhtml.apply({ block: 'b2' });
    var ids = str.split('❄');

    ids[0].should.equal(ids[1]);
  });
});
