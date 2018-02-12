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
  - [Runtime linting](#runtime-linting)
  - [Production mode](#production-mode)
  - [exportName](#exportname-option)
* [Using thirdparty libraries](#using-thirdparty-libraries)
* [Extending BEMContext](#extending-bemcontext)
* [Bundling](#bundling)
* [Source maps](#source-maps)

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
            mod: { name: '--', val: '_' }
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
<div class="page page--theme_gray"><div class="page__head page__head--type_short"></div></div>
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

*Result of templating:*

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

*Result of templating:*

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

*Result of templating:*

```html
<div class=b name=test></div>
```

### Escaping

You can set `escapeContent` option to `true` to escape string values of `content` field with [`xmlEscape`](6-templates-context.md#xmlescape).

**Example**

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

*Result of templating:*

```html
<div class="danger">&amp;nbsp;&lt;script src="alert()"&gt;&lt;/script&gt;</div>
```

If you want avoid escaping in content [use special value](4-data.md#content): `{ html: '…' }`.

**Example**

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

```js
BEM-XJST WARNING: boolean attribute value: true in BEMJSON: { block: 'b', attrs: { one: true, two: 'true' } }

Notice what bem-xjst behaviour changed: https://github.com/bem/bem-xjst/releases/tag/v4.3.3

BEM-XJST WARNING: mods for elem in BEMJSON: { block: 'c', elem: 'e', mods: { test: 'opa' } }

Notice what bem-xjst behaviour changed: https://github.com/bem/bem-xjst/releases/tag/v5.0.0

BEM-XJST WARNING: looks like someone changed ctx.mods in BEMJSON: { block: 'mods-changes', mods: { one: 2, two: '2' } } old value of ctx.mod.one was 1

Notice that you should change this.mods instead of this.ctx.mods in templates
```

### Production mode

You can use option `production` to render whole BEMJSON even if one template contains error.

**Example**

```js
var template = bemxjst.compile(function() {
  block('b1').attrs()(function() {
    var attrs = applyNext();
    attrs.undef.foo = 'bar';
    return attrs;
  });
}, { production: true });
var html = template.apply({ block: 'page', content: { block: 'b1' } });
```

`html` will equals `<div class="page"></div>`.

Also in production mode bem-xjst will produce error messages to STDERR.

```bash
$node index.js 1> stdout.txt 2> stderr.txt

$ cat stdout.txt
<div class="page"></div>

$ cat stderr.txt
BEMXJST ERROR: cannot render block b1, elem undefined, mods {}, elemMods {} [TypeError: Cannot read property 'undef' of undefined]
```

When you use `production` option with `true` value you can define function for custom error logging. This function will be used instead of regilar `console.error`. Custom function will be filled with two arguments:

1) Object with block, element and modifiers fields where error occurred.
2) Original JS error.

You can define custom `onError` function by extending prototype of `BEMContext`. For example:

```js
var bemxjst = require('bem-xjst');
var templates = bemxjst.bemhtml.compile('', { production: true });

templates.BEMContext.prototype.onError = function(context, err) { … };
```

### exportName option

You can use `exportName` option for choose name of variable where engine will be exported. By default it’s BEMHTML or BEMTREE.

For example read next.


### Using thirdparty libraries

BEMTREE and BEMHTML allows you using thirdparty libraries as well as a global dependencies and different modular systems.

For example:

```js
{
    requires: {
        'lib-name': {
            globals: 'libName',           // Variable name from global scope
            commonJS: 'path/to/lib-name', // path to CommonJS library
            ym: 'lib-name'                // Module name from YModules
        }
    }
}
```

`lib-name` module will be accessible in templates body like this:

```js
block('button').content()(function () {
    var lib = this.require('lib-name');

    return lib.hello();
});
```

It’s necessary to specify each environment you want to expose library to.

E.g. if you specify just global scope the library will only be available as global variable even though some module system will be present in runtime.

```js
{
    requires: {
        'lib-name': {
            globals: 'dependName' // Variable name from global scope
        }
    }
}
```

In other case, if you specify multiple modular systems, template will attempt to get it from them in this order:
1) global
2) CommonJS
3) YModules (if available)
If required module was found on some step, next steps will be ignored and template will use that first retrieved module.

Thus, if module available in global variable, its value will be provided inside template, in spite of module avialability in CommonJS/YModules.

Same way, CommonJS module is more prior to YModules one.

Example of using `moment.js` library:

You don’t need to to provide path to module:

```js
{
    requires: {
        moment: {
            commonJS: 'moment',  // path to CommonJS module, relative bundle file
        }
    }
}
```

In templates body the module will be acessible as `this.require('moment')`.
You can use the template in any browser or in `Node.js`:

```js
block('post').elem('data').content()(function() {
    var moment = this.require('moment');

    return moment(this.ctx.date) // Time in ms from server
        .format('YYYY-MM-DD HH:mm:ss');
});
```

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

## Source maps

There is options in `generate` method to use source maps.

* `to` {String} — output bundle file name
* `sourceMap.from` {String} — file name
* `sourceMap.prev` {Object} — previous source map object

Example of generating bundle with source maps:

```js
var fs = require('fs'),
    bemxjst = require('bem-xjst').bemhtml,
    tmpl = 'my-block-1.bemhtml.js',
    bundle = 'bundle.bemhtml.js';

var result = bemxjst.generate(fs.readFileSync(tmpl, 'utf8'), {
    to: bundle,
    sourceMap: { from: tmpl }
});

fs.writeFileSync(bundle, result);
```

Also [see examples](../../examples/source-maps/) about source maps and
bem-xjst.

Read next: [Input data](4-data.md)
