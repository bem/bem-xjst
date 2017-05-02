var fixtures = require('./fixtures')('bemhtml');
var test = fixtures.test;
var bemhtml = require('../').bemhtml;
var assert = require('assert');

describe('oninit', function() {
  it('should support oninit', function() {
    test(function() {
      oninit(function(exports) {
        exports.apply = function() {
          return 'ok';
        };
      });
    }, {}, 'ok');
  });

  it('should support changing prototype of BEMContext', function() {
    test(function() {
      oninit(function(exports) {
        exports.BEMContext.prototype.yes = 'hah';
      });

      block('b1').content()(function() {
        return this.yes;
      });
    }, {
      block: 'b1'
    }, '<div class="b1">hah</div>');
  });

  it('should put BEMContext to sharedContext too', function() {
    test(function() {
      oninit(function(exports, shared) {
        shared.BEMContext.prototype.yes = 'hah';
      });

      block('b1').content()(function() {
        return this.yes;
      });
    }, {
      block: 'b1'
    }, '<div class="b1">hah</div>');
  });

  it('should support flushing', function() {
    test(function() {
      oninit(function(exports) {
        exports.BEMContext.prototype._flushIndex = 0;
        exports.BEMContext.prototype._flush = function flush(str) {
          return '[' + (this._flushIndex++) + '.' + str + ']';
        };
      });
    }, {
      block: 'b1',
      content: {
        block: 'b2'
      }
    }, '[4.[3.[0.<div class="b1">][2.[1.<div class="b2">]</div>]</div>]]');
  });

  it('should use global object as `this`', function() {
    test(function() {
      oninit(function() {
        this._something = { blah: 42 };
      });
      block('b1').replace()(function() {
        /* global _something */
        return _something.blah;
      });
    }, { block: 'b1' }, '42');
  });

  it('should exec new oninit functions on every compile', function() {
    var template = bemhtml.compile(function() {
      oninit(function(exports) { exports.BEMContext.prototype._one = '1'; });
      block('b').content()(function() { return this._one + this._two; });
    });
    var bemjson = { block: 'b' };
    assert.equal(template.apply(bemjson), '<div class="b">1undefined</div>');

    template.compile(function() {
      oninit(function(exports) {
        exports.BEMContext.prototype._two = 1; });
    });
    assert.equal(template.apply(bemjson), '<div class="b">11</div>');
  });
});
