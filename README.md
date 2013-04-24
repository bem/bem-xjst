# BEMHTML.js [![Build Status](https://secure.travis-ci.org/indutny/bemhtml.js.png)](http://travis-ci.org/indutny/bemhtml.js)

Compiler for a BEMHTML matching/template engine.

## Usage:

```javascript
var bemhtml = require('bemhtml');

var template = bemhtml.compile('... your source code ...');

template.apply.call({
  block: 'b-link',
  tag: 'a',
  attrs: {
    href: 'http://news.ycombinator.com'
  },
  content: 'Hacker News'
});
```
