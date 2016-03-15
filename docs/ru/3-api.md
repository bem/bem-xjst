# API

* [Выбор движка, компиляция и применение шаблонов](#choose-engine)
* [Добавление шаблонов](#add-templates)
* [Настройки](#settings)
  - [Экранирование](#escaping)
  - [Pазделители в именовании БЭМ-сущностей](#naming)
  - [Поддержка JS-экземпляров для элементов (bem-core v4+)](#elemjs)
  - [Закрытие одиночных элементов](#xhtml)
  - [Расширение BEMContext](#bemcontext)
* [Создание бандла](#bundle)

## <a name="choose-engine"></a>Выбор движка, компиляция и применение шаблонов

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


## <a name="add-templates"></a>Добавление шаблонов

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

Если вам нужно собрать все шаблоны в [бандл](https://ru.bem.info/method/build/#Результаты-сборки), то эффективнее использовать метод [generate](#generate).

## <a name="settings"></a>Настройки

### <a name="naming"></a>Pазделители в именовании БЭМ-сущностей

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
Подробнее про [cоглашение по именованию](https://ru.bem.info/method/naming-convention/) на bem.info.

### <a name="elemjs"></a>Поддержка JS-экземпляров для элементов (bem-core v4+)
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

### <a name="xhtml"></a>Закрытие одиночных элементов

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

### <a name="escaping"></a>Экранирование

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

Если вам нужно вывести строку без экранирования [воспользуйтесь специальным
значением поля `content`](4-data#content): `{ html: '…' }`.


### <a name="bemcontext"></a>Расширение `BEMContext`

Вы можете расширять `BEMContext`, чтобы использовать в теле шаблона пользовательские функции.

```js
var bemxjst = require('bem-xjst');
var templates = bemxjst.bemhtml.compile('');
// Расширяем прототип контекста
templates.BEMContext.prototype.hi = function(name) {
    return 'Hello, ' + username;
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


## <a name="bundle"></a>Создание бандла

Метод `generate` генерирует JS-код, который может быть передан и выполнен в браузере для получения объекта `templates`. Пример:
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
