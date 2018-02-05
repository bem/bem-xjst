# bem-xjst

Декларативный шаблонизатор

[![NPM version](http://img.shields.io/npm/v/bem-xjst.svg?style=flat)](http://www.npmjs.org/package/bem-xjst)
[![Build Status](http://img.shields.io/travis/bem/bem-xjst/master.svg)](https://travis-ci.org/bem/bem-xjst)
[![Dependency Status](https://david-dm.org/bem/bem-xjst.svg)](https://david-dm.org/bem/bem-xjst)
[![devDependency Status](https://david-dm.org/bem/bem-xjst/dev-status.svg)](https://david-dm.org/bem/bem-xjst#info=devDependencies)
[![Coverage Status](https://coveralls.io/repos/github/bem/bem-xjst/badge.svg?branch=coverage-badge)](https://coveralls.io/github/bem/bem-xjst?branch=coverage-badge)

## Отличительные черты

### Шаблоны расширяемы: их можно переопределить или доопределить

Вы можете переопределить или расширить шаблоны отвечающие за генерацию отдельных
частей вывода: HTML-тега, HTML-атрибутов или содержимого узла. Например:

```js
block('link')({ tag: 'span' });
// Этот шаблон определяет тег для всех блоков `link`.
// Режим `tag` может быть переопределен по произвольному условию.

block('link').match((node, ctx) => ctx.url)({ tag: 'a' });
// Этот шаблон определяет тег `a` только в случае если в блоке `link` есть поле `url`.
// Иначе тег будет `span`, как определено в предыдущем шаблоне.
```

### Соответствие шаблону (pattern matching)

Для каждого узла входного дерева данных шаблонизатор проверяет условие на
соответствие шаблону.

```js
block('list')({ tag: 'ul' });
block('item')({ tag: 'li' });
```

Для каждого блока `list` выполнится шаблон про тег `ul`. Для каждого блока
`item` — шаблон про тег `li`.

Например для входных данных:
```js
{
  block: 'list',
  content: [
    {
      block: 'item',
      content: {
          block: 'list',
          content: [
              { block: 'item', content: 'CSS' },
              { block: 'item', content: 'HTML' }
          ]
      }
    },
    {
      block: 'item',
      content: {
          block: 'list',
          content: [
              { block: 'item', content: 'JS' }
          ]
      }
    }
  ]
}
```

*Результат шаблонизации:*

```html
<ul class="list">
    <li class="item">
        <ul class="list">
            <li class="item">CSS</li>
            <li class="item">HTML</li>
        </ul>
    </li>
    <li class="item">
        <ul class="list">
            <li class="item">JS</li>
        </ul>
    </li>
</ul>
```

Использовать декларативные шаблоны так же просто как и CSS для HTML.

### Автоматический обход входных данных

По предыдущему примеру вы могли заметить, что bem-xjst автоматически обходит
входные данные заглядывая в поле `content`.

### Рендеринг по умолчанию

Встроенное поведение позволяет вам рендерить данные без шаблонов. Для данных из
примера выше вы получите вот такой результат по умолчанию:

```html
<div class="list">
    <div class="item">
        <div class="list">
            <div class="item">CSS</div>
            <div class="item">HTML</div>
        </div>
    </div>
    <div class="item">
        <div class="list">
            <div class="item">JS</div>
        </div>
    </div>
</div>
```

Как видите, большую часть работы шаблонизатор сделал за вас. Осталось только
добавить несколько шаблонов для тегов и ваш HTML будет выглядеть вполне
прилично.

### Чистый JS

Шаблонизатор и сами шаблоны используют чистый JavaScript, что позволяет вам
использовать всю мощь JS-инфраструктуры: автоматические
валидаторы кода и инструменты вроде JSHint/ESLint.

### Работает на клиенте и сервере

Вы можете использовать bem-xjst в любом браузере или на любой виртуальной машине
JavaScript. Мы поддерживаем Node.js v0.10 и выше.

## Подробности

Читайте документацию:

1. [О bem-xjst](/docs/ru/1-about.md)
2. [Быстрый старт](/docs/ru/2-quick-start.md)
3. [API: использование, сигнатура и описание методов](/docs/ru/3-api.md)
4. [Формат входных данных](/docs/ru/4-data.md): BEMJSON
5. [Шаблоны: синтаксис](/docs/ru/5-templates-syntax.md)
6. [Шаблоны: контекст](/docs/ru/6-templates-context.md)
7. [Runtime](/docs/ru/7-runtime.md): как выбираются и применяются шаблоны

## Попробуйте

### Online-песочница

[Online demo](https://bem.github.io/bem-xjst/) позволяет вам делится ссылкой на
примеры шаблонов и входных данных.

### Установка npm пакета

Вам потребуется [Node.js](https://nodejs.org/) v0.10 или старше и [npm](https://www.npmjs.com/).

```bash
npm install bem-xjst
```

Скопируйте [пример из документации](https://github.com/bem/bem-xjst/blob/master/docs/ru/2-quick-start.md#Простой-пример) или смотрите [простой пример](https://github.com/bem/bem-xjst/tree/master/examples/simple-page) в репозитории. Затем прочитайте [документацию](https://github.com/bem/bem-xjst/blob/master/docs/ru/) и начинайте экспериментировать с шаблонизатором.

## bem-xjst используется в продакшене?

Да. Проекты компаний [Яндекс](https://company.yandex.ru/) и Альфа-Банк, а так же оперсорс проекты основанные на [bem-core](https://github.com/bem/bem-core) и [bem-components](https://github.com/bem/bem-components), которые тоже используют bem-xjst.

## Тест на производительность

См. [readme](https://github.com/bem/bem-xjst/tree/master/bench).

## Runtime линтер

См. [readme](https://github.com/bem/bem-xjst/tree/master/runtime-lint).

## Статический линтер и автоматическая миграция шаблонов

См. [readme](https://github.com/bem/bem-xjst/tree/master/migration).

## Ссылки

* [Документация на bem.info](https://ru.bem.info/platform/bem-xjst/)
* [Changelog](CHANGELOG.md) и [описание релизов](https://github.com/bem/bem-xjst/releases)
* [Гайд для контрибьюторов](https://github.com/bem/bem-xjst/blob/master/CONTRIBUTING.md)
* [Онлайн демо](https://bem.github.io/bem-xjst/) (you can share code snippets)
* Twitter аккаунт: [@bemxjst](https://twitter.com/bemxjst)
* [Гайд по миграции](https://github.com/bem/bem-xjst/wiki/Migration-guides) для всех мажорных версий
