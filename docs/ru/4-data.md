# Входные данные — BEMJSON

## Введение

Любой JS-объект уже можно считать BEMJSON-ом. Но, чтобы управлять результатом шаблонизации, нам понадобятся стандартные поля, которые [bem-xjst](1-about.md) ожидает.

## Соглашение о стандартных полях BEMJSON

* [block](#block) — имя блока
* [elem](#elem) — имя элемента
* [mods](#mods) — хеш модификаторов блока
* [elemMods](#elemmods) — хеш модификаторов элемента
* [content](#content) — дочерние узлы
* [mix](#mix) — БЭМ-сущности, которые нужно примиксовать
* [bem](#bem) — нужно ли добавлять классы и JS-параметры для самой БЭМ-сущности и её миксов
* [js](#js) — JS-параметры
* [attrs](#attrs) — хеш HTML-атрибутов
* [cls](#cls) — HTML-класс
* [tag](#tag) — HTML-тег
* [пользовательские поля](#Пользовательские-поля)

### block

`{String}` имя блока.

```js
// BEMJSON
{ block: 'page' }
```

### elem

`{String}` имя элемента.

```js
// BEMJSON
{
    block: 'page',
    content: {
        // В этом узле блок указывать необязательно, он берётся из контекста (page).
        elem: 'header'
    }
}
```

### mods

`{Object}` хеш модификаторов блока. Ключами могут быть любые корректные ключи для JS-объектов. Значения могут быть типа `String` или `Boolean`.

```js
// BEMJSON
{
    block: 'tab',
    mods: { name: 'index', visible: true }
}
```

Результат шаблонизации BEMHTML:

```html
<div class="tab tab_name_index tab_visible"></div>
```

`mods` будет проигнорирован если указаны `elem` и `elemMods`.

```js
// BEMJSON
{
    block: 'control',
    // Будет проигнорирован, так как указаны elem и elemMods
    mods: { type: 'nav' },
    elem: 'input',
    elemMods: { type: 'search' }
}
```

Результат шаблонизации BEMHTML:

```html
<div class="control__input control__input_type_search"></div>
```

### elemMods

`{Object}` хеш модификаторов элемента. `elemMods` не будет учитываться, если не указан элемент.

```js
// BEMJSON
{
    block: 'page',
    elem: 'header',
    elemMods: { type: 'search' }
}
```

### content

`{*}` Дочерние узлы.
```js
// BEMJSON
{
    block: 'page'
    content: [
        { block: 'header'},
        { block: 'article', content: '…' },
        '© 2017'
    ]
}
```

Объект с полем `html` является специальным типом возможных объектов в BEMJSON. Все другие
поля в этом объекте будут проигнорированы. В поле `html` ожидается строка, которая будет выведена без изменений.

```js
{
    block: 'markup',
    content: {
        html: '<code>new Date();</code>'
    }
}
```

Результатом шаблонизации BEMHTML будет:

```html
<div class="markup"><code>new Date();</code></div>
```

### mix

`{Object|Object[]|String}` БЭМ-сущности, которые нужно [примиксовать](https://ru.bem.info/methodology/key-concepts/#Микс) к текущей.

```js
// BEMJSON
{
    block: 'link',
    mix: { block: 'controller' }
}
```

Результат шаблонизации BEMHTML:

```html
<div class="link controller"></div>
```

### js

`{Boolean|Object}` JS-параметры. Если значение не false, то миксует `i-bem` и добавляет содержимое в JS-параметры. По умолчанию `undefined`.

Подробнее про [i-bem и JS-параметры](https://ru.bem.info/platform/i-bem/parameters/).

```js
// BEMJSON
{
   block: 'link',
   js: true
}
```

Результат шаблонизации BEMHTML:

```html
<div class="link i-bem" data-bem='{"link":{}}'></div>
```

Значения будут экранированы:

```js
// BEMJSON
{
   block: 'link',
   js: { title: 'film "Sid & Nancy"' }
}
```

Результат шаблонизации BEMHTML:

```html
<div class="link i-bem" data-bem='{"link":{title:"film &#39;Sid &amp; Nancy&#39;"}}'>
</div>
```

### bem

`{Boolean}` указывает шаблонизатору, нужно ли добавлять классы и JS-параметры для самой БЭМ-сущности и её миксов. По умолчанию `true`.

```js
// BEMJSON
{
    block: 'menu',
    elem: 'item',
    bem: false
}
```

Результат шаблонизации BEMHTML:

```html
<div></div>
```

### attrs

`{Object}` хеш HTML-атрибутов. Значения атрибутов [будут экранированны функцией attrEscape](6-templates-context.md#attrescape).

```js
// BEMJSON
{
    attrs: {
        id: 'anchor',
        name: 'Мультфильм "Tom & Jerry"'
    }
}
```

Результат шаблонизации BEMHTML:

```html
<div id="anchor" name="Мультфильм &quot;Tom &amp; Jerry&quot;"></div>
```

### cls

`{String}` HTML-класс или классы (через пробел), не принадлежащие к предметной области БЭМ. Например, применение [микроформатов](http://microformats.org/) или семантической разметки из [schema.org](https://schema.org/).

```js
// BEMJSON
{
    block: 'user',
    cls: 'h-card p-name',
    content: 'Андрей Линде'
}
```

Результат шаблонизации BEMHTML:

```html
<div class="user h-card p-name">Андрей Линде</div>
```

### tag

`{Boolean|String}` HTML-тег. `false` или `''` укажет движку BEMHTML пропустить этап генерации HTML-тега. По умолчанию `div`.

```js
// BEMJSON
{
    tag: false,
    content: 'start'
}
```

Результат шаблонизации BEMHTML:

```html
start
```

### Пользовательские поля

Вы можете добавлять любые другие поля с данными, чтобы потом обработать их в теле шаблона по своему усмотрению.

```js
// BEMJSON
{
    block: 'link'
    url: '/',
    target: '_blank'
}
```

Подробнее о том, как обрабатывать пользовательские поля BEMJSON, читайте в разделе про [шаблоны](5-templates-syntax.md).

***

Читать далее: [синтаксис шаблонов](5-templates-syntax.md)
