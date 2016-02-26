# Быстрый старт

## Установка

Для использования bem-xjst вам понадобится [Node.js](https://nodejs.org/) v0.10 и выше и [npm](https://www.npmjs.com/).

Установка: `npm install bem-xjst`

## Простой пример

```js
var bemxjst = require('bem-xjst');
// bem-xjst содержит два движка BEMHTML и BEMTREE (начиная с v5.0.0)
// Выбираем движок BEMHTML
var bemhtml = bemxjst.bemhtml;

// Добавляем шаблоны с помощью метода compile
var templates = bemhtml.compile(function() {
    block('text').tag()('span');
});

// Добавляем данные в формате BEMJSON
var bemjson = [
    { block: 'text', content: 'Первый' },
    { block: 'text', content: 'Второй' }
];

// Применяем шаблоны
var html = templates.apply(bemjson);
```

В результате `html` будет содержать строку:
```html
<span class="text">Первый</span><span class="text">Второй</span>
```
***

[Online демо](https://bem.github.io/bem-xjst/).

Читать далее: [API](3-api.md)
