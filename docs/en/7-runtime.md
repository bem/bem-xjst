# Runtime

- [How the template engine runtime works](#how-the-template-engine-runtime-works)
- [Templates for any entities](#templates-for-any-entities)
- [Instructions for controlling runtime](#instructions-for-controlling-runtime)
  - [apply](#apply): call the specified mode
  - [applyNext](#applynext): apply templates with lower priority than the current one to the node
  - [applyCtx](#applyctx): apply templates to any BEMJSON

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
block('*')
    .match(function() {
        return this.ctx.counter;
    })
    .mix()(function() {
        return { block: 'counter', js: { id: this.ctx.counter } }
    })
```

Result of HTML rendering:

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
 * @params {Object} [assignObj] object whose fields will be available
 *                              in 'this' in the template body
 * @returns {*} Returns the result of running the mode
 */
apply(modeName, assignObj)
```

Used for calling a standard or user-defined mode of the current node.

```js
{ block: 'button' }
```

Template:

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

Result of BEMHTML templating:

```html
pingpong
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
block('footer').mode('custom')('footer');
block('header').mode('custom')('header');
block('header').tag()(function() {
    // despite the fact that the second 'apply' argument explicitly
    // specifies the 'footer' block,
    // the user-defined mode of the 'header' block will be called.
    return apply('custom', { block: 'footer' });
});
```

Result of templating:

```html
<header class="header"></header><div class="footer"></div>
```

### applyNext

```js
/**
 * @param {Object} [newctx] the object whose keys become fields
 * of the context when executing the template
 * @returns {*}
 */
applyNext(newctx)
```

The `applyNext` construction returns the result of the next highest priority template in the current mode for the current node.

Example:

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
 * @param {BEMJSON} bemjson input data
 * @param {Object} [newctx]
 * @returns {String}
 */
applyCtx(bemjson, newctx)
```

Use the `applyCtx` construction for modifying the current fragment of the BEM tree `this.ctx` and calling `apply()` to apply templates.

```js
{ block: 'header', mix: [{ block: 'sticky' }] }
```

Template:

```js
block('header').def()(function() {
    return applyCtx(this.extend(this.ctx, {
        block: 'layout',
        mix: [{ block: 'header' }].concat(this.ctx.mix || [])
    }));
});
```
Result of templating:

```html
<div class="layout header sticky"></div>
```
