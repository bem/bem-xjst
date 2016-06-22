# BEM-XJST

[![NPM version](http://img.shields.io/npm/v/bem-xjst.svg?style=flat)](http://www.npmjs.org/package/bem-xjst)
[![Build Status](http://img.shields.io/travis/bem/bem-xjst/master.svg)](https://travis-ci.org/bem/bem-xjst)
[![Dependency Status](https://david-dm.org/bem/bem-xjst.svg)](https://david-dm.org/bem/bem-xjst)
[![devDependency Status](https://david-dm.org/bem/bem-xjst/dev-status.svg)](https://david-dm.org/bem/bem-xjst#info=devDependencies)

Компилятор БЭМ-специфичных шаблонов, основанный на [XJST](https://github.com/veged/xjst).

[Онлайн-демо](https://bem.github.io/bem-xjst/). Твиттер акаунт: [@bemxjst](https://twitter.com/bemxjst)

## Установка

Устанавливается с помощью [npm](https://npmjs.org): `npm install bem-xjst`.

## Использование

### В качестве node.js модуля

```js
var bemxjst = require('bem-xjst');
// Используем движок рендеринга bemhtml, чтобы получать HTML
var bemhtml = bemxjst.bemhtml;

// Добавляем шаблоны
var templates = bemhtml.compile(function() {
  block('b').content()('yay');
});

// Формируем входные данные в формате BEMJSON 
var bemjson = { block: 'b' };

// Применяем шаблоны к входным данным, чтобы получить HTML
templates.apply();
// Результат: <div class="b">yay</div>
```

```js
var bemxjst = require('bem-xjst');
// Используем движок рендеринга bemtree, чтобы получать BEMJSON
var bemtree = bemxjst.bemtree;

// Добавляем шаблоны
var templates = bemtree.compile(function() {
  block('b').content()('yay');
});

// Формируем входные данные в формате BEMJSON 
var bemjson = { block: 'b' };

// Применяем шаблоны к входным данным, чтобы получить BEMJSON
templates.apply({ block: 'b' });
// Результат: { block: 'b1', content: 'yay' }
```

### В виде CLI-утилиты

CLI может быть использован для создания бандлов. Смотри [Compiler
generate](#generatestring-or-function).

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

Компилирует шаблоны и возвращает объект `templates`.
(Смотри документацию его методов ниже).

#### `.generate(string or function)`

Генерирует JS-код, который может быть передан и выполнен в браузере для
получения объекта `templates`.

### templates

#### `.apply(context)`

Применяет скомпилированные шаблоны к переданному BEMJSON в аргументе context.
В зависимости от `engine` возвращает BEMJSON или HTML.

#### `.compile(string or function)`

Добавляет шаблоны к экземпляру `templates`. Может быть вызван в рантайме.

```js
var bemxjst = require('bem-xjst');
var templates = bemxjst.bemhtml.compile(function() {
    block('b').tag()('a');
  });

templates.apply({ block: 'b' });
// Результат '<a class="b"></a>'

templates.compile(function() {
  block('b').content()('Hi, folks!');
});

templates.apply({ block: 'b' });
// Результат '<a class="b">Hi, folks!</a>'
```

#### `.BEMContext`

Конструктор `this` доступного в теле шаблонов. Может быть расширен для
предоставления дополнительной функциональности в шаблонах.

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
// Результат '<div class="b">opa</div>'
```

## Тесты на производительность

Чтобы запустить тесты:

```bash
cd bench/
npm install
node run.js -h
node run.js
```

Тесты на производительность могут быть запущены с параметром `--compare`
для отслеживания регрессий и сравнения с предыдущей версией BEM-XJST. Не забудьте
 убедиться, что в `benchmarks/package.json` указан правильный hash коммита
 `bem-xjst`.

## Документация

 * [Документация](https://ru.bem.info/platform/bem-xjst/)
 * [Описания релизов](https://github.com/bem/bem-xjst/releases)
 * [Гайд по миграции с 4.x на 5.x](https://github.com/bem/bem-xjst/wiki/Migration-guide-from-4.x-to-5.x)
 * [Основные изменения с v1.x](https://github.com/bem/bem-xjst/wiki/Notable-changes-between-bem-xjst@1.x-and-bem-xjst@2.x)

## Лицензия

Права на код и документацию принадлежат 2016 YANDEX LLC.
[Mozilla Public License 2.0](LICENSE.txt).

[0]: https://github.com/bem/bem-xjst/wiki/Notable-changes-between-bem-xjst@1.x-and-bem-xjst@2.x
[1]: https://github.com/bem/bem-xjst/wiki/Notable-changes-between-bem-xjst@1.x-and-bem-xjst@2.x#this_str-is-gone
