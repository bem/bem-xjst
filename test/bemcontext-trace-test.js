var fixtures = require('./fixtures')('bemhtml');
var test = fixtures.test;

describe('BEMContext this.trace()', function() {
  it('should have proper this.trace() without option', function() {
    test(function() {
      block('b1').content()({ block: 'b2' });
      block('b2').content()(function() {
        return JSON.stringify(this.trace());
      });
    }, { block: 'b1' },
    '<div class="b1">' +
      '<div class="b2">[]</div></div>');
  });

  it('should have proper this.trace() with option', function() {
    test(function() {
      block('b1').content()({ block: 'b2' });
      block('b2').content()(function() {
        return JSON.stringify(this.trace());
      });
    }, { block: 'b1' },
    '<div class="b1">' +
      '<div class="b2">[' +
        '{"mode":"content","block":"b1","mods":{},"elemMods":{}},' +
        '{"mode":"content","block":"b2","mods":{},"elemMods":{}}' +
       ']</div></div>',
    { trace: true });
  });
});
