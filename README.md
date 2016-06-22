# BEM-XJST

Declarative template engine for the browser and server.

[![NPM version](http://img.shields.io/npm/v/bem-xjst.svg?style=flat)](http://www.npmjs.org/package/bem-xjst)
[![Build Status](http://img.shields.io/travis/bem/bem-xjst/master.svg)](https://travis-ci.org/bem/bem-xjst)
[![Dependency Status](https://david-dm.org/bem/bem-xjst.svg)](https://david-dm.org/bem/bem-xjst)
[![devDependency Status](https://david-dm.org/bem/bem-xjst/dev-status.svg)](https://david-dm.org/bem/bem-xjst#info=devDependencies)

[Online demo](https://bem.github.io/bem-xjst/). Twitter account: [@bemxjst](https://twitter.com/bemxjst)

## Installation

Install it by [npm](https://npmjs.org): `npm install bem-xjst`.

## Usage

### As a node.js module

```js
var bemxjst = require('bem-xjst');
var bemhtml = bemxjst.bemhtml;

// Add templates
var templates = bemhtml.compile(function() {
  block('b').content()('yay');
});

// Apply templates to data context in BEMJSON format and get result as HTML string
templates.apply({ block: 'b' });
// Result: <div class="b">yay</div>
```

```js
var bemxjst = require('bem-xjst');
var bemtree = bemxjst.bemtree;

// Add templates
var templates = bemtree.compile(function() {
  block('b').content()('yay');
});

// Apply templates to data context in BEMJSON format and get result as BEMJSON
templates.apply({ block: 'b' });
// Result: { block: 'b1', content: 'yay' }
```

### As a CLI tool

CLI can be used for creation bundles. See [Compiler generate](#generatestring-or-function).

```bash
$ bem-xjst --help

Usage:
  bem-xjst [OPTIONS] [ARGS]


Options:
  -h, --help : Help
  -v, --version : Version
  -e, --engine : Engine name (default: bemhtml, supported: bemhtml | bemtree)
  -i INPUT, --input=INPUT : File with user templates (default: stdin)
  -o OUTPUT, --output=OUTPUT : Output bundle file (default: stdout)
```

## API

### Compiler

#### `.compile(string or function)`

Compile input templates and return `templates` object.
(See documentation below for its methods)

#### `.generate(string or function)`

Generate output JavaScript code that might be transferred and executed in
browser to get the `templates` object.

### templates

#### `.apply(context)`

Run compiled templates on specified input context. Return resulting HTML output.

#### `.compile(string or function)`

Add more BEM templates to the `templates` instance. Might be called in runtime
to deliver more blocks declarations to the client.

```js
var bemxjst = require('bem-xjst');
var templates = bemxjst.bemhtml.compile(function() {
    block('b').tag()('a');
  });

templates.apply({ block: 'b' });
// Return '<a class="b"></a>'

templates.compile(function() {
  block('b').content()('Hi, folks!');
});

templates.apply({ block: 'b' });
// Return '<a class="b">Hi, folks!</a>'
```

#### `.BEMContext`

Constructor of the `this` object available in template bodies. Might be amended
to expose some functionality to the templates, or to add [_flush][1] method.

```js
var bemxjst = require('bem-xjst');
var templates = bemxjst.bemhtml.compile('');

templates.BEMContext.prototype.myField = 'opa';

templates.compile(function() {
  block('b').content()(function() {
    return this.myField;
  });
});

templates.apply({ block: 'b' });
// Return '<div class="b">opa</div>'
```

## Benchmarks

To run benchmarks:

```bash
cd bench/
npm install
node run.js -h
node run.js
```

Benchmarks could be run in `--compare` mode to verify absence of regression
in comparison to previous bem-xjst version. Make sure that the
`benchmarks/package.json` has the right git hash of `bem-xjst` before running!

## Documentation

 * [Documentation](https://en.bem.info/platform/bem-xjst/)
 * [Releases notes](https://github.com/bem/bem-xjst/releases)
 * [Migration guide from 4.x to 5.x](https://github.com/bem/bem-xjst/wiki/Migration-guide-from-4.x-to-5.x)
 * [Changes from v1.x version](https://github.com/bem/bem-xjst/wiki/Notable-changes-between-bem-xjst@1.x-and-bem-xjst@2.x)

## License

Code and documentation copyright 2016 YANDEX LLC. Code released under the
[Mozilla Public License 2.0](LICENSE.txt).

[0]: https://github.com/bem/bem-xjst/wiki/Notable-changes-between-bem-xjst@1.x-and-bem-xjst@2.x
[1]: https://github.com/bem/bem-xjst/wiki/Notable-changes-between-bem-xjst@1.x-and-bem-xjst@2.x#this_str-is-gone
