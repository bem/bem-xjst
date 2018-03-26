# Runtime

* [How the template engine runtime works](#how-the-template-engine-runtime-works)
* [Templates for any entities](#templates-for-any-entities)
* [Instructions for controlling runtime](#instructions-for-controlling-runtime)
  * [apply](#apply): call the specified mode
  * [applyNext](#applynext): apply templates with lower priority than the current one to the node
  * [applyCtx](#applyctx): apply templates to any BEMJSON

## How the template engine runtime works

The bem-xjst template engine has a built-in mechanism for transversing the input data tree. This tree is recursively pre-order transversed, searching for an appropriate template for each node.

In the template body, the current node can be replaced with another one or have a new one appended. In this case, the template engine tries to fit the templates to all the new nodes.

If you didn’t add any templates, bem-xjst generates the result using defaults. This behavior is [described in the section on modes](5-templates-syntax.md#body).

### How templates are selected and applied

Templates are located in an ordered list. Templates are checked in reverse order, meaning the last templates take priority over the first ones (taking the wildcard](#templates-for-any-entities) into account).

For each node of the input tree, the template engine checks the predicate of each template. To do this, all the subpredicates are executed in the context of the node. If all the subpredicates returned `true`, the template search ends and the body of the current template is executed.

If a template is not found, the default behavior is used.

## Templates for any entities

You can write `*` in predicates instead of the name of a block or element. For example, this may be useful for uniform processing of all blocks.

BEMJSON input:

```js
[
    { block: 'header' },
    { block: 'link', mix: [{ block : 'title' }], counter: '1549865' },
    { block: 'snippet', counter: '1549865' }
]
```

Template:

```js
block('*').match((node, ctx) => ctx.counter)({
    mix: () => ({ block: 'counter', js: { id: this.ctx.counter } })
})
```

*Result of templating:*

```html
<div class="header"></div>
<div class="link counter title i-bem" data-bem='{"counter":{"id":"1549865"}}'></div>
<div class="snippet counter i-bem" data-bem='{"counter":{"id":"1549865"}}'></div>
```

A template with a subpredicate for `*` takes higher priority than a template with a specific name in the subpredicate. This is related to performance optimization. In practice, you are unlikely to encounter a situation where this matters.

A subpredicate for a `*` block is true for an empty object.

## Instructions for controlling runtime

### apply

```js
/**
 * @params {String} modeName mode name
 * @params {Object} [changes] object whose fields will be available
 *                              in 'this' in the template body
 * @returns {*} Returns the result of running the mode
 */
apply(modeName, changes)
```

Used for calling a standard or user-defined mode of the current node.

```js
{ block: 'button' }
```

Template:

```js
block('button')({
    test: (node, ctx) => this.tmp + this.ctx.foo,
    def: () => apply('test', {
        tmp: 'ping',
        'ctx.foo': 'pong'
    })
});
```

*Result of templating:*

```html
pingpong
```

You can use custom mode (with name `size` for example) and it’s call `apply('size')` for redefininig on different levels or different conditions (with `match`).

Suppose you have different levels: common, touch and desktop. On common level you write:

```js
block('my-block')({
    size: 'm',
    content: () => ({
        block: 'button',
        size: apply('size')
    })
});

On touch level:

```js
block('my-block').mode('size')('l');
```

And on desktop level:

```js
block('my-block').mode('size')('s');
```


You can’t use `apply` to call user-defined modes for other blocks.

```js
// BEMJSON
[
    { block: 'header' },
    { block: 'footer' }
]
```

Template:

```js
block('footer')({ custom: 'footer' });
block('header')({
    custom: 'header',

    // despite the fact that the second 'apply' argument explicitly
    // specifies the 'footer' block,
    // the user-defined mode of the 'header' block will be called.
    tag: () => apply('custom', { block: 'footer' })
});
```

*Result of templating:*

```html
<header class="header"></header><div class="footer"></div>
```

If you try to call `apply()` for mode without templates, engine will lookup a
value of the corresponding field from current BEMJSON node.

```js
// BEMJSON
{ block: 'animal', type: 'cat' }
```

Template:

```js
block('animal')({
    content: () => apply('type')
});
```

*Result of templating:*

```html
<div class="animal">cat</div>
```

### applyNext

```js
/**
 * @param {Object} [changes] the object whose keys become fields
 * of the context when executing the template
 * @returns {*}
 */
applyNext(changes)
```

The `applyNext` construction returns the result of the next highest priority template in the current mode for the current node.

**Example**

```js
block('link')({ tag: 'a' });
block('link')({
    tag: () => {
        var res = applyNext(); // res === 'a'
        return res;
    }
});
```

`changes` argument allows you to extend BEMContext for child nodes templates.

```js
block('page')({ content: (node) => node._type });
block('page')({
    // here applyNext calls previous template with _type in BEMContext
    content: () => applyNext({ _type: '404' })
});
```

For BEMJSON `{ block: 'page' }` result of templating is:

```html
<div class="page">404</div>
```

Also you can assign any data for child nodes templates. See [example](6-templates-context.md#data-tunneling-for-child’s-templates)

### applyCtx

```js
/**
 * @param {BEMJSON} bemjson input data
 * @param {Object} [changes]
 * @returns {String}
 */
applyCtx(bemjson, changes)
```

Use the `applyCtx` construction for modifying the current fragment of the BEM tree `this.ctx` and calling `apply()` to apply templates.

```js
{ block: 'header', mix: [{ block: 'sticky' }] }
```

Template:

```js
block('header')({
    def: (node, ctx) => applyCtx(node.extend(ctx, {
        block: 'layout',
        mix: [{ block: 'header' }].concat(ctx.mix || [])
    }))
});
```

*Result of templating:*

```html
<div class="layout header sticky"></div>
```
