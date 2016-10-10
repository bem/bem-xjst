'use strict';

const XJST = require('./pluggable');
const {bemtree, bemhtml, ddsl} = require('./plugins');

const xjst = new XJST(function () {
  block('b')(
    attrs()(function () {
      return {id: 'the-id'};
    }),
    content()(function () {
      return 'shit';
    })
  );
}, {fuck: 'off'});

// TODO: separate bem-methodolgy as plugin too

xjst.use(bemtree({ omg: 'bemtree' }));
console.log(xjst.apply({block: 'b'}));
// apply engine: bemtree
// { block: 'b', content: 'shit' }

xjst.use(bemhtml({ omg: 'bemhtml' }));
xjst.compile(function() {
  block('b').content()(function () {
    return ['fuckin ', applyNext()];
  });
});
console.log(xjst.apply({block: 'b'}));
// apply engine: bemhtml
// <div class="b" id="the-id">fuckin shit</div>

xjst.use(ddsl({ omg: 'ddsl' }));
xjst.compile(function() {
  block('b').content()(function () {
    return ['holy ', applyNext()];
  });
});
console.log(xjst.apply({block: 'b'}));
// apply engine: ddsl
// [ 'div', { className: 'b', id: 'the-id' }, 'holy fuckin shit' ]
