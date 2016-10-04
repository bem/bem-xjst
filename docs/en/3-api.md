# API

* [Choosing an engine, compiling and applying templates](#choosing-an-engine-compiling-and-applying-templates)
* [Adding templates](#adding-templates)
* [Settings](#settings)
  - [Delimiters in names of BEM entities](#delimiters-in-names-of-bem-entities)
  - [Support JS-instances for elements (bem-core v4+)](#support-js-instances-for-elements-bem-core-v4)
  - [XHTML option](#xhtml-option)
  - [Optional End Tags](#optional-end-tags)
  - [Unquoted attributes](#unquoted-attributes)
  - [Escaping](#escaping)
  - [Extending BEMContext](#extending-bemcontext)
  - [Runtime linting](#runtime-linting)
* [Bundling](#bundling)

## Choosing an engine, compiling and applying templates

### BEMHTML engine

```js
var bemxjst = require('bem-xjst');
var bemhtml = bemxjst.bemhtml;

// Add a template
var templates = bemhtml.compile(function() {
    block('quote').tag()('q');
});

// Add data
var bemjson = { block: 'quote', content: 'I came, I saw, I templated.' };

// Apply templates
var html = templates.apply(bemjson);
```

The resulting `html` contains the string:

```html
<q class="quote">I came, I saw, I templated.</q>
```

### BEMTREE engine

```js
var bemxjst = require('bem-xjst');
var bemtree = bemxjst.bemtree;

// Add a template
var templates = bemtree.compile(function() {
    block('phone').content()({ mask: '8-800-×××-××-××', mandatory: true });

    block('page').content()([
        { block: 'header' },
        { block: 'body' },
        { block: 'footer' }
    ]);
});

// Add data
var bemjson = [ { block: 'phone' }, { block: 'page' } ];

// Apply templates
var result = templates.apply(bemjson);
// 'result' contains:
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

## Adding templates

To add templates to the `templates` instance, use the `compile` method.

```js
var bemxjst = require('bem-xjst');

// Instantiating the 'templates' class
var templates = bemxjst.bemhtml.compile(function() {
    block('header').tag()('h1');
});

// Add data
var bemjson = { block: 'header', content: 'Documentation' };

var html = templates.apply(bemjson);
// html: '<h1 class="header">Documentation</h1>'

// Add templates to the created instance of the 'templates' class
templates.compile(function() {
    block('header').tag()('h2');
});

html = templates.apply(bemjson);
// Now the HTML tag is h2 instead of h1:
// html: '<h2 class="header">Documentation</h2>'
```

If you need to [bundle](https://en.bem.info/methodology/build/#build-results) all the templates, the most efficient way is to use the [generate](#bundling) method.

## Settings

### Delimiters in names of BEM entities

```js
var bemxjst = require('bem-xjst');
var templates = bemxjst.bemhtml.compile(function() {
    // This example doesn’t add any templates.
    // HTML will be rendered using the default behavior of the template engine.
    }, {
        // Setting up BEM naming
        naming: {
            elem: '__',
            mod: '_'
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

The resulting `html` contains the string:

```html
<div class="page page_theme_gray"><div class="page__head page__head_type_short"></div></div>
```

You can find more information in [naming conventions](https://en.bem.info/methodology/naming-convention/) article.

### Support JS-instances for elements (bem-core v4+)

bem-xjst have `elemJsInstances` option for support JS instances for elems ([bem-core](https://en.bem.info/libs/bem-core/) v4+).

```js
var bemxjst = require('bem-xjst');
var templates = bemxjst.bemhtml.compile(function() {
    // In this example we will add no templates.
    // Default behaviour is used for HTML rendering.
    }, {
        // Turn on support for JS instances for elems
        elemJsInstances: true
    });

var bemjson = {
    block: 'b',
    elem: 'e',
    js: true
};

var html = templates.apply(bemjson);
```

Result with v6.2.x:

```html
<div class="b__e" data-bem='{"b__e":{}}'></div>
```

Result with v6.3.0:

```html
<div class="b__e i-bem" data-bem='{"b__e":{}}'></div>
```

Notice that `i-bem` was added.

### XHTML option

`xhtml` option allow you to ommit closing slash in void HTML elements (only have a start tag).

Default value is `true`. But in nex major version we invert it.

Example for v6.2.0:

```js
var bemxjst = require('bem-xjst');
var templates = bemxjst.bemhtml.compile(function() {
    // In this example we didn’t add templates
    // bem-xjst will render by default
    }, {
        // Turn off XHTML
        xhtml: false
    });

var bemjson = { tag: 'br' };
var html = templates.apply(bemjson);
```

Result:

```html
<br>
```

### Optional End Tags

With option `omitOptionalEndTags` template engine will ommit
optional end tags. The option is turn off by default.

You can find list of optional end tags in specifications:
[HTML4](https://html.spec.whatwg.org/multipage/syntax.html#optional-tags) and
[HTML5](https://www.w3.org/TR/html5/syntax.html#optional-tags).

```js
var bemxjst = require('bem-xjst');
var templates = bemxjst.bemhtml.compile(function() {
    // In this example we will add no templates.
    // Default behaviour is used for HTML rendering.
    }, {
        // Turn off optional end tags
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

Result:

```html
<table><tr><th>table header<td>table cell</table>
```

### Unquoted attributes

HTML specification allows us ommit unnececary quotes in some cases. See
[HTML4](https://www.w3.org/TR/html4/intro/sgmltut.html#h-3.2.2) and
[HTML5](https://www.w3.org/TR/html5/syntax.html#attributes) specs.

You can use `unquotedAttrs` option to do so.

```js
var bemxjst = require('bem-xjst');
var templates = bemxjst.bemhtml.compile(function() {
    // In this example we will add no templates.
    // Default behaviour is used for HTML rendering.
    }, {
        // allow unqouted attributes if it’s possible
        unquotedAttrs: true
    });

var bemjson = { block: 'b', attrs: { name: 'test' } };

var html = templates.apply(bemjson);
```

Result:

```html
<div class=b name=test></div>
```


### Escaping

You can set `escapeContent` option to `true` to escape string values of `content` field with [`xmlEscape`](6-templates-context.md#xmlescape).

Example:

```js
var bemxjst = require('bem-xjst');
var templates = bemxjst.bemhtml.compile(function() {
    // In this example we will add no templates.
    // Default behaviour is used for HTML rendering.
    }, {
        // Turn on content escaping
        escapeContent: true
    });

var bemjson = {
    block: 'danger',
    // Danger UGC content
    content: '&nbsp;<script src="alert()"></script>'
};

var html = templates.apply(bemjson);
```

Result:

```html
<div class="danger">&amp;nbsp;&lt;script src="alert()"&gt;&lt;/script&gt;</div>
```

If you want avoid escaping in content [use special value](4-data#content): `{ html: '…' }`.

Example:

```js
var bemxjst = require('bem-xjst');
var templates = bemxjst.bemhtml.compile(function() {
    // In this example we will add no templates.
    // Default behaviour is used for HTML rendering.
    }, {
        // Turn on content escaping
        escapeContent: true
    });

var bemjson = {
    block: 'trusted',
    // Trusted and safe content
    content: {
        html: 'I <3 you!'
    }
};

var html = templates.apply(bemjson);
```

In this case `content.html` will be rendered as is:

```html
<div class="trusted">I <3 you!</div>
```

Notice that in `content.html` expected only string type.

### Extending BEMContext

You can extend `BEMContext` in order to use user-defined functions in the template body.

```js
var bemxjst = require('bem-xjst');
var templates = bemxjst.bemhtml.compile('');

// Extend the context prototype
templates.BEMContext.prototype.hi = function(name) {
    return 'Hello, ' + name;
};

// Add templates
templates.compile(function() {
    block('b').content()(function() {
        return this.hi('templates');
    });
});

// Input data
var bemjson = { block: 'b' };

// Apply templates
var html = templates.apply(bemjson);
```

The resulting `html` contains the string:

```html
<div class="b">Hello, templates</div>
```

### Runtime linting

By turning on `runtimeLint` option you can get warnings about wrong
templates or input data.
About these warnings you can read [migration guide](https://github.com/bem/bem-xjst/wiki/Migration-guide-from-4.x-to-5.x).

```js
var bemxjst = require('bem-xjst');
var bemhtml = bemxjst.bemhtml;

var templates = bemhtml.compile(function() {
  block('b').content()('yay');

  block('mods-changes').def()(function() {
    this.ctx.mods.one = 2;
    return applyNext();
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

As usual you get result of applying templates in `html` variable. But in
addition of this you can catch wargings in STDERR:
```
BEM-XJST WARNING: boolean attribute value: true in BEMJSON: { block: 'b', attrs: { one: true, two: 'true' } }
Notice what bem-xjst behaviour changed: https://github.com/bem/bem-xjst/releases/tag/v4.3.3

BEM-XJST WARNING: mods for elem in BEMJSON: { block: 'c', elem: 'e', mods: { test: 'opa' } }
Notice what bem-xjst behaviour changed: https://github.com/bem/bem-xjst/releases/tag/v5.0.0

BEM-XJST WARNING: looks like someone changed ctx.mods in BEMJSON: { block: 'mods-changes', mods: { one: 2, two: '2' } }
old value of ctx.mod.one was 1
Notice that you should change this.mods instead of this.ctx.mods in templates
```


## Bundling

The `generate` method generates JavaScript code that can be passed and run in the
browser to get the `templates` object.

```js
var bemxjst = require('bem-xjst');
var bundle = bemxjst.bemhtml.generate(function() {
    // user-defined templates
    // …
});
```
Now `bundle` has a string containing the JavaScript code of the BEMHTML core and the user-defined templates.

***

Read next: [Input data](4-data.md)
