# BEM-XJST [![Build Status](https://secure.travis-ci.org/bem/bem-xjst.png)](http://travis-ci.org/bem/bem-xjst)

Compiler for a BEMHTML matching/template engine.

## Usage:

```javascript
var bem_xjst = require('bem-xjst');

var template = bem_xjst.compile('... your source code ...');

template.apply.call({
  block: 'b-link',
  tag: 'a',
  attrs: {
    href: 'http://news.ycombinator.com'
  },
  content: 'Hacker News'
});
```
