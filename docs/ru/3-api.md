# API

* [Выбор движка, компиляция и применение шаблонов](#Выбор-движка-компиляция-и-применение-шаблонов)
* [Добавление шаблонов](#Добавление-шаблонов)
* [Настройки](#Настройки)
  - [Разделители в именовании БЭМ-сущностей](#Разделители-в-именовании-БЭМ-сущностей)
  - [Поддержка JS-экземпляров для элементов (bem-core v4+)](#Поддержка-js-экземпляров-для-элементов-bem-core-v4)
  - [Закрытие одиночных элементов](#Закрытие-одиночных-элементов)
  - [Экранирование](#Экранирование)
  - [Расширение BEMContext](#Расширение-bemcontext)
  - [Runtime проверки ошибок в шаблонах и входных данных](#Runtime-проверки-ошибок-в-шаблонах-и-входных-данных)
* [Создание бандла](#Создание-бандла)

## Выбор движка, компиляция и применение шаблонов

### Движок BEMHTML

```js
var bemxjst = require('bem-xjst');
var bemhtml = bemxjst.bemhtml;

// Добавляем шаблон
var templates = bemhtml.compile(function() {
    block('quote').tag()('q');
});

// Добавляем данные
var bemjson = { block: 'quote', content: 'Пришел, увидел, отшаблонизировал.' };

// Применяем шаблоны
var html = templates.apply(bemjson);
```

В результате `html` будет содержать строку:

```html
<q class="quote">Пришел, увидел, отшаблонизировал.</q>
```

### Движок BEMTREE

```js
var bemxjst = require('bem-xjst');
var bemtree = bemxjst.bemtree;

// Добавляем шаблон
var templates = bemtree.compile(function() {
    block('phone').content()({ mask: '8-800-×××-××-××', mandatory: true });

    block('page').content()([
        { block: 'header' },
        { block: 'body' },
        { block: 'footer' }
    ]);
});

// Добавляем данные
var bemjson = [ { block: 'phone' }, { block: 'page' } ];

// Применяем шаблоны
var result = templates.apply(bemjson);
// result будет содержать:
[
    {
        block: 'phone',
        content: {
            mask: '8-800-×××-××-××',
            mandatory: true
        }
    },
    {
        block: 'page',
        content: [
            { block: 'header' },
            { block: 'body' },
            { block: 'footer' }
        ]
    }
]
```

## Добавление шаблонов

Чтобы добавить шаблоны к экземпляру `templates` воспользуйтесь методом `compile`.

```js
var bemxjst = require('bem-xjst');

// Создаём экземпляр класса templates
var templates = bemxjst.bemhtml.compile(function() {
    block('header').tag()('h1');
});

// Добавляем данные
var bemjson = { block: 'header', content: 'Документация' };

var html = templates.apply(bemjson);
// html: '<h1 class="header">Документация</h1>'

// Добавляем шаблоны к уже созданному экземпляру класса templates
templates.compile(function() {
    block('header').tag()('h2');
});

html = templates.apply(bemjson);
// Теперь HTML-тег стал h2 вместо h1:
// html: '<h2 class="header">Документация</h2>'
```

Если вам нужно собрать все шаблоны в [бандл](https://ru.bem.info/method/build/#Результаты-сборки), то эффективнее использовать метод [generate](#Создание-бандла).

## Настройки

### Разделители в именовании БЭМ-сущностей

```js
var bemxjst = require('bem-xjst');
var templates = bemxjst.bemhtml.compile(function() {
    // В этом примере мы не добавляем пользовательских шаблонов.
    // Для рендеринга HTML будет использовано поведение шаблонизатора по умолчанию.
    }, {
        // Настройка БЭМ-нейминга
        naming: {
            elem: '__',
            mod: '_'
        }
    });

var bemjson = {
    block: 'page',
    mods: { theme: 'gray' },
    content: {
        elem: 'head',
        elemMods: { type: 'short' }
    }
};

var html = templates.apply(bemjson);
```

В результате `html` будет содержать строку:

```html
<div class="page page_theme_gray">
    <div class="page__head page__head_type_short"></div>
</div>
```

Подробнее читай в [cоглашении по именованию](https://ru.bem.info/methodology/naming-convention/).

### Поддержка JS-экземпляров для элементов (bem-core v4+)

В библиотеке [bem-core](https://ru.bem.info/libs/bem-core/) начиная с 4 версии появилась поддержка JS-экземпляров для элементов.

Это требует добавления класса `i-bem` для элементов, имеющих JS-параметры.

Добиться этого можно с помощью опции `elemJsInstances`:

```js
var bemxjst = require('bem-xjst');
var templates = bemxjst.bemhtml.compile(function() {
    // В этом примере мы не добавляем пользовательских шаблонов.
    // Для рендеринга HTML будет использовано поведение шаблонизатора по умолчанию.
    }, {
        // Включаем поддержку JS-экземпляров для элементов
        elemJsInstances: true
    });

var bemjson = {
    block: 'b',
    elem: 'e',
    js: true
};

var html = templates.apply(bemjson);
```

В результате `html` будет содержать строку:

```html
<div class="b__e i-bem" data-bem='{"b__e":{}}'></div>
```

### Закрытие одиночных элементов

Если у вас нет необходимости генерировать корректный XHTML (закрывать одиночные элементы),
можно немного сэкономить, отключив опцию `xhtml`:

```js
var bemxjst = require('bem-xjst');
var templates = bemxjst.bemhtml.compile(function() {
    // В этом примере мы не добавляем пользовательских шаблонов.
    // Для рендеринга HTML будет использовано поведение шаблонизатора по умолчанию.
    }, {
        // Выключаем режим XHTML
        xhtml: false
    });

var bemjson = {
    tag: 'br'
};

var html = templates.apply(bemjson);
```

В результате `html` будет содержать строку:

```html
<br>
```

### Экранирование

Вы можете включить экранирование содержимого поля `content` опцией `escapeContent`.
В этом случае ко всем строковым значениям `content` будет применена функция
[`xmlEscape`](6-templates-context.md#xmlescape).

```js
var bemxjst = require('bem-xjst');
var templates = bemxjst.bemhtml.compile(function() {
    // В этом примере мы не добавляем пользовательских шаблонов.
    // Для рендеринга HTML будет использовано поведение шаблонизатора по умолчанию.
    }, {
        escapeContent: true
    });

var bemjson = {
    block: 'danger',
    // Потенциально опасный и неконтролируемый текст
    content: '&nbsp;<script src="alert()"></script>'
};

var html = templates.apply(bemjson);
```

В результате `html` будет содержать строку:

```html
<div class="danger">&amp;nbsp;&lt;script src="alert()"&gt;&lt;/script&gt;</div>
```

Если вам нужно вывести строку без экранирования воспользуйтесь специальным
значением поля `content`: `{ html: '…' }`. Пример:

```js
var bemxjst = require('bem-xjst');
var templates = bemxjst.bemhtml.compile(function() {
    // В этом примере мы не добавляем пользовательских шаблонов.
    // Для рендеринга HTML будет использовано поведение шаблонизатора по умолчанию.
    }, {
        escapeContent: true
    });

var bemjson = {
    block: 'trusted',
    // Безопасное содержимое
    content: 'I <3 you!'
};

var html = templates.apply(bemjson);
```

В результате `html` будет содержать строку:

```html
<div class="trusted">I <3 you!</div>
```

Обратите внимание, что в `content.html` ожидается именно строка.

### Расширение BEMContext

Вы можете расширять `BEMContext`, чтобы использовать в теле шаблона пользовательские функции.

```js
var bemxjst = require('bem-xjst');
var templates = bemxjst.bemhtml.compile('');

// Расширяем прототип контекста
templates.BEMContext.prototype.hi = function(name) {
    return 'Hello, ' + name;
};

// Добавляем шаблоны
templates.compile(function() {
    block('b').content()(function() {
        return this.hi('templates');
    });
});

// Входные данные
var bemjson = { block: 'b' };

// Применяем шаблоны
var html = templates.apply(bemjson);
```

В результате `html` будет содержать строку:

```html
<div class="b">Hello, templates</div>
```

### Runtime проверки ошибок в шаблонах и входных данных

Включив опцию `runtimeLint` вы можете отслеживать предупреждения о неправильных шаблонах и входных данных.
Предупреждения основаны [на гайде по миграции](https://github.com/bem/bem-xjst/wiki/Migration-guide-from-4.x-to-5.x).

```js
var bemxjst = require('bem-xjst');
var bemhtml = bemxjst.bemhtml;

var templates = bemhtml.compile(function() {
  block('b').content()('yay');

  block('mods-changes').def()(function() {
    this.ctx.mods.one = 2;
    return applyNext();
  });
}, { runtimeLint: true });

var html = templates.apply([
  { block: 'b' },

  // boolean attributes
  { block: 'b', attrs: { one: true, two: 'true' } },

  // mods for elem
  { block: 'c', elem: 'e', mods: { test: 'opa' } },

  // Присвоения в this.ctx.mods
  { block: 'mods-changes', mods: { one: '1', two: '2' } }
]);
```

В результате выполнения этого кода в STDERR будут записаны предупреждения:
```
BEM-XJST WARNING: boolean attribute value: true in BEMJSON: { block: 'b', attrs: { one: true, two: 'true' } }
Notice what bem-xjst behaviour changed: https://github.com/bem/bem-xjst/releases/tag/v4.3.3

BEM-XJST WARNING: mods for elem in BEMJSON: { block: 'c', elem: 'e', mods: { test: 'opa' } }
Notice what bem-xjst behaviour changed: https://github.com/bem/bem-xjst/releases/tag/v5.0.0

BEM-XJST WARNING: looks like someone changed ctx.mods in BEMJSON: { block: 'mods-changes', mods: { one: 2, two: '2' } }
old value of ctx.mod.one was 1
Notice that you should change this.mods instead of this.ctx.mods in templates
```


## Создание бандла

Метод `generate` генерирует JS-код, который может быть передан и выполнен в браузере для получения объекта `templates`.

```js
var bemxjst = require('bem-xjst');
var bundle = bemxjst.bemhtml.generate(function() {
    // пользовательские шаблоны
    // ...
});
```

В `bundle` будет строка, содержащая JS-код ядра BEMHTML и пользовательских шаблонов.

***

Читать далее: [входные данные](4-data.md)
