# Что доступно в теле шаблона?

В процессе обхода входных данных bem-xjst строит контекст, который будет содержать:

* [нормализованные сведения о текущей БЭМ-сущности](#normalized)
* [текущий узел BEMJSON](#ctx)
* [хелперы](#helpers)
* [кастомные пользовательские поля](#user-defined)
* [методы для управления шаблонизацией](#methods)

## <a name="normalized"></a>Нормализованные сведения о текущей БЭМ-сущности

Шаблонизатор нормализует сведения о текущей БЭМ-сущности. В текущем BEMJSON-узле могут быть неполные сведения о БЭМ-сущности. Например:

```js
{
    block: 'page',
    content: {
        elem: 'top'
        // У узла нет поля block.
        // Но шаблонизатор поймет, в контексте
        // какого блока находится элемент top.
    }
}
```

Поля с нормализованными данными:
* `this.block` {String} блок в текущем узле, либо блок БЭМ-сущности, в контексте которой находится текущий узел.
* `this.elem` {String} элемент в текущем узле
* `this.mods` {Object} модификаторы блока, явно указанные в текущем узле
* `this.elemMods` {Object} модификаторы элемента, явно указанные в текущем узле

Обратите внимание, что объекты `this.mods` и `this.elemMods` всегда присутствуют, поэтому проверки на их наличие в теле шаблона избыточные:
```js
block('page').match(function() {
    // Избыточно:
    return this.mods && this.mods.type === 'index' && this.ctx.weather;
    // Достаточно:
    return this.mods.type === 'index' && this.ctx.weather;
}).def()(function() { return … });
```


## <a name="ctx"></a>Текущий узел BEMJSON
В поле `this.ctx` доступен текущий узел BEMJSON.

Пример:
```js
{
    block: 'company',
    name: 'yandex'
}
```

```js
block('link').attr()(function() {
    return {
        id: this.ctx.url,
        name: this.ctx.url
    };
});
```
Результат шаблонизации BEMHTML:
```html
<div class="company" id="yandex" name="yandex"></div>
```


## <a name="helpers"></a>Хелперы
### Методы для экранирования

#### xmlEscape
```js
/**
 * @param {String} str
 * @returns {String}
 */
this.xmlEscape(str)
```
Возвращает переданную строку `str` с заэкранированными символами XML: `&`, `<`, `>`.

Пример использования:
```js
{ block: 'button' }
```
Шаблон:
```js
block('button').def()(function() {
    return this.xmlEscape('<b>&</b>');
});
```
Результат шаблонизации BEMHTML:
```html
&lt;b&gt;&amp;&lt;/b&gt;
```

#### attrEscape
```js
/**
 * @param {String} str
 * @returns {String}
 */
this.attrEscape(str)
```
Возвращает переданную строку `str` с заэкранированными символами XML- и HTML-атрибутов: `"` и `&`.

#### jsAttrEscape
```js
/**
 * @param {String} str
 * @returns {String}
 */
this.jsAttrEscape(str)
```
Возвращает переданную строку `str` с заэкранированными символами: `'` и `&`.

По умолчанию входные данные из поля [`js`](4-data.md#js) и данные из режима [`js`](5-templates-syntax.md#js) экранируются этой функцией.


### Хелперы определения позиции

#### `this.position`

Позиция в БЭМ-дереве (поле контекста `this.position`) представляет собой натуральное число, соответствующее порядковому номеру текущей (контекстной) БЭМ-сущности среди её соседей в дереве (одноранговых сущностей).

При вычислении позиции:
* Нумеруются только те узлы обрабатываемого BEMJSON, которые соответствуют БЭМ-сущностям.
* Прочим узлам не соответствует никакой номер позиции.
* Позиции нумеруются начиная с 1.

Пример нумерации позиций во входном БЭМ-дереве:
```js
{
    block: 'page',          // this.position === 1
    content: [
        { block: 'head' },    // this.position === 1
        'text',               // this.position === undefined
        {
            block: 'menu',      // this.position === 2
            content: [
                { elem: 'item' }, // this.position === 1
                'text',           // this.position === undefined
                { elem: 'item' }, // this.position === 2
                { elem: 'item' }  // this.position === 3
            ]
        }
    ]
}
```

БЭМ-дерево может быть достроено в процессе выполнения шаблонов с помощью шаблонов в режиме `[def](5-templates-syntax.md#def)` или `[content](5-templates-syntax.md#content)`. Такое динамическое изменение БЭМ-дерева учитывается при вычислении позиции.

Функция определения последней БЭМ-сущности среди соседей `isLast` возвратит `false`, если в массиве, содержащем узлы, последний элемент не является БЭМ-сущностью. Например:
```js
block('list')(
    content()([
        { block: 'item1' },
        { block: 'item2' }, // this.isLast() === false
        'text'
    ])
);
```

Такое поведение объясняется тем, что в целях оптимизации BEMHTML не выполняет
предварительного обхода БЭМ-дерева. Поэтому в момент обработки блока `item2` уже
известна длина массива (`item2` не является последним элементом), но еще неизвестно, что последний элемент не является БЭМ-сущностью и не получит номера позиции.

На практике описанный случай не должен порождать ошибок, так как проверка на первую/последнюю БЭМ-сущность обычно применяется к автоматически сгенерированным спискам, в которые не имеет смысла включать данные других типов.

#### isFirst
```js
/**
 * @returns {Boolean}
 */
this.isFirst()
```
Проверяет, является ли узел первым среди своих соседей во входном дереве.

#### isLast
```js
/**
 * @returns {Boolean}
 */
this.isLast()
```
Проверяет, является ли узел последним среди своих соседей во входном дереве.


### Генератор уникальных идентификаторов

#### `this.generateId()`

Генерирует id для текущего узла.

Пример использования:
```js
// BEMJSON
{ block: 'input', label: 'Имя', value: 'Иван' }
```
Шаблон
```js
block('input').content()(function() {
    var id = this.generateId();

    return [
        {
            tag: 'label',
            attrs: { for: id },
            content: this.ctx.label
        },
        {
            tag: 'input',
            attrs: {
                id: id,
                value: this.ctx.value
            }
        }
    ];
});
```
Результат шаблонизации BEMHTML:
```html
<div class="input">
    <label for="uniq14563433829878">Имя</label>
    <input id="uniq14563433829878" value="Иван" />
</div>
```

### Другие хелперы
* `this.isSimple({*} arg)` Проверяет, является ли `arg` примитивным JavaScript-типом.
* `this.isShortTag({String} tagName)` Проверяет, является ли `tagName` тегом, не требующим закрывающего элемента.

### `this.reapply()`
Это возможность отшаблонизировать произвольные BEMJSON-данные, находясь в теле шаблона и получить в результате строку.

BEMJSON:
```js
{ block: 'a' }
```
Шаблон:
```js
block('a').js()(function() {
    return {
        template: this.reapply({ block: 'b', mods: { m: 'v' } })
    };
});
```
Результат шаблонизации BEMHTML:
```html
<div class="a i-bem" data-bem='{
    "a":{"template":"<div class=\"b b_m_v\"></div>"}}'></div>
```


## <a name="user-defined"></a>Кастомные пользовательские поля

Контекст, доступный в теле шаблона, может быть расширен пользователем.

При помощи функции `oninit` в коде шаблонов:
```js
var bemxjst = require('bem-xjst');

var templates = bemxjst.bemhtml.compile(function() {
    // Внимание: oninit сработает только при первой компиляции шаблонов.
    oninit(function(exports, shared) {
        shared.BEMContext.prototype.hi = function(name) {
            return 'Hello, ' + username;
        };
    });

    block('b').content()(function() {
        return this.hi('username');
    });
});

var bemjson = { block: 'b' };

// Применяем шаблоны
var html = templates.apply(bemjson);
```
html будет содержать строку:
```html
<div class="b">Hello, username</div>
```

При помощи прототипа BEMContext:
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
var bemjson = { block: 'b' };
// Применяем шаблоны
var html = templates.apply(bemjson));
```
В результате `html` будет содержать строку:
```html
<div class="b">Hello, templates</div>
```

## <a name="methods"></a>Методы для управления шаблонизацией

В теле шаблонов доступны методы `local`, `apply`, `applyNext` и `applyCtx`. Подробнее о них читайте в следующей секции про runtime.
***

Читать далее: [runtime](7-runtime.md)
