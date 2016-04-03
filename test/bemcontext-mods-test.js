var fixtures = require('./fixtures')('bemhtml');
var test = fixtures.test;

describe('BEMContext this.mods', function() {
  it('should lazily define mods', function() {
    test(function() {
      block('b1').content()(function() {
        return this.mods.a || 'yes';
      });
    }, { block: 'b1' }, '<div class="b1">yes</div>');
  });

  it('should support changing mods in runtime', function() {
    test(function() {
      block('b1').def()(function() {
        this.mods.a = 'b';
        return applyNext();
      });
    }, {
      block: 'b1'
    }, '<div class="b1 b1_a_b"></div>');
  });

  it('should inherit mods properly', function() {
    test(function() {
      block('b1').content()(function() {
        return { elem: 'e1', tag: 'span' };
      });
    }, {
      block: 'b1',
      mods: { a: 'b' }
    }, '<div class="b1 b1_a_b"><span class="b1__e1"></span></div>');
  });

  it('should match on changed mods', function() {
    test(function() {
      block('b1').content()(function() {
        return { elem: 'e1' };
      });

      block('b1').elem('e1').mod('a', 'b').tag()('span');
      block('b1').elem('e1').def()(function() {
        return local({ 'mods.a': 'b' })(function() {
          return applyNext();
        });
      });
    }, {
      block: 'b1'
    }, '<div class="b1"><span class="b1__e1"></span></div>');
  });

  it('should propagate parent mods to matcher', function() {
    test(function() {
      block('b1').content()(function() {
        return { elem: 'e1' };
      });

      block('b1').elem('e1').mod('a', 'b').tag()('span');
    }, {
      block: 'b1',
      mods: { a: 'b' }
    }, '<div class="b1 b1_a_b"><span class="b1__e1"></span></div>');
  });

  it('should restore mods', function() {
    test(function() {
      block('b2').content()(function() {
        return this.mods.a || 'yes';
      });
    }, {
      block: 'b1',
      mods: { a: 'b' },
      content: {
        block: 'b2'
      }
    }, '<div class="b1 b1_a_b"><div class="b2">yes</div></div>');
  });

  it('should lazily override mods without propagating them', function() {
    test(function() {
      block('b1').def()(function() {
        return applyNext({ 'mods.a': 'yes' });
      });
    }, {
      block: 'b1',
      content: {
        block: 'b2'
      }
    }, '<div class="b1 b1_a_yes"><div class="b2"></div></div>');
  });

  it('should support changing mods in runtime', function() {
    test(function() {
      block('b1').def()(function() {
        this.mods.m2 = 'v2';

        return applyNext();
      });
    }, {
      block: 'b1',
      mods: { m1: 'v1' }
    }, '<div class="b1 b1_m1_v1 b1_m2_v2"></div>');
  });
});
