# Синтаксис шаблонов

Пользовательские шаблоны — основная часть программы на bem-xjst. Шаблон состоит из [предиката](#Предикат-шаблона) и [тела](#Тело-шаблона).

## Предикат шаблона

Для каждого узла входного дерева шаблонизатор проверяет условия, указанные в шаблонах. Эти условия называются подпредикатами и составляют предикат шаблона.

Условия могут быть простыми — проверка имени блока/элемента или более сложными и составными — проверка значений произвольных полей в текущем узле BEMJSON.

## Список подпредикатов

* [block](#block)
* [elem](#elem)
* [mod](#mod)
* [elemMod](#elemmod)
* [match](#match)

### block

```js
/**
 * @param {String} name имя блока
 */
block(name)
```
В качестве `name` можно использовать [`'*'`](7-runtime.md#Шаблоны-на-любые-сущности).

Каждый шаблон должен содержать подпредикат имени блока, иначе шаблонизатор бросит ошибку: `BEMHTML error: block('…') not found in one of the templates`.

Пример. Подпредикат блока `link`:

```js
block('link')
```

Входные данные:

```js
[
    // на этот блок предикат вернет `true` и шаблон будет применён
    { block: 'link' },

    // на все следующие сущности предикат вернет `false` и шаблон не будет применён
    { block: 'para' },
    'link',
    { block: 'link', elem: 'text' }
]
```

### elem

```js
/**
 * @param {String} name имя элемента
 */
elem(name)
```

Проверка элемента. В качестве `name` можно использовать [`'*'`](7-runtime.md#Шаблоны-на-любые-сущности).

### mod

```js
/**
 * @param {String} modName имя модификатора блока
 * @param {String|Boolean} [modVal] значение модификатора блока
 */
mod(modName, modVal)
```

Проверка значения модификатора блока.

На узел применятся шаблоны: как на блок, так и на соответствующие модификаторы.

Пример:

```js
{ block: 'page', mods: { type: 'index' } }
```

Шаблоны:

```js
block('page').tag()('body');
block('page').mod('type', 'index').mix()({ block: 'mixed' });
```

Оба шаблона будут применены. Результат будет:

```html
<body class="page page_type_index mixed"></body>
```

`modVal` проверяются на соответствие после приведения к строке. Пример:

```js
{
  block: 'item',
  mods: {
      size: 1 // Обратите внимание, что тип значения модификатора size — Number
  }
}
```

Шаблоны:

```js
block('item')
  .mod('size', '1') // Здесь тип значения модификатора — String
  .tag()('small');
```

Шаблон будет применен, так как bem-xjst проверит значения `modVal` на соответствие после приведения их к строке. Результат будет:

```html
<small class="item item_size_1"></small>
```

Если второй аргумент `mod()` отсутствует тогда к узлу будут
применены шаблоны для соответствующего модификатора с любым значением.

```js
block('a').mod('size').tag()('span');
```
Шаблон будет применен к узлам BEMJSON-а, у которых блок равен 'a' и
присутствует модификатор 'size' (со значением отличным от `undefined`, `''`,
`false`, `null`).

```js
{ block: 'a', mods: { size: 's' } },
{ block: 'a', mods: { size: 10 } },
```

Но шаблоны не будут применены к узлам:
```js
{ block: 'a', mods: { size: '', theme: 'dark' } }
{ block: 'a', mods: { theme: 'dark' } },
{ block: 'a', mods: { size: undefined } },
{ block: 'a', mods: {} }
```


### elemMod

```js
/**
 * @param {String} elemModName имя модификатора элемента
 * @param {String|Boolean} [elemModVal] значение модификатора элемента
 */
elemMod(elemModName, elemModVal)
```

Проверка значения модификатора элемента.

На узел применятся шаблоны: как на элемент, так и на соответствующие модификаторы.

Пример:

```js
{ block: 'page', elem: 'content', elemMods: { type: 'index' } }
```

Шаблоны:

```js
block('page').elem('content').tag()('body');
block('page').elem('content').elemMod('type', 'index').mix()({ block: 'mixed' });
```

Оба шаблона будут применены. Результат будет:

```html
<body class="page__content page__content_type_index mixed"></body>
```

`elemModVal` проверяются на соответствие после приведения к строке. Это поведение аналогично поведению проверки `modVal`.

Второй аргумент `elemMod()` также может отстуствовать, в этом случае поведение
аналогичное подпредикату `mod()` — шаблоны будут применены к узлам с модификатором любого значения.

### match

```js
/**
 * @param {Function} Проверка произвольного условия.
 *                   Результат будет приведен к `Boolean`.
 */
match(function() { return … })
```

Проверка произвольного условия. В контексте функции будут доступны все [поля, доступные в теле шаблона](6-templates-context.md). Результат выполнения функции будет приведён к `Boolean`.

Порядок проверки `match` гарантируется. Порядок проверки остальных предикатов не важен.

```js
block('*').match(function() { return false; })(
    // Тело этого шаблона не будет вызвано, потому что условие возвратило `false`
    ...
);
```

### Цепочки подпредикатов

Подпредикаты можно выстраивать в цепочки:

```js
block('page')
    .mod('theme', 'white')
    .elem('content')
    .match(function() {
        return this.ctx.weather === 'hot';
    })
```

Следующие два шаблона эквивалентны с точки зрения bem-xjst:

```js
block('link').elem('icon')
elem('icon').block('link')
```

### Вложенные подпредикаты

Чтобы не повторять одинаковые подпредикаты, например, для блока `link`:

```js
block('link').elem('icon')
block('link').elem('text')
```

…можно использовать вложенную структуру: подпредикаты помещаются в тело общего подпредиката и отделяются друг от друга запятыми.

```js
block('link')(
    elem('icon')(тело_шаблона_1),
    elem('text')(тело_шаблона_2)
);
```

Уровень вложенности подпредикатов не ограничен.

## Тело шаблона

Тело шаблона — инструкции по генерации результата работы шаблонизатора над текущим узлом BEMJSON-а.

Шаблонизация каждого узла входных данных состоит из фаз, называемых режимами. Каждый режим отвечает за генерацию отдельного фрагмента результата.

Например, для BEMHTML это может быть HTML-тег, HTML-класс, HTML-атрибуты, содержание тега и т.д.

```html
<!-- Режим `def` -->
<div <!-- открывающий и закрывающий элемент HTML-тега зависит от режима `tag` -->
    class="
        link   <!-- имя строится из полей block, mods, elem, elemMods -->
        mixed  <!-- режим `mix` -->
        cls    <!-- режим `cls` -->
        i-bem  <!-- режим `js` -->
    "

    <!-- режим `bem` -->
    data-bem='{"link":{}}'

    <!-- режим `attr` -->
    id="my-dom-node"
>
    Содержимое тега <!-- режим `content` -->
</div> <!-- закрывающий элемент тега тоже зависит от режима `tag` -->
```

Подробное описание каждого режима мы рассмотрим ниже. А пока уделим внимание их синтаксису.

Каждый режим — это вызов функции. Нельзя передавать аргументы в сам режим.

Тело шаблона — это отдельный вызов функции, которая ожидает аргумент.

```js
// Неправильно:
block('b').content('test');
// Будет брошена ошибка BEMHTML error: Predicate should not have arguments

// Правильно:
block('b').content()('test');
```

Для входных данных:

```js
{ block: 'link', url: 'https://yandex.ru', content: 'Яндекс' }
```

И шаблона:

```js
block('link')(
    tag()('a'),
    attrs()(function() {
        return { href: this.ctx.url };
    })
);
```

Результат шаблонизации BEMHTML будет:

```html
<a class="link" href="https://yandex.ru">Яндекс</a>
```

### Описание стандартных режимов

* [def](#def)
* [tag](#tag)
* [attrs](#attrs)
* [content](#content)
* [mix](#mix)
* [js](#js)
* [bem](#bem)
* [cls](#cls)
* [replace](#replace)
* [wrap](#wrap)
* [extend](#extend)
* [Пользовательские режимы](#Пользовательские-режимы)

#### def

```js
/**
 * @param {function|Array|Object[]} value
 */
def()(value)
```

Особый статус имеет режим `def` (сокращение от default), который отвечает за генерацию результата в целом. В рамках этого режима задан набор и порядок прохождения остальных режимов, а также определена процедура сборки финального представления HTML-элемента или BEMJSON из фрагментов, сгенерированных в остальных режимах.

Режим является особым и не стоит использовать его без особой надобности. Пользовательский шаблон, переопределяющий `def`, отключает вызовы остальных режимов по умолчанию.

#### tag

```js
/**
 * @param {Function|String} name
 */
tag()(name)
```

HTML-тег. `false` или `''` укажет движку BEMHTML пропустить этап генерации HTML-тега. По умолчанию `div`.

#### attrs

```js
/**
 * @param {function|Object} value
 */
attrs()(value)
```

Хеш с HTML-атрибутами. Значения атрибутов [будут экранированны функцией attrEscape](6-templates-context.md#attrescape).

#### content

```js
/**
 * @param {*} value
 */
content()(value)
```

Дочерние узлы. По умолчанию будет взято из поля `content` текущего узла BEMJSON.

Чтобы добавить дочерний узел в содержимое вы можете воспользоваться режимами
`appendContent` и `prependContent`.

```js
block('quote')(
    prependContent()('«'),
    appendContent()('»'),
    appendContent({ block: 'link' });
);
```
```js
{ block: 'quote', content: 'Пришел, увидел, отшаблонизировал' }
```
Результатом шаблонизации будет строка:
```html
<div class="quote">«Пришел, увидел, отшаблонизировал»<div class="link"></div></div>
```

`appendContent()` и `prependContent()` это синтаксический сахар над `content()` + `applyNext()`:

```js
// appendContent()('еще') тоже самое что и:
content()(function() {
    return [
        applyNext(),
        'еще'
    ];
});

// prependContent()('еще') тоже самое что и:
content()(function() {
    return [
        'еще',
        applyNext()
    ];
});
```

#### mix

```js
/**
 * @param {function|Object|Object[]|String} mixed
 */
mix()(mixed)
```

БЭМ-сущности, которые нужно [примиксовать](https://ru.bem.info/method/key-concepts/#Микс) к текущей.

Пример использования:

```
block('link').mix()({ block: 'mixed' });
block('button').mix()([ { block: 'mixed' }, { block: 'control' } ]);
block('header').mix()(function() { return { block: 'mixed' }; });
```

#### js

```js
/**
 * @param {function|Boolean|Object} value
 */
js()(value)
```

JS-параметры. Если значение не falsy, то миксует `i-bem` и добавляет содержимое в JS-параметры. Подробнее про [i-bem и JS-параметры](https://ru.bem.info/platform/i-bem/parameters/). Данные [будут экранированны функцией jsAttrEscape](6-templates-context.md#jsattrescape).

#### bem

```js
/**
 * @param {function|Boolean} value
 */
bem()(value)
```

Указывает шаблонизатору, нужно ли добавлять классы и JS-параметры для самой БЭМ-сущности и её миксов. По умолчанию `true`.

#### cls

```js
/**
 * @param {function|String} value
 */
cls()(value)
```

Добавить произвольный HTML-класс, не относящийся к предметной области БЭМ.

### Режимы-хелперы

#### replace

Для подмены текущего узла (сматчились на узел, а рендерим произвольную сущность).

```js
// BEMJSON
{ block: 'resource' }
```

Шаблоны:

```js
block('link').tag()('a');
block('resource').replace()({ block: 'link' });
```

Результат шаблонизации BEMHTML:

```html
<a class="link"></a>
```

`replace` нельзя использовать для замены себя с обёрткой, иначе будет бесконечный цикл.

#### wrap

Обернуть текущий узел в дополнительную разметку.

Пример:

```js
// BEMJSON
{
    block: 'quote',
    content: 'Docendo discimus'
}
```

Шаблон:

```js
block('quote').wrap()(function() {
    return {
        block: 'wrap',
        content: this.ctx
    };
});
```

Результат шаблонизации BEMHTML:

```html
<div class="wrap">
    <div class="quote">Docendo discimus</div>
</div>
```

#### extend

Доопределить контекст исполнения шаблонов.

Пример:

```js
// BEMJSON
{ block: 'action' }
```

Шаблоны:

```js
block('action').extend()({ 'ctx.type': 'Sale', sale: '50%' });
block('action').content()(function() {
    return this.ctx.type + ' ' + this.sale;
});
```

Результат шаблонизации BEMHTML:

```html
<div class="action">Sale 50%</div>
```

`extend()` может использоваться для прокидывания данных во все дочерние узлы
через контекст выполнения шаблонов.

Пример:

```js
block('page').extend()({ meaning: 42 });
block('*').attrs()(function() { return { life: this.meaning }; });
```

```js
// BEMJSON
{ block: 'page', content: { block: 'wrap', content: { block: 'para' } }
```

```html
<div class="page" life="42"><div class="wrap" life="42"><div class="para"
life="42"></div></div></div>
```

## Пользовательские режимы

Вы можете определить свой режим и использовать его в теле шаблона.

```js
// BEMJSON
{ block: 'control', name: 'username', value: 'miripiruni' }
```

Шаблон:

```js
block('control')(
    mode('id')('username-control'), // Пользовательский режим с именем id
    content()(function() {
        return [
            {
                elem: 'label',
                attrs: { for: apply('id') } // Вызов пользовательского режима
            },
            {
                elem: 'input',
                attrs: {
                    name: this.ctx.name,
                    value: this.ctx.value,
                    id: apply('id'),  // Вызов пользовательского режима
                }
            }
        ];
    }),
    elem('input').tag()('input'),
    elem('label').tag()('label')
);
```

Результат шаблонизации BEMHTML:

```html
<div class="control">
    <label class="control__label" for="username-control"></label>
    <input class="control__input" name="username"
        value="miripiruni" id="username-control" />
</div>
```

Подробнее про [apply()](7-runtime.md#apply).

## BEMTREE

Движком BEMTREE используются только режимы [def](#def), [content](#content) и
режимы-хелперы [replace](#replace), [extend](#extend) и [wrap](#wrap). Пользовательские режимы тоже могут быть использованы. Остальные режимы, описанные в документации выше, применимы только к BEMHTML.

***

Читать далее: [что доступно в теле шаблона?](6-templates-context.md)
