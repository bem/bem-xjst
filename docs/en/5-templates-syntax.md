# Template syntax

User-defined templates are a major part of bem-xjst. Template contains [predicate](#template-predicate) and [body](#template-body).

## Template predicate

For each node of the input tree, the template engine checks the conditions
specified in the templates. These conditions are called subpredicates. They make
up the template predicate.

Conditions can be simple, such as checking the name of the block or element.
They can also be complex, such as checking the values of user-defined modes
in the current BEMJSON node.

## List of subpredicates

* [block](#block)
* [elem](#elem)
* [mod](#mod)
* [elemMod](#elemmod)
* [match](#match)

### block

```js
/**
 * @param {String} name block name
 */
block(name)
```

The name can be specified as[`'*'`](7-runtime.md#templates-for-any-entities).

Each template must contain the block name subpredicate. Otherwise, the template engine throws an error: `BEMHTML error: block('…') not found in one of the templates`.

Example. Subpredicate for the `link` block:

```js
block('link')
```

Input data:

```js
[
    // for this block, the predicate returns `true` and the template is applied
    { block: 'link' },

    // for all subsequent entities, the predicate returns `false` and
    // the template isn’t applied
    { block: 'para' },
    'link',
    { block: 'link', elem: 'text' }
]
```

### elem

```js
/**
 * @param {String} name element name
 */
elem(name)
```

Checking the element. The name can be specified as [`'*'`](7-runtime.md#templates-for-any-entities).

### mod

```js
/**
 * @param {String} modName name of the block modifier
 * @param {String|Boolean} [modVal] value of the block modifier
 */
mod(modName, modVal)
```

Checking the value of the block modifier.

Templates are applied on the node, both to the block and to the corresponding modifiers.

Example:

```js
{ block: 'page', mods: { type: 'index' } }
```

Templates:

```js
block('page').tag()('body');
block('page').mod('type', 'index').mix()({ block: 'mixed' });
```

Both templates are applied. Result:

```html
<body class="page page_type_index mixed"></body>
```

`modVal` checked for compliance after converting to String. Example:

```js
{
  block: 'item',
  mods: {
      size: 1 // Notice that value is Number
  }
}
```

Template:

```js
block('item')
  .mod('size', '1') // Notice that value is String
  .tag()('small');
```

The template are applied. Result:

```html
<small class="item item_size_1"></small>
```

If second argument of `mod()` was omited then templates with any
non-empty value of modifier will be applied.

```js
block('a').mod('size').tag()('span');
```
Template will be applied to BEMJSON node if block equals to 'a' and
'size' modifier exists (equals neither to `undefined` nor to `''` nor to `false`
nor to `null`).

```js
{ block: 'a', mods: { size: 's' } },
{ block: 'a', mods: { size: 10 } },
```

But templates will not be applied to entities:
```js
{ block: 'a', mods: { size: '', theme: 'dark' } }
{ block: 'a', mods: { theme: 'dark' } },
{ block: 'a', mods: { size: undefined } },
{ block: 'a', mods: {} }
```

### elemMod

```js
/**
 * @param {String} elemModName name of the element modifier
 * @param {String|Boolean} [elemModVal] value of the element modifier
*/
elemMod(elemModName, elemModVal)
```

Checking the value of the element modifier.

Templates are applied on the node, both to the element and to the corresponding modifiers.

Example:

```js
{ block: 'page', elem: 'content', elemMods: { type: 'index' } }
```

Templates:

```js
block('page').elem('content').tag()('body');
block('page').elem('content').elemMod('type', 'index').mix()({ block: 'mixed' });
```

Both templates are applied. Result:

```html
<body class="page__content page__content_type_index mixed"></body>
```

`elemModVal` checked for compliance after converting to String. This behavior is similar to checking `modVal`.

Second argument of `elemMod()` can be omited. In this case
behavior of `elemMods()` will be the same as `mods()` without second argument.
The templates will be applied to BEMJSON nodes with modifier with any value.

### match

```js
/**
 * @param {Function} Checking a custom condition.
 *                   The result is converted to `Boolean`.
 */
match(function() { return … })
```

Checking a custom condition. In the context of the function, all s are accessible that are [accessible in the template](6-templates-context.md). The result of the function is converted to `Boolean`.

The order for checking `match` is guaranteed. The order for checking the other predicates isn’t important.

```js
block('*').match(function() { return false; })(
    // The body of this template won’t be called because the condition
    // returned `false`
    // …
);
```

Inside `match` callback function you can use [`apply()`](7-runtime.md#apply) to call any mode from this block.

### Subpredicate chains

Subpredicates can be arranged as chains:

```js
block('page')
    .mod('theme', 'white')
    .elem('content')
    .match(function() {
        return this.ctx.weather === 'hot';
    })
```

The following two templates are the same in bem-xjst terms:

```js
block('link').elem('icon')
elem('icon').block('link')
```

### Nested subpredicates

To avoid repeating identical subpredicates, such as for the `link` block:

```js
block('link').elem('icon')
block('link').elem('text')
```

…you can use a nested structure. The subpredicates are placed in the body of a shared subpredicate and separated with commas.

```js
block('link')(
    elem('icon')(body_of_template_1),
    elem('text')(body_of_template_2)
);
```

There is no restriction on the nesting level of subpredicates.

## Template body

The body of a template represents instructions for generating a templating result for the current BEMJSON node.

The process of templating each node of the input data consists of phases called modes. Each mode is responsible for generating a separate part of the result.

For example, for BEMHTML this might be an HTML tag, HTML class, HTML attributes, tag contents, and so on.

```html
<!-- `def` mode -->
<div <!-- the opening and closing element of an HTML tag depends on the `tag` mode -->
    class="
        link   <!-- the name is formed from the block, mods, elem, elemMods -->
        mixed  <!-- `mix` mode -->
        cls    <!-- `cls` mode -->
        i-bem  <!-- `js` mode -->
    "

    <!-- `bem` mode -->
    data-bem='{"link":{}}'

    <!-- `attr` mode -->
    id="my-dom-node"
>
    Tag content <!-- `content` mode -->
</div> <!-- the closing element of the tag also depends on the `tag` mode -->
```

We’ll cover each mode in detail later. Right now we’ll look at their syntax.

Each mode is a function call. You can’t pass arguments to the mode itself.

The template body is a separate call of a function that expects an argument.

```js
// Incorrect:
block('b').content('test');
// This will throw the BEMHTML error: Predicate should not have arguments.

// Correct:
block('b').content()('test');
```

For input data:

```js
{ block: 'link', url: 'https://yandex.ru', content: 'Yandex' }
```

And for the template:

```js
block('link')(
    tag()('a'),
    attrs()(function() {
        return { href: this.ctx.url };
    })
);
```

Result of BEMHTML templating:

```html
<a class="link" href="https://yandex.ru">Yandex</a>
```

### Description of standard modes

* [def](#def)
* [tag](#tag)
* [attrs](#attrs)
* [content](#content)
* [mix](#mix)
* [mods](#mods)
* [elemMods](#elemmods)
* [js](#js)
* [bem](#bem)
* [cls](#cls)
* [replace](#replace)
* [wrap](#wrap)
* [extend](#extend)
* [User-defined modes](#user-defined-modes)

#### def

```js
/**
 * @param {function|Array|Object[]} value
 */
def()(value)
```

The `def` mode (short for "default") has a special status. It is responsible for generating the result as a whole. This mode defines the list of other modes and the order to go through them, as well as the build procedure for getting the final representation of the HTML element or BEMJSON from the parts generated in the other modes.

This is a special mode that shouldn’t be used unless truly necessary. A user-defined template that redefines `def` disables calls of the other modes by default.

#### tag

```js
/**
 * @param {Function|String} name
 */
tag()(name)
```

HTML tag. `false` or `''` tells the BEMHTML engine to skip the HTML tag generation stage. Default: `div`.

#### attrs

```js
/**
 * @param {function|Object} value
 */
attrs()(value)
```

Hash with HTML attributes. The attribute values [are escaped using the attrEscape function](6-templates-context.md#attrescape).

You can use `addAttrs()` mode to add attributes. `addAttrs()` is shortcut of `attrs()` mode:
```js
addAttrs()({ id: 'test', name: 'test' });
// This is equivalent to following:
attrs()(function() {
    var attrs = applyNext() || {}; // Get attrs from previous templates
    return this.extend(attrs, { id: 'test', name: 'test' });
});
```

#### content

```js
/**
 * @param {*} value
 */
content()(value)
```

Child nodes. By default, it is taken from the `content` of the current BEMJSON node.

You can use `appendContent` and `prependContent` modes to add child nodes to
content.

```js
block('quote')(
    prependContent()('“'), // add some things before actual content
    appendContent()('”'), // add content to the end
    appendContent({ block: 'link' }); // add more content to the end
);
```
```js
{ block: 'quote', content: 'I came, I saw, I templated.' }
```
Result:
```html
<div class="quote">“I came, I saw, I templated.”<div class="link"></div></div>
```

`appendContent()` and `prependContent()` is a shortcuts to `content()` + `applyNext()`:

```js
// appendContent()('additional content') is the same as:
content()(function() {
    return [
        applyNext(),
        'additional content'
    ];
});

// prependContent()('additional content') is the same as:
content()(function() {
    return [
        'additional content',
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

BEM entities to [mix](https://en.bem.info/method/key-concepts/#mix) with the current one.

Usage example:

```js
block('link').mix()({ block: 'mixed' });
block('button').mix()([ { block: 'mixed' }, { block: 'control' } ]);
block('header').mix()(function() { return { block: 'mixed' }; });
```

You can use `addMix()` mode to add mix. `addMix()` is shortcut of `mix()`:
```js
addMix()('my_new_mix'); // This is equivalent to following:
mix()(function() {
    var mixes = applyNext();
    if (!Array.isArray(mixes)) mixes = [ mixes ];
    return mixes.concat('my_new_mix');
});
```

#### mods

```js
/**
 * @param {function|Object} mods
 */
mods()(mods)
```

Hash for modifiers of block.

Example:

```js
block('link').mods()({ type: 'download' });
block('link').mods()(function() { return { type: 'download' }; });
```

Value from `mods()` mode rewrite value from BEMJSON.

By default returns `this.mods`.

```js
// BEMJSON:
{ block: 'b' }

// Template:
block('b').def()(function() {
    return apply('mods');
});
```

The result is `{}`.

You can use `addMods()` mode to add modifiers. `addMods()` is shortcut of `mods()`:
```js
addMods()({ theme: 'dark' }); // This is equivalent to following:
mods()(function() {
    this.mods = this.extend(applyNext(), { theme: 'dark' });
    return this.mods;
});
```

#### elemMods

```js
/**
 * @param {function|Object} elemMods
 */
elemMods()(elemMods)
```

Hash for modifiers of element.

Example:

```js
block('link').elemMods()({ type: 'download' });
block('link').elemMods()(function() { return { type: 'download' }; });
```

Value from `elemMods()` mode rewrite value from BEMJSON.

By default returns `this.mods`.

```js
// BEMJSON:
{ block: 'b', elem: 'e' }

// Template:
block('b').elem('e').def()(function() {
    return apply('mods');
});
```

The result is `{}`.

You can use addElemMods mode to add modifiers for element. addElemMods is
shortcut of elemMods:
```js
addElemMods()({ theme: 'dark' }); // This is equivalent to following:
elemMods()(function() {
    this.elemMods = this.extend(applyNext(), { theme: 'dark' });
    return this.elemMods;
});
```

#### js

```js
/**
 * @param {function|Boolean|Object} value
 */
js()(value)
```

JavaScript parameters. If the value isn’t falsy, it mixes `i-bem` and adds the
content to Javacript parameters. More information about [i-bem and JavaScript parameters](https://en.bem.info/platform/i-bem/parameters/). Data is [escaped using the jsAttrEscape function](6-templates-context.md#jsattrescape).

#### bem

```js
/**
 * @param {function|Boolean} value
 */
bem()(value)
```

Tells the template engine whether to add classes and JavaScript parameters for the BEM entity and its mixes. Default: `true`.

#### cls

```js
/**
 * @param {function|String} value
 */
cls()(value)
```

Adds an HTML class unrelated to the BEM subject domain.

### Helper modes

#### replace

For replacing the current node (matching the node and rendering some other entity).

```js
// BEMJSON
{ block: 'resource' }
```

Templates:

```js
block('link').tag()('a');
block('resource').replace()({ block: 'link' });
```

Result of BEMHTML templating:

```html
<a class="link"></a>
```

You can’t use `replace` for self-substitution with a wrapper, or it will loop endlessly.

#### wrap

Wrap the current node in additional markup.

Example:

```js
// BEMJSON
{
    block: 'quote',
    content: 'Docendo discimus'
}
```

Template:

```js
block('quote').wrap()(function() {
    return {
        block: 'wrap',
        content: this.ctx
    };
});
```

Result of BEMHTML templating:

```html
<div class="wrap"><div class="quote">Docendo discimus</div></div>
```

#### extend

`extend` mode allows you to extend context of template.

Example:

```js
// BEMJSON
{ block: 'action' }
```

Templates:

```js
block('action').extend()({ 'ctx.type': 'Sale', sale: '50%' });
block('action').content()(function() {
    return this.ctx.type + ' ' + this.sale;
});
```

Result of BEMHTML apply:

```html
<div class="action">Sale 50%</div>
```

`extend()` may used as a data proxy to all child nodes.

Example:

```js
// Templates
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


## User-defined modes

You can define your own mode and use it in the template body. Example:

```js
// BEMJSON
{ block: 'control', name: 'username', value: 'miripiruni' }
```

Template:

```js
block('control')(
    mode('id')('username-control'), // User-defined mode named "id"
    content()(function() {
        return [
            {
                elem: 'label',
                attrs: { for: apply('id') } // Calling the user-defined mode
            },
            {
                elem: 'input',
                attrs: {
                    name: this.ctx.name,
                    value: this.ctx.value,
                    id: apply('id'),  // Calling the user-defined mode
                }
            }
        ];
    }),
    elem('input').tag()('input'),
    elem('label').tag()('label')
);
```

Result of BEMHTML templating:

```html
<div class="control">
    <label class="control__label" for="username-control"></label>
    <input class="control__input" name="username"
        value="miripiruni" id="username-control" />
</div>
```

More information about [apply()](7-runtime.md#apply).

## BEMTREE

In BEMTREE engine only data related modes are avaliable: [def](#def), [js](#js), [mix](#mix),
[mods](#mods), [elemMods](#elemmods), [content](#content), [replace](#replace),
[extend](#extend) and [wrap](#wrap) modes are used by the BEMTREE engine. User-defined modes can also be used. The other modes described in the documentation above can only be used in BEMHTML.

***

Read next: [What is available in the template body?](6-templates-context.md)
