# BEM-XJST

[![NPM version](http://img.shields.io/npm/v/bem-xjst.svg?style=flat)](http://www.npmjs.org/package/bem-xjst)
[![Build Status](http://img.shields.io/travis/bem/bem-xjst/master.svg)](https://travis-ci.org/bem/bem-xjst)

Компилятор БЭМ-специфичных шаблонов, основанный на [XJST](https://github.com/veged/xjst).

[Онлайн-демо](https://bem.github.io/bem-xjst/).

## Установка

Устанавливается с помощью [npm](https://npmjs.org): `npm install bem`.

## Использование

### В качестве js-модуля

```js
var BEM_XJST = require('bem-xjst'),
    template = BEM_XJST.compile('... your source code ...');

template.apply(/* ... your input data here ... */);
```

### В виде программы

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
