# BEM-XJST
[![Build Status](https://secure.travis-ci.org/bem/bem-xjst.png)](http://travis-ci.org/bem/bem-xjst)
[![NPM version](https://badge.fury.io/js/bem-xjst.png)](http://badge.fury.io/js/bem-xjst)

A clever compiler for BEM-specific templates with JavaScript syntax.

## Installation

Install it by [npm](https://npmjs.org): `npm install bem-xjst`.

## Usage

### As a node.js module

```js
var bem = require('bem-xjst');
var template = bem.compile('... your source code ...');

template.apply(/* ... your input data here ... */);

// Or even better:

template = bem.compile(function() {
  block('b1').content()('yay');
});
template.apply({ block: 'b1' });
```

### As a CLI tool

```
$ bem-xjst --help

Usage:
  bem-xjst [OPTIONS] [ARGS]


Options:
  -h, --help : Help
  -v, --version : Version
  -d, --dev-mode : Dev mode
  -i INPUT, --input=INPUT : Input file (default: stdin)
  -o OUTPUT, --output=OUTPUT : Output file (default: stdout)
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

#### `.BEMContext`

Constructor of the `this` object available in template bodies. Might be amended
to expose some functionality to the templates, or to add [_flush][1] method.

### Benchmarks

To run benchmarks:

```bash
cd benchmarks/
npm install
node run.js -h
node run.js
```

Benchmarks could be run in `--compare` mode to verify abscence of regressionfccd9d4s
in comparison to previous bem-xjst verison. Make sure that the
`benchmarks/package.json` has the right git hash of `bem-xjst` before running!

### Changes from v1.x version

See [wiki][0]

#### License

Code and documentation copyright 2015 YANDEX LLC. Code released under the
[Mozilla Public License 2.0](LICENSE.txt).

[0]: https://github.com/bem/bem-xjst/wiki/Notable-changes-between-bem-xjst@1.x-and-bem-xjst@2.x
[1]: https://github.com/bem/bem-xjst/wiki/Notable-changes-between-bem-xjst@1.x-and-bem-xjst@2.x#this_str-is-gone
