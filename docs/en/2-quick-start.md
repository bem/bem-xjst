# Quick start

## Installation

To use bem-xjst, you need [Node.js](https://nodejs.org/) v0.10 or later, and [npm](https://www.npmjs.com/).

Install:

```bash
npm install bem-xjst
```

## Basic example

```js
var bemxjst = require('bem-xjst');

// bem-xjst contains two engines, BEMHTML and BEMTREE (starting from v5.0.0)
// Choose the BEMHTML engine
var bemhtml = bemxjst.bemhtml;

// Add templates using the `compile` method
var templates = bemhtml.compile(function() {
    block('text').tag()('span');
});

// Add data in BEMJSON format
var bemjson = [
    { block: 'text', content: 'First' },
    { block: 'text', content: 'Second' }
];

// Apply templates
var html = templates.apply(bemjson);
```

The resulting `html` contains this string:

```html
<span class="text">First</span><span class="text">Second</span>
```

***

[Online demo](https://bem.github.io/bem-xjst/).

***

Read next: [API](3-api.md)
