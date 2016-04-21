# Runtime

- [Как работает runtime шаблонизатора](#how-it-works)
- [Шаблоны на любые сущности](#wildcard)
- [Инструкции управления](#methods)
  - [apply](#apply): вызвать указанный режим
  - [applyNext](#applynext): применить к узлу шаблоны с меньшим приоритетом, чем текущий
  - [applyCtx](#applyctx): применить шаблоны к произвольному BEMJSON-у

## <a name="how-it-works"></a>Как работает runtime шаблонизатора

Шаблонизатор bem-xjst обладает встроенным механизмом обхода дерева входных данных. Это дерево рекурсивно обходится в прямом порядке и для каждого узла ищется подходящий шаблон.

В теле шаблона текущий узел может быть подменен на другой или дополнен новыми. В этом случае шаблонизатор попытается примерить шаблоны на все новые узлы.

Если вы не добавили ни одного шаблона, то bem-xjst сгенерирует результат по умолчанию. Это поведение [описано разделе про режимы](5-templates-syntax.md#body).

### <a name="matching"></a>Как выбираются и применяются шаблоны?

Шаблоны находятся в упорядоченном списке. Шаблоны проверяются в обратном
порядке, то есть последние шаблоны приоритетнее первых (с учетом особенностей
[wildcard](#wildcard)). Для каждого узла входного дерева шаблонизатор проверяет предикат каждого шаблона. Для этого выполняются все подпредикаты в контексте узла. Если все подпредикаты вернули `true`, дальнейший поиск шаблона прекращается и выполняется тело текущего.

Если шаблон не найден, то будет использовано поведение по умолчанию.


## <a name="wildcard"></a>Шаблоны на любые сущности

В предикатах вы можете писать `*` вместо имени блока или элемента. Например, это может быть полезно для единообразной обработки всех блоков.

Входной BEMJSON:
```js
[
    { block: 'header' },
    { block: 'link', mix: [{ block : 'title' }], counter: '15498653' },
    { block: 'snippet', counter: '15498653' }
]
```
```js
block('*')
    .match(function() {
        return this.ctx.counter;
    })
    .mix()(function() {
        return { block: 'counter', js: { id: this.ctx.counter } }
    })
```

Результат рендеринга HTML
```html
<div class="header"></div>
<div class="link counter title i-bem" data-bem='{"counter":{"id":"15498653"}}'></div>
<div class="snippet counter i-bem" data-bem='{"counter":{"id":"15498653"}}'></div>
```

Шаблон с подпредикатом на `*` будет приоритетнее, чем шаблон с конкретным именем в подпредикате. Это связано с оптимизацией производительности. На практике тяжело столкнутся с ситуациями, когда это имеет значение.

Подпредикат блока на `*` будет истинным на пустой объект.

## <a name="methods"></a>Инструкции управления

### apply
```js
/**
 * @params {String} modeName название режима
 * @params {Object} [assignObj] объект, поля которого будут доступны
 *                              в this в теле шаблона
 * @returns {*} Возвращает результат работы режима
 */
apply(modeName, assignObj)
```

Применяется для вызова стандартного или пользовательского режима текущего узла.

Пример использования:
BEMJSON:
```js
{ block: 'button' }
```

Шаблон:
```js
block('button')(
    mode('test')(function() {
        return this.tmp + this.ctx.foo;
    }),
    def()(function() {
        return apply('test', {
            tmp: 'ping',
            'ctx.foo': 'pong'
        });
    })
);
```

Результат шаблонизации BEMHTML:
```html
pingpong
```

С помощью `apply` нельзя вызывать пользовательские режимы для других блоков. Пример:
```js
// BEMJSON
[
    { block: 'header' },
    { block: 'footer' }
]
```
Шаблон:
```js
block('footer').mode('custom')('footer');
block('header').mode('custom')('header');
block('header').tag()(function() {
    // не смотря на то, что вторым аргументом apply явно указан блок footer
    // будет вызван пользовательский режим блока `header`.
    return apply('custom', { block: 'footer' });
});
```

```html
<header class="header"></header>
<div class="footer"></div>
```

### applyNext
```js
/**
 * @param {Object} [newctx] объект, ключи которого становятся полями
 *                          контекста при выполнении шаблона
 * @returns {*}
 */
applyNext(newctx)
```

Конструкция `applyNext` возвращает результат работы следующего по приоритету шаблона в текущем режиме для текущего узла.

Пример:

```js
block('link').tag()('a');
block('link').tag()(function() {
    var res = applyNext(); // res === 'a'
    return res;
});
```


### applyCtx
```js
/**
 * @param {BEMJSON} bemjson входные данные
 * @param {Object} [newctx]
 * @returns {String}
 */
applyCtx(bemjson, newctx)
```

Конструкция `applyCtx` предназначена для модификации текущего фрагмента БЭМ-дерева `this.ctx` с вызовом процедуры применения шаблонов `apply()`.

Пример BEMJSON:
```js
{ block: 'header', mix: [{ block: 'sticky' }] }
```

```js
block('header').def()(function() {
    return applyCtx(this.extend(this.ctx, {
        block: 'layout',
        mix: [{ block: 'header' }].concat(this.ctx.mix || [])
    }));
});
```
Результат шаблонизации:
```html
<div class="layout header sticky"></div>
```

***
