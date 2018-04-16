# API

* [Выбор движка, компиляция и применение шаблонов](#Выбор-движка-компиляция-и-применение-шаблонов)
* [Добавление шаблонов](#Добавление-шаблонов)
* [Настройки](#Настройки)
  * [Разделители в именовании БЭМ-сущностей](#Разделители-в-именовании-БЭМ-сущностей)
  * [Поддержка JS-экземпляров для элементов (bem-core v4+)](#Поддержка-js-экземпляров-для-элементов-bem-core-v4)
  * [Закрытие одиночных элементов](#Закрытие-одиночных-элементов)
  * [Опциональные закрывающие теги](#Опциональные-закрывающие-теги)
  * [Атрибуты без кавычек](#Атрибуты-без-кавычек)
  * [Экранирование](#Экранирование)
  * [Runtime проверки ошибок в шаблонах и входных данных](#runtime-проверки-ошибок-в-шаблонах-и-входных-данных)
  * [Режим production](#Режим-production)
* [Подключение сторонних библиотек](#Подключение-сторонних-библиотек)
* [Расширение BEMContext](#Расширение-bemcontext)
* [Создание бандла](#Создание-бандла)
* [Source maps](#source-maps)

## Выбор движка, компиляция и применение шаблонов

### Движок BEMHTML

```js
var bemxjst = require('bem-xjst');
var bemhtml = bemxjst.bemhtml;

// Добавляем шаблон
var templates = bemhtml.compile(() => {
    block('quote')({ tag: 'q' });
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
var templates = bemtree.compile(() => {
    block('phone')({
        content: { mask: '8-800-×××-××-××', mandatory: true }
    });

    block('page')({
        content: [
            { block: 'header' },
            { block: 'body' },
            { block: 'footer' }
        ]
    });
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
var templates = bemxjst.bemhtml.compile(() => {
    block('header')({ tag: 'h1' });
});

// Добавляем данные
var bemjson = { block: 'header', content: 'Документация' };

var html = templates.apply(bemjson);
// html: '<h1 class="header">Документация</h1>'

// Добавляем шаблоны к уже созданному экземпляру класса templates
templates.compile(() => {
    block('header')({ tag: 'h2' });
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
var templates = bemxjst.bemhtml.compile(() => {
    // В этом примере мы не добавляем пользовательских шаблонов.
    // Для рендеринга HTML будет использовано поведение шаблонизатора по умолчанию.
    }, {
        // Настройка БЭМ-нейминга
        naming: {
            elem: '__',
            mod: { name: '--', val: '_' }
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
<div class="page page--theme_gray">
    <div class="page__head page__head--type_short"></div>
</div>
```

Подробнее читай в [cоглашении по именованию](https://ru.bem.info/methodology/naming-convention/).

### Поддержка JS-экземпляров для элементов (bem-core v4+)

В библиотеке [bem-core](https://ru.bem.info/libs/bem-core/) начиная с 4 версии появилась поддержка JS-экземпляров для элементов.

Это требует добавления класса `i-bem` для элементов, имеющих JS-параметры.

Добиться этого можно с помощью опции `elemJsInstances`:

```js
var bemxjst = require('bem-xjst');
var templates = bemxjst.bemhtml.compile(() => {
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
var templates = bemxjst.bemhtml.compile(() => {
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

### Опциональные закрывающие теги

При помощи опции `omitOptionalEndTags` шаблонизатор не будет выводить
опциональные закрывающие теги. По умолчанию эта опция выключена.

Список опциональных закрывающих тегов можно найти в спецификациях
[HTML4](https://html.spec.whatwg.org/multipage/syntax.html#optional-tags) и
[HTML5](https://www.w3.org/TR/html5/syntax.html#optional-tags).

```js
var bemxjst = require('bem-xjst');
var templates = bemxjst.bemhtml.compile(() => {
    // В этом примере мы не добавляем пользовательских шаблонов.
    // Для рендеринга HTML будет использовано поведение шаблонизатора по умолчанию.
    }, {
        // Отключаем вывод опциональных закрывающих тегов
        omitOptionalEndTags: true
    });

var bemjson = {
    tag: 'table',
    content: {
        tag: 'tr',
        content: [
            { tag: 'th', content: 'table header' },
            { tag: 'td', content: 'table cell' }
        ]
    }
};

var html = templates.apply(bemjson);
```

В результате `html` будет содержать строку:

```html
<table><tr><th>table header<td>table cell</table>
```

### Атрибуты без кавычек

Спецификация HTML позволяет опустить необязательные кавычки у атрибутов, которые не содержат пробелов и прочих специальных символов. Подробности читайте в спецификациях [HTML4](https://www.w3.org/TR/html4/intro/sgmltut.html#h-3.2.2) и [HTML5](https://www.w3.org/TR/html5/syntax.html#attributes).

С помощью опции `unquotedAttrs` вы можете включить такое поведение в рендеринге BEMHTML.

```js
var bemxjst = require('bem-xjst');
var templates = bemxjst.bemhtml.compile(() => {
    // В этом примере мы не добавляем пользовательских шаблонов.
    // Для рендеринга HTML будет использовано поведение шаблонизатора по умолчанию.
    }, {
        // Разрешаем пропускать кавычки в атрибутах если это возможно:
        unquotedAttrs: true
    });

var bemjson = { block: 'b', attrs: { name: 'test' } };

var html = templates.apply(bemjson);
```

В результате `html` будет содержать строку:

```html
<div class=b name=test></div>
```

### Экранирование

Вы можете включить экранирование содержимого поля `content` опцией `escapeContent`. В этом случае ко всем строковым значениям `content` будет применена функция [`xmlEscape`](6-templates-context.md#xmlescape).

```js
var bemxjst = require('bem-xjst');
var templates = bemxjst.bemhtml.compile(() => {
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

Если вам нужно вывести строку без экранирования воспользуйтесь [специальным значением поля `content`](4-data.md#content): `{ html: '…' }`.

**Пример**

```js
var bemxjst = require('bem-xjst');
var templates = bemxjst.bemhtml.compile(() => {
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

### Runtime проверки ошибок в шаблонах и входных данных

Включив опцию `runtimeLint` вы можете отслеживать предупреждения о неправильных шаблонах и входных данных.
Предупреждения основаны [на гайде по миграции](https://github.com/bem/bem-xjst/wiki/Migration-guide-from-4.x-to-5.x).

```js
var bemxjst = require('bem-xjst');
var bemhtml = bemxjst.bemhtml;

var templates = bemhtml.compile(() => {
  block('b')({ content: 'yay' });

  block('mods-changes')({
    def: (node, json) => {
      json.mods.one = 2;
      return applyNext();
    }
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

```js
BEM-XJST WARNING: boolean attribute value: true in BEMJSON: { block: 'b', attrs: { one: true, two: 'true' } }

Notice what bem-xjst behaviour changed: https://github.com/bem/bem-xjst/releases/tag/v4.3.3

BEM-XJST WARNING: mods for elem in BEMJSON: { block: 'c', elem: 'e', mods: { test: 'opa' } }

Notice what bem-xjst behaviour changed: https://github.com/bem/bem-xjst/releases/tag/v5.0.0

BEM-XJST WARNING: looks like someone changed ctx.mods in BEMJSON: { block: 'mods-changes', mods: { one: 2, two: '2' } } old value of ctx.mod.one was 1

Notice that you should change this.mods instead of this.ctx.mods in templates
```

### Режим production

Вы можете использовать опцию `production`, чтобы отрендерить весь BEMJSON, даже если в одном из шаблонов произошла ошибка.

**Пример**

```js
var template = bemxjst.compile(() => {
  block('b1')({
      attrs: () => {
        var attrs = applyNext();
        attrs.undef.foo = 'bar';
        return attrs;
      }
  });
}, { production: true });
var html = template.apply({ block: 'page', content: { block: 'b1' } });
```

`html` будет содержать `<div class="page"></div>`.

Если в результате выполнения шаблонов случится ошибка, то узел не будет отрендерен, но шаблонизатор продолжит
работу, выведя в STDERR сообщение об этой ошибке.

```bash
$node index.js 1> stdout.txt 2> stderr.txt

$ cat stdout.txt
<div class="page"></div>

$ cat stderr.txt
BEMXJST ERROR: cannot render block b1, elem undefined, mods {}, elemMods {} [TypeError: Cannot read property 'undef' of undefined]
```

При использовании опции `production` со значением `true` вы можете определить свою собственную реализацию функции логирования ошибок взамен стандартному `console.error`. В этом случае в вашу кастомную функцию будут переданы два аргумента:

1) Объект с указанием блока, элемента и модификаторов где произошла
ошибка.
2) Перехваченная оригинальная JS-ошибка.

Определить свою реализацию `onError` можно любым способом расширив прототип `BEMContext`. Например так:

```js
var bemxjst = require('bem-xjst');
var templates = bemxjst.bemhtml.compile('', { production: true });

templates.BEMContext.prototype.onError = function(context, err) { … };
```

### Настройка exportName

Вы можете использовать опцию `exportName` чтобы выбрать имя переменной, в
которой будет храниться движок. По умолчанию движки хранятся в BEMHTML и BEMTREE.

За примером обратитесь к следующему [разделу про создание бандла](#Создание-бандла).

## Подключение сторонних библиотек

Технологии [BEMTREE](api.ru.md#bemtree) и [BEMHTML](api.ru.md#bemhtml) поддерживают возможность подключения сторонних библиотек как глобально, так и для разных модульных систем с помощью опции [requires](api.ru.md#requires).

Для подключения укажите название библиотеки и в зависимости от используемой модульной системы:

* имя глобальной переменной;
* путь к модулю для CommonJS;
* имя модуля из YModules;

```js
{
    requires: {
        'lib-name': {
            globals: 'libName',           // Название переменной в глобальной видимости
            commonJS: 'path/to/lib-name', // Путь к модулю CommonJS относительно собираемого файла
            ym: 'lib-name'                // Имя модуля из YModules
        }
    }
}
```

В шаблонах модули будут доступны с помощью метода `this.require`, например:

```js
block('button')({
    content() {
      var lib = this.require('lib-name');
      return lib.hello();
    }
});
```

Не обязательно указывать все модульные системы для подключения библиотеки.

Например, можно указать зависимости глобально. В этом случае модуль всегда будет передаваться из глобальной переменной, даже если в среде исполнения будет модульная система.

```js
{
    requires: {
        'lib-name': {
            globals: 'dependName' // Название переменной в глобальной видимости
        }
    }
}
```

В случае, если указано несколько вариантов подключения модуля, шаблон будет пытаться его получить в следующем порядке:
1) global
2) CommonJS
3) YModules (при условии, что модульная система доступна)
Если на любом из шагов соответствующий модуль был найден, то дальнейшие шаги игнорируются - в шаблоны попадает первый найденный.

Таким образом, если модуль доступен в глобальной переменной, то внутрь шаблонов попадет значение переменной, даже если существует нужный модуль в CommonJS/YM.

И также, модуль из CommonJS приоритетнее модуля в YModules.

**Пример подключения библиотеки `moment`**

Указывается путь к модулю:

```js
{
    requires: {
        moment: {
            commonJS: 'moment'  // Путь к модулю CommonJS относительно собираемого файла
        }
    }
}
```

В шаблонах модуль будет доступен с помощью метода `this.require('moment')`. Код шаблона пишется один раз, одинаково для исполнения в браузере и в `Node.js`:

```js
block('post').elem('data')({
    content() {
        var moment = this.require('moment');  // Библиотека `moment`
        return moment(this.ctx.date) // Время в ms, полученное с сервера
            .format('YYYY-MM-DD HH:mm:ss');
    }
});
```

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
templates.compile(() => {
    block('b')({
        content: (node) => node.hi('templates')
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

## Создание бандла

Метод `generate` генерирует JS-код, который может быть передан и выполнен в браузере для получения объекта `templates`.

```js
var bemxjst = require('bem-xjst');
var bemhtml = bemxjst.bemhtml;

var fs = require('fs');

var bundle = bemhtml.generate(() => {
    // пользовательские шаблоны
    // ...

}, { exportName: 'bemhtml8x' });

// Записываем бандл на файловую систему
fs.writeFile('bundle.js', bundle, (err) => {
  if (err) return console.error(err);
  console.log('Done');
});
```

В результате вы получите файл `bundle.js`, в котором будет лежать код движка и
пользовательские шаблоны. Код движка будет доступен в переменной bemhtml8x и
полностью готов к исполению в браузерах, node.js или любой виртуальной машине
JS.

## Source maps

В опциях шаблонизатора у вас есть возможность указать данные про карты кода

* `to` {String} — имя выходного бандла-файла
* `sourceMap.from` {String} — имя файла
* `sourceMap.prev` {Object} — предыдущие карты кода

Пример генерирования бандла с шаблонами и ядром bem-xjst с использованием карт кода:

```js
var fs = require('fs'),
    bemxjst = require('bem-xjst').bemhtml,
    tmpl = 'my-block-1.bemhtml.js',
    bundle = 'bundle.bemhtml.js';

var result = bemxjst.generate(fs.readFileSync(tmpl, 'utf8'), {
    to: bundle,
    sourceMap: { from: tmpl }
});

fs.writeFileSync(bundle, result);
```

Так же [смотрите примеры](../../examples/source-maps/) по использованию карт кода вместе с шаблонизатором.

Читать далее: [входные данные](4-data.md)
