# BEM-XJST [![Build Status](https://secure.travis-ci.org/bem/bem-xjst.png)](http://travis-ci.org/bem/bem-xjst) [![NPM version](https://badge.fury.io/js/bem-xjst.png)](http://badge.fury.io/js/bem-xjst)

[XJST](https://github.com/veged/xjst)-based compiler for a BEM-specific templates.

## Installation

Install it by [npm](https://npmjs.org): `npm install bem`.

## Usage

### As js-module

```js
var BEM_XJST = require('bem-xjst'),
    template = BEM_XJST.compile('... your source code ...');

template.apply(/* ... your input data here ... */);
```

### As programm

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
