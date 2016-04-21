# What is available in the template body?

While traversing input data, BEM-XJST builds a context, which contains:

* [normalized information about the current BEM entity](#normalized)
* [the current BEMJSON node](#ctx)
* [helpers](#helpers)
* [user-defined custom fields](#user-defined)
* [methods for controlling the templating process](#methods)

## <a name="normalized"></a>Normalized information about the current BEM entity

The template engine normalizes data about the current BEM entity. The current BEMJSON node might have incomplete information about the BEM entity. For example:

```js
{
    block: 'page',
    content: {
        elem: 'top'
        // The node doesn’t have the 'block' field.
        // But the template engine understands which
        // block context the 'top' element is in.
    }
}
```

Fields with normalized data:
* `this.block` {String} the block in the current node, or the block of the BEM entity that provides the context for the current node.
* `this.elem` {String} element in the current node
* `this.mods` {Object} block modifiers that are explicitly defined in the current node
* `this.elemMods` {Object} element modifiers that are explicitly defined in the current node

Note that the `this.mods` and `this.elemMods` objects always exist, so checking for their presence in the template body is redundant:
```js
block('page').match(function() {
    // Redundant:
    return this.mods && this.mods.type === 'index' && this.ctx.weather;
    // Sufficient:
    return this.mods.type === 'index' && this.ctx.weather;
}).def()(function() { return … });
```


## <a name="ctx"></a>Current BEMJSON node
The current BEMJSON node is available in the `this.ctx` field.

Example:
```js
{
    block: 'company',
    name: 'yandex'
}
```

```js
block('link').attr()(function() {
    return {
        id: this.ctx.name,
        name: this.ctx.name
    };
});
```
Result of BEMHTML templating:
```html
<div class="company" id="yandex" name="yandex"></div>
```


## <a name="helpers"></a>Helpers
### Escape methods

#### xmlEscape
```js
/**
 * @param {String} str
 * @returns {String}
 */
this.xmlEscape(str)
```
Returns the passed `str` string with the following XML symbols escaped: `&`, `<`, `>`.

Usage example:
```js
{ block: 'button' }
```
Template:
```js
block('button').def()(function() {
    return this.xmlEscape('<b>&</b>');
});
```
Result of BEMHTML templating:
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
Returns the passed `str` string with the following characters for XML and HTML attributes escaped: `"` and `&`.

#### jsAttrEscape
```js
/**
 * @param {String} str
 * @returns {String}
 */
this.jsAttrEscape(str)
```
Returns the passed `str` string with the following characters escaped: `'` and `&`.

By default, input data from the [`js`](4-data.md#js) field and data from the [`js`](5-templates-syntax.md#js) mode are escaped using this function.


### Position helpers

#### `this.position`

The position in the BEM tree (the `this.position` context field) is a natural number corresponding to the sequential number of the current (contextual) BEM entity in relation to its neighbors in the tree (peer entities).

When calculating the position:
* Numbering applies only to nodes of processed BEMJSON that correspond to BEM entities.
* Other nodes are not given a position number.
* Positions are numbered starting from 1.

Example of position numbering in the input BEM tree:
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

The BEM tree may be filled in as templates are executing, by using templates in the [`def`](5-templates-syntax.md#def) or [`content`](5-templates-syntax.md#content) mode. This dynamic modification of the BEM tree is taken into account when calculating positions.

The `isLast` function for determining the last BEM entity among peers returns `false` if the last element in the array containing the nodes is not a BEM entity. For example:
```js
block('list')(
    content()([
        { block: 'item1' },
        { block: 'item2' }, // this.isLast() === false
        'text'
    ])
);
```

This behavior is explained by the fact that for optimization purposes, BEMHTML does not perform a preliminary traversal of the BEM tree. This means that at the time when the `item2` block is processed, the length of the array is already known (`item2` is not the last element). However, it is not yet known that the last element is not a BEM element and won’t get a position number.

In practice, this case shouldn’t generate errors, because the check for the first and last BEM entity is normally applied to automatically generated lists, and it doesn’t make sense to include other types of data in them.

#### isFirst
```js
/**
 * @returns {Boolean}
 */
this.isFirst()
```
Checks whether the node is the first among its peers in the input tree.

#### isLast
```js
/**
 * @returns {Boolean}
 */
this.isLast()
```
Checks whether the node is the last among its peers in the input tree.


### Unique ID generator

#### `this.generateId()`

Generates an 'id' for the current node.

Usage example:
```js
// BEMJSON
{ block: 'input', label: 'Name', value: 'John Malkovich' }
```
Template
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
Result of BEMHTML templating:
```html
<div class="input">
    <label for="uniq14563433829878">Name</label>
    <input id="uniq14563433829878" value="John Malkovich" />
</div>
```

### Other helpers
* `this.isSimple({*} arg)` Checks whether `arg` is a JavaScript primitive type.
* `this.isShortTag({String} tagName)` Checks whether `tagName` is a tag that doesn’t require a closing element.

### `this.reapply()`
This is the ability to template any BEMJSON data located in the template body and get a string as the result.

BEMJSON:
```js
{ block: 'a' }
```
Template:
```js
block('a').js()(function() {
    return {
        template: this.reapply({ block: 'b', mods: { m: 'v' } })
    };
});
```
Result of BEMHTML templating:
```html
<div class="a i-bem" data-bem='{
    "a":{"template":"<div class=\"b b_m_v\"></div>"}}'></div>
```


## <a name="user-defined"></a>User-defined custom fields

The context available in the template body can be extended by the user.

Using the `oninit` function in the template code:
```js
var bemxjst = require('bem-xjst');

var templates = bemxjst.bemhtml.compile(function() {
    // Note: oninit only works for the first template compilation.
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

// Applying templates
var html = templates.apply(bemjson);
```
'html' contains the string:
```html
<div class="b">Hello, username</div>
```

Using the BEMContext prototype:
```js
var bemxjst = require('bem-xjst');
var templates = bemxjst.bemhtml.compile('');
// Extending the context prototype
templates.BEMContext.prototype.hi = function(name) {
    return 'Hello, ' + username;
};
// Adding templates
templates.compile(function() {
    block('b').content()(function() {
        return this.hi('templates');
    });
});
var bemjson = { block: 'b' };
// Applying templates
var html = templates.apply(bemjson));
```
As a result, `html` contains the string:
```html
<div class="b">Hello, templates</div>
```

## <a name="methods"></a>Methods for controlling the templating process

The methods `apply`, `applyNext` and `applyCtx` are available in the body of templates. For more information, see the next section on runtime.
***

Read next: [runtime](7-runtime.md)
