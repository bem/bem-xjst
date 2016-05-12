# Template syntax
User-defined templates are a major part of BEM-XJST. Template contains [predicate](#predicate) and [body](#body).


## <a name="predicate"></a>Template predicate

For each node of the input tree, the template engine checks the conditions
specified in the templates. These conditions are called subpredicates. They make
up the template predicate. Conditions can be simple, such as checking the name
of the block or element. They can also be complex, such as checking the values
of user-defined modes in the current BEMJSON node.

## <a name="list-of-predicates"></a>List of subpredicates
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
The name can be specified as[`'*'`](https://github.com/bem/bem-xjst/blob/master/docs/ru/7-runtime.md#wildcard).

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

    // for all subsequent entities, the predicate returns `false` and the template isn’t applied
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
Checking the element. The name can be specified as [`'*'`](https://github.com/bem/bem-xjst/blob/master/docs/ru/7-runtime.md#wildcard).


### mod
```js
/**
 * @param {String} modName name of the block modifier
 * @param {String|Boolean} modVal value of the block modifier
 */
mod(modName, modVal)
```
Checking the value of the block modifier.

Templates are applied on the node, both to the block and to the corresponding modifiers. Example:
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


### elemMod
```js
/**
 * @param {String} elemModName name of the element modifier
 * @param {String|Boolean} elemModVal value of the element modifier
*/
elemMod(elemModName, elemModVal)
```
Checking the value of the element modifier.

Templates are applied on the node, both to the element and to the corresponding modifiers. Example:
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


### match
```js
/**
 * @param {Function} Checking a custom condition. The result is converted to `Boolean`.
 */
match(function() { return … })
```
Checking a custom condition. In the context of the function, all s are accessible that are [accessible in the template](https://github.com/bem/bem-xjst/blob/master/docs/ru/6-templates-context.md). The result of the function is converted to `Boolean`.

The order for checking `match` is guaranteed. The order for checking the other predicates isn’t important.

```js
block('*').match(function() { return false; })(
    // The body of this template won’t be called because the condition returned `false`
    // …
);
```

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

The following two templates are the same in BEM-XJST terms:
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


## <a name="body"></a>Template body
The body of a template represents instructions for generating a templating result for the current BEMJSON node.

The process of templating each node of the input data consists of phases called modes. Each mode is responsible for generating a separate part of the result. For example, for BEMHTML this might be an HTML tag, HTML class, HTML attributes, tag contents, and so on.

```html
<!-- `def` mode-->
<div <!-- the opening and closing element of an HTML tag depends on the `tag` mode-->
    class="
        link   <!-- the name of the BEM entity is formed from the s block, mods, elem, elemMods -->
        mixed  <!-- `mix` mode -->
        cls    <!-- `cls` mode-->
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
* [js](#js)
* [bem](#bem)
* [cls](#cls)
* [replace](#replace)
* [wrap](#wrap)
* [User-defined modes](#user-defined)

#### `def`

```js
/**
 * @param {function|Array|Object[]} value
 */
def()(value)
```
The `def` mode (short for "default") has a special status. It is responsible for generating the result as a whole. This mode defines the list of other modes and the order to go through them, as well as the build procedure for getting the final representation of the HTML element or BEMJSON from the parts generated in the other modes.

This is a special mode that shouldn’t be used unless truly necessary. A user-defined template that redefines `def` disables calls of the other modes by default.

#### `tag`
```js
/**
 * @param {Function|String} name
 */
tag()(name)
```
HTML tag. `false` or `''` tells the BEMHTML engine to skip the HTML tag generation stage. Default: `div`.


#### `attrs`
```js
/**
 * @param {function|Object} value
 */
attrs()(value)
```
Hash with HTML attributes. The attribute values [are escaped using the attrEscape function](6-templates-context.md#attrescape).


#### `content`
```js
/**
 * @param {*} value
 */
content()(value)
```
Child nodes. By default, it is taken from the `content`  of the current BEMJSON node.

#### `mix`
```js
/**
 * @param {function|Object|Object[]|String} mixed
 */
mix()(mixed)
```
BEM entities to [mix](https://en.bem.info/method/key-concepts/#mix) with the current one.

Usage example:
```
block('link').mix()({ block: 'mixed' });
block('button').mix()([ { block: 'mixed' }, { block: 'control' } ]);
block('header').mix()(function() { return { block: 'mixed' }; });
```

#### `js`
```js
/**
 * @param {function|Boolean|Object} value
 */
js()(value)
```
JavaScript parameters. If the value isn’t falsy, it mixes `i-bem` and adds the content to JavaScript parameters. [More information about i-bem and JavaScript parameters](https://en.bem.info/technology/i-bem/v2/i-bem-js-params/#syntax-for-passing-parameters).  Data is [escaped using the jsAttrEscape function](6-templates-context.md#jsattrescape).

#### `bem`
```js
/**
 * @param {function|Boolean} value
 */
bem()(value)
```
Tells the template engine whether to add classes and JavaScript parameters for the BEM entity and its mixes. Default: `true`.

#### `cls`
```js
/**
 * @param {function|String} value
 */
cls()(value)
```
Adds an HTML class unrelated to the BEM subject domain.


### Helper modes

#### `replace`
For replacing the current node (matching the node and rendering some other entity). Example:
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

#### `wrap`
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

## <a name="user-defined"></a>User-defined modes
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

Only the [def](#def) and [content](#content) modes are used by the BEMTREE engine. User-defined modes can also be used. The other modes described in the documentation above can only be used in BEMHTML.

Read next: [What is available in the template body?](6-templates-context.md)
