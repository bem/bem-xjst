# BEM-XJST Changelog

# 2016-07-29 [v6.5.5](https://github.com/bem/bem-xjst/compare/v6.5.4...v6.5.5), # @miripiruni

Fixed bug with `{ html: '' }`. In 6.5.4 result is `[object Object]`. In 6.5.5: `''`.


Commits:

* [[`787b7b1ee1`](https://github.com/bem/bem-xjst/commit/787b7b1ee1)] - **BEMXJST**: work with empty string in html field (miripiruni)


# 2016-07-18, [v6.5.4](https://github.com/bem/bem-xjst/compare/v6.5.3...v6.5.4), @miripiruni

Fixed case with `html` and `tag` fields.

```js
{
    tag: false,
    html: '<script>console.log("hello html");</script>'
}
```

Result with v6.5.3:
```html
[object Object]
```

Result with v6.5.4:
```html
<script>console.log("hello html");</script>
```

Commits:
* [[`e9cd0bf6ac`](https://github.com/bem/bem-xjst/commit/e9cd0bf6ac)] - **BEMHTML**: should properly render unescaped html field if `tag:false` present (fix for #312) (miripiruni)

# 2016-07-07, [v6.5.3](https://github.com/bem/bem-xjst/compare/v6.5.2...v6.5.3), @miripiruni

Fixed issue with undefined nested mix.

v6.5.2 marked as deprecated because of #303.

Commits:
* [[`3b9c4220c6`](https://github.com/bem/bem-xjst/commit/3b9c4220c6)] - **BEMHTML**: Fix for #303 undefined nested mix (miripiruni)


# 2016-06-27, [v6.5.2](https://github.com/bem/bem-xjst/compare/v6.5.1...v6.5.2), @miripiruni

Fixed `apply('modename')` behaviour.

```js
// Template:
block('b1').def()(function() {
    return applyCtx([ apply('content'), apply('tag') ]);
});
```

```js
// BEMJSON:
{ block: 'b1', tag: 'a', content: '1' }
```

Result before fix (v6.5.1):
```html
// empty string
```

Result after fix (v6.5.2):
```html
a1
```

Dependency updated. Node.js 6.x in Travis config added.

Commits:
* [[`9d230c552f`](https://github.com/bem/bem-xjst/commit/9d230c552f)] - `apply(modeName)` must return values from `this.ctx` if no other templates (miripiruni)
* [[`0b96bacbeb`](https://github.com/bem/bem-xjst/commit/0b96bacbeb)] - Benchmarks postinstall fixed (miripiruni)
* [[`9037b9dd0b`](https://github.com/bem/bem-xjst/commit/9037b9dd0b)] - Benchmarks fixed (miripiruni)
* [[`9b9ffc7836`](https://github.com/bem/bem-xjst/commit/9b9ffc7836)] - Update README.ru.md (Vitaly Harisov)
* [[`34b7365379`](https://github.com/bem/bem-xjst/commit/34b7365379)] - Lint to documentation changed to https://en.bem.info/platform/bem-xjst/ (Vitaly Harisov)
* [[`f63357ad9f`](https://github.com/bem/bem-xjst/commit/f63357ad9f)] - Tests about escaping improved (miripiruni)
* [[`9c05eded3d`](https://github.com/bem/bem-xjst/commit/9c05eded3d)] - Update after review (Vasiliy Loginevskiy)
* [[`9495a91140`](https://github.com/bem/bem-xjst/commit/9495a91140)] - Add escaped object to simple primitives. (Vasiliy Loginevskiy)
* [[`7fc384883a`](https://github.com/bem/bem-xjst/commit/7fc384883a)] - Return reused function early (Alexey Gurianov)
* [[`41eddf7128`](https://github.com/bem/bem-xjst/commit/41eddf7128)] - chore(package): update mocha to version 2.5.3 (greenkeeperio-bot)
* [[`f247a9c0fe`](https://github.com/bem/bem-xjst/commit/f247a9c0fe)] - Fix an output HTML according to its BEMJSON (#2) (Vassily Krasnov)
* [[`3a25c73262`](https://github.com/bem/bem-xjst/commit/3a25c73262)] - Update 4-data.md (Vassily Krasnov)
* [[`543f7647e5`](https://github.com/bem/bem-xjst/commit/543f7647e5)] - chore(package): update dependencies (greenkeeperio-bot)
* [[`aa24538426`](https://github.com/bem/bem-xjst/commit/aa24538426)] - Dependency updated: q from 0.9.3 to 2.0.3 (miripiruni)
* [[`92016f17f9`](https://github.com/bem/bem-xjst/commit/92016f17f9)] - Dependency updated: coa from 0.3.9 to 1.0.1 (miripiruni)
* [[`3a16d495d8`](https://github.com/bem/bem-xjst/commit/3a16d495d8)] - **Trivial**: dependency status badges added (Slava Oliyanchuk)
* [[`30e1149e67`](https://github.com/bem/bem-xjst/commit/30e1149e67)] - **Trivial**: dependency status badges added (Slava Oliyanchuk)
* [[`50b8554b54`](https://github.com/bem/bem-xjst/commit/50b8554b54)] - Travis config: Node.js 6.x added (Slava Oliyanchuk)

# 2016-05-20, [v6.5.1](https://github.com/bem/bem-xjst/compare/v6.5.0...v6.5.1), @miripiruni

Now bem-xjst trim and escape cls. Example:

```js
// Template:
block('b1').elem('e1').content()(function() {
    return JSON.stringify(this.mods);
});
```

```js
// BEMJSON:
[
    { block: 'b1', cls: '">' },
    { block: 'b2', cls: '   hello    ' }
]
```

Result before fix (v6.5.0):
```html
<div class="b ">"></div>
<div class="   hello    "></div>
```

Result after fix (v6.5.1):
```html
<div class="b &quot;>"></div>
<div class="hello"></div>
```


# 2016-05-20, [v6.5.0](https://github.com/bem/bem-xjst/compare/v6.4.3...v6.5.0), @miripiruni

bemxjst.compile() should work with arrow functions and function with name and params.

```js
var bemhtml = require('bem-xjst').bemhtml;

var myFunction = function() {
    block('page').tag()('body');
};

// myFunction can be in v6.5.0:
//   function name() { … }
//   function (a, b) { … }
//   function name(a, b) { … }
//   () => { … }
//   (a, b) => { … }
//   _ => { … }

var templates = bemhtml.compile(myFunction);
```


# 2016-05-20, [v6.4.3](https://github.com/bem/bem-xjst/compare/v6.4.2...v6.4.3), @miripiruni

bem-xjst should not render attrs if it’s not hash. Strings, arrays, and etc.
Example:

```js
// BEMJSON:
{ block: 'b', attrs: [ 1, 2 ] }
```

Result before fix (v6.4.2):
```html
<div class="b" 0="1" 1="2"></div>
```

Result after fix (v6.4.3):
```html
<div class="b"></div>
```


# 2016-05-20, [v6.4.2](https://github.com/bem/bem-xjst/compare/v6.4.1...v6.4.2), @miripiruni

bem-xjst should not inherit mods from namesake parent block. Example:

```js
// BEMJSON:
{
    block: 'b1',
    mods: { a: 1 },
    content: { block: 'b1' }
}
```

Result before fix (v6.4.1):
```html
<div class="b1 b1_a_1"><div class="b1_a_1"></div></div>
```

Result after fix (v6.4.2):
```html
<div class="b1 b1_a_1"><div class="b1"></div></div>
```

bem-xjst should not match on removed mods. Example:

```js
// Template:
block('b1').mod('a', 'b').replace()(function() {
    return {
        block: 'b1',
        content: 'content'
    };
});
```

```js
// BEMJSON:
{
    block: 'b1',
    mods: { a: 1 }
}
```

Result before fix (v6.4.1): endless loop :(

Result after fix (v6.4.2):
```html
<div class="b1">content</div>
```


* [[`3451467c5d`](https://github.com/bem/bem-xjst/commit/3451467c5d)] - **bemxjst**: should not inherit `mods` from namesake parent block (Dmitry Starostin)
* [[`c2f697f71a`](https://github.com/bem/bem-xjst/commit/c2f697f71a)] - We don’t need it anymore (Vasiliy Loginevskiy)
* [[`ed7624ac91`](https://github.com/bem/bem-xjst/commit/ed7624ac91)] - Simple example (miripiruni)


# 2016-05-11, [v6.4.1](https://github.com/bem/bem-xjst/compare/v6.4.0...v6.4.1), @miripiruni

Bug fixed: in case of same block `mods` disappearing. Now bem-xjst keep it. Example:

```js
// Template:
block('b1').elem('e1').content()(function() {
    return JSON.stringify(this.mods);
});
```

```js
// BEMJSON:
{
    block: 'b1',
    mods: { a: 1 },
    content: { block: 'b1', elem: 'e1' }
}
```

Result before fix (v6.4.0):
```html
<div class="b1 b1_a_1"><div class="b1__e1">{}</div></div>
```

Result after fix (v6.4.1):
```html
<div class="b1 b1_a_1"><div class="b1__e1">{"a":1}</div></div>
```

Now you can pass to `bemxjst.compile` named function.

* [[`61f21249cf`](https://github.com/bem/bem-xjst/commit/61f21249cf)] - **bemjxst**: should keep `mods` in case of same block (miripiruni)
* [[`ae5521104c`](https://github.com/bem/bem-xjst/commit/ae5521104c)] - Remove `elemMatch` fix for #260 (miripiruni)
* [[`af9a35c906`](https://github.com/bem/bem-xjst/commit/af9a35c906)] - Change files in package.js (Vasiliy)
* [[`274f438116`](https://github.com/bem/bem-xjst/commit/274f438116)] - bemxjst.compile: error when passed function with name (Fix #250) (miripiruni)

# 2016-04-18, [v6.4.0](https://github.com/bem/bem-xjst/compare/v6.4.0...v6.3.1), @miripiruni

New option for content escaping: `escapeContent`.

In v6.4.0 `escapeContent` is set to `false` by default but will be inverted in one of the next major versions.

Example:

You can set `escapeContent` option to `true` to escape string values of `content` field with [`xmlEscape`](6-templates-context.md#xmlescape).

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


* [[`9bdb20479a`](https://github.com/bem/bem-xjst/commit/9bdb20479a)] - Merge pull request #217 from bem/escaping2 (Slava Oliyanchuk)
* [[`9cb7249d03`](https://github.com/bem/bem-xjst/commit/9cb7249d03)] - Package name fixed (Slava Oliyanchuk)
* [[`54d505922b`](https://github.com/bem/bem-xjst/commit/54d505922b)] - BEMXJST runSimple small refactoring (miripiruni)

# 2016-04-18, [v6.3.1](https://github.com/bem/bem-xjst/compare/v6.3.1...v6.3.0), @miripiruni

Improved error message about no block subpredicate.

Example:

```bash
$cat noblock.js
var bemxjst = require('bem-xjst');
var bemhtml = bemxjst.bemhtml;
var templates = bemhtml.compile(function() {
    tag()('span');
});


$ node noblock.js
/Users/miripiruni/Documents/www/bem-xjst-errors/lib/compiler.js:59
      throw new BEMXJSTError(e.message);
      ^
BEMXJSTError: block(…) subpredicate is not found.
    See template with subpredicates:
     * tag()
    And template body:
    ("span")
    at _compile (.../lib/compiler.js:60:13)
    at Compiler.compile (...//lib/compiler.js:79:3)
    at Object.<anonymous> (.../noblock.js:3:25)
    …

```

* [[`3362992103`](https://github.com/bem/bem-xjst/commit/3362992103)] - Merge pull request #207 from bem/error-no-block (Slava Oliyanchuk)


# 2016-03-13, [v6.3.0](https://github.com/bem/bem-xjst/compare/v6.3.0...v6.2.1), @miripiruni

New option `elemJsInstances` for support JS instances for elems (bem-core v4+).

In v6.3.0 `elemJsInstances` is set to `false` by default but will be inverted in one of the next major versions.

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

* [[`d9f79c1855`](https://github.com/bem/bem-xjst/commit/d9f79c1855)] - Introduce elemInstances option (Vladimir Grinenko)
* [[`d35758d452`](https://github.com/bem/bem-xjst/commit/d35758d452)] - **Docs**: anchors fixed (Slava Oliyanchuk)


# 2016-03-08, [v6.2.1](https://github.com/bem/bem-xjst/compare/v6.2.1...v6.2.0), @miripiruni

1. Fixed arrow finction support for `replace`, `wrap`, `once`.
2. Minor updates: readme, package meta info, authors file, etc.

* [[`669db0d7db`](https://github.com/bem/bem-xjst/commit/669db0d7db)] - BEMHTML, BEMTREE added to keywords (Slava Oliyanchuk)
* [[`abab495e2e`](https://github.com/bem/bem-xjst/commit/abab495e2e)] - README.md: description changed (Slava Oliyanchuk)
* [[`ac43d023aa`](https://github.com/bem/bem-xjst/commit/ac43d023aa)] - Russian comments in README.ru.md (Slava Oliyanchuk)
* [[`eb56169ddc`](https://github.com/bem/bem-xjst/commit/eb56169ddc)] - Pass context to wrap-based matchers and once (Alexey Yaroshevich)
* [[`369b8543b2`](https://github.com/bem/bem-xjst/commit/369b8543b2)] - Twitter added (Slava Oliyanchuk)
* [[`a2e4a0716a`](https://github.com/bem/bem-xjst/commit/a2e4a0716a)] - Twitter added (Slava Oliyanchuk)
* [[`e51c1fae85`](https://github.com/bem/bem-xjst/commit/e51c1fae85)] - Increment year (Slava Oliyanchuk)
* [[`da3bfecbc8`](https://github.com/bem/bem-xjst/commit/da3bfecbc8)] - AUTHORS added (miripiruni)
* [[`7d16b39958`](https://github.com/bem/bem-xjst/commit/7d16b39958)] - package.json: engines field added (miripiruni)
* [[`7d823dc92d`](https://github.com/bem/bem-xjst/commit/7d823dc92d)] - **Travis**: node 5 added (miripiruni)
* [[`61f56a6e48`](https://github.com/bem/bem-xjst/commit/61f56a6e48)] - keywords, homepage, directories and contributors added (miripiruni)

# 2016-03-24, [v6.2.0](https://github.com/bem/bem-xjst/compare/v6.1.1...v6.2.0), @miripiruni

New `xhtml` option. Default value is `true`. But in nex major version we invert it.

`xhtml` option allow you to ommit closing slash in void HTML elements (only have a start tag).

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

# 2016-03-24, [v6.1.1](https://github.com/bem/bem-xjst/compare/v6.1.0...v6.1.1), @miripiruni

Fix for calc position. Example:

```js
// BEMJSON
{
    block: 'wrap',
    content: { block: 'inner' }
}
```

```js
//Template
block('*').cls()(function() {
    return this.position;
});
```

v6.1.0 result (bug):
```html
<div class="wrap 1"><div class="inner 2"></div></div>
```

v6.1.1 result (fixed):
```html
<div class="wrap 1"><div class="inner 1"></div></div>
```

* [[`1cb9d149b7`](https://github.com/bem/bem-xjst/commit/1cb9d149b7)] - Merge pull request #216 from bem/issue_174 (Slava Oliyanchuk)

# 2016-03-24, [v6.1.0](https://github.com/bem/bem-xjst/compare/v6.0.0...v6.1.0), @miripiruni

## Pass BEMContext instance as argument to template body

Now you can write arrow functions in templates:
```js
block('arrow').match((_, json) => json._myFlag).tag()('strong');
```

* [[`154a447662`](https://github.com/bem/bem-xjst/commit/154a447662)] - Merge pull request #200 from bem/feature/es6-adoption (Slava Oliyanchuk)

# 2016-03-24, [v6.0.1](https://github.com/bem/bem-xjst/compare/v6.0.0...v6.0.1), @miripiruni

## Fix rendering mixes for namesake elems

Should support mixing namesake elements of different blocks

Example. Template:

```js
block('b1').elem('elem')(
    mix()({ block: 'b2', elem: 'elem' })
);
```

v6.0.0 result (bug):
```js
<div class="b1__elem"></div>
```

v6.0.1 result (fixed):
```js
<div class="b1__elem b2__elem"></div>
```

* [[`82374951eb`](https://github.com/bem/bem-xjst/commit/82374951eb)] - **Docs**: Update 6-templates-context.md (Alexander Savin)
* [[`63e49b26bc`](https://github.com/bem/bem-xjst/commit/63e49b26bc)] - **BEMHTML**: fix rendering mixes for namesake elems (Alexey Yaroshevich)
* [[`7eedcf83a4`](https://github.com/bem/bem-xjst/commit/7eedcf83a4)] - **Bench**: fix bem-xjst api (miripiruni)
* [[`059ce55493`](https://github.com/bem/bem-xjst/commit/059ce55493)] - **Docs**: Fix markdown (Slava Oliyanchuk)
* [[`4ed98646c0`](https://github.com/bem/bem-xjst/commit/4ed98646c0)] - **Docs**: changelog updated (miripiruni)

# 2016-03-09, [v6.0.0](https://github.com/bem/bem-xjst/compare/v5.1.0...v6.0.0), @miripiruni

## Deprecated API

 * once()
 * this.isArray() (use Array.isArray)
 * local()

## Breaking changes: tag template should override tag in BEMJSON

Example. Template:

```js
block('button').tag()('button');
```
Data:
```js
{ block: 'button', tag: 'a' }
```

5.x result:
```html
<a class="button"></a>
```

6.x result:
```html
<button class="button"></button>
```

## User can choose between tag in bemjson and custom value in templates.

```js
block('b').tag()(function() {
    return this.ctx.tag || 'strong';
});
```
Data:
```js
[ { block: 'b', tag: 'em' }, { block: 'b' } ]
```

6.x result: 
```html
<em class="b"></em><strong class="b"></strong>
```

# 2016-03-09, [v5.1.0](https://github.com/bem/bem-xjst/compare/v5.0.0...v5.1.0), @miripiruni

Related: https://github.com/bem/bem-core/pull/805

+15 test cases
–1 bug


## Fixed (degradation)

### 1. bemhtml should duplicate block class if mix several block with mods to elem in the same block.

Because block class must have for mix block with mods to block elem.

Example:
```js
({
    block: 'b',
    content: {
        elem: 'e',
        mix: [
            { block: 'b', mods: { m1: 'v1' } },
            { block: 'b', mods: { m2: 'v2' } }
        ]
    }
});
```

4.3.4 result:
```html
<div class="b"><div class="b__e b b_m1_v1 b b_m2_v2"></div></div>
```
[demo](http://bem.github.io/bem-xjst/?bemhtml=&bemjson=(%7B%0A%20%20%20%20block%3A%20%27b%27%2C%0A%20%20%20%20content%3A%20%7B%0A%20%20%20%20%20%20%20%20elem%3A%20%27e%27%2C%0A%20%20%20%20%20%20%20%20mix%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%7B%20block%3A%20%27b%27%2C%20mods%3A%20%7B%20m1%3A%20%27v1%27%20%7D%20%7D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%7B%20block%3A%20%27b%27%2C%20mods%3A%20%7B%20m2%3A%20%27v2%27%20%7D%20%7D%0A%20%20%20%20%20%20%20%20%5D%0A%20%20%20%20%7D%0A%7D)%3B)

5.0.0 result:
```html
<div class="b"><div class="b__e b b"></div></div>
```
[demo](http://miripiruni.github.io/bem-xjst/?bemhtml=&bemjson=(%7B%0A%20%20%20%20block%3A%20%27b%27%2C%0A%20%20%20%20content%3A%20%7B%0A%20%20%20%20%20%20%20%20elem%3A%20%27e%27%2C%0A%20%20%20%20%20%20%20%20mix%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%7B%20block%3A%20%27b%27%2C%20mods%3A%20%7B%20m1%3A%20%27v1%27%20%7D%20%7D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%7B%20block%3A%20%27b%27%2C%20mods%3A%20%7B%20m2%3A%20%27v2%27%20%7D%20%7D%0A%20%20%20%20%20%20%20%20%5D%0A%20%20%20%20%7D%0A%7D));

5.1.0 result:
```html
<div class="b"><div class="b__e b b_m1_v1 b b_m2_v2"></div></div>
```

## Improved

### 2. bemhtml should not duplicate block class if mix is the same block with mods.

```js
({
    block: 'b',
    mix: [
        { block: 'b', mods: { m1: 'v1' } },
        { block: 'b', mods: { m2: 'v2' } }
    ]
});
```

4.3.4 result:
```html
<div class="b b b_m1_v1 b b_m2_v2"></div>
```

[demo](http://bem.github.io/bem-xjst/?bemhtml=&bemjson=(%7B%0A%20%20%20%20block%3A%20%27b%27%2C%0A%20%20%20%20mix%3A%20%5B%0A%20%20%20%20%20%20%20%20%7B%20block%3A%20%27b%27%2C%20mods%3A%20%7B%20m1%3A%20%27v1%27%20%7D%20%7D%2C%0A%20%20%20%20%20%20%20%20%7B%20block%3A%20%27b%27%2C%20mods%3A%20%7B%20m2%3A%20%27v2%27%20%7D%20%7D%0A%20%20%20%20%5D%0A%7D)%3B)

5.0.0 result:
```html
<div class="b b b_m1_v1 b b_m2_v2"></div>
```

[demo](http://miripiruni.github.io/bem-xjst/?bemhtml=&bemjson=(%7B%0A%20%20%20%20block%3A%20%27b%27%2C%0A%20%20%20%20mix%3A%20%5B%0A%20%20%20%20%20%20%20%20%7B%20block%3A%20%27b%27%2C%20mods%3A%20%7B%20m1%3A%20%27v1%27%20%7D%20%7D%2C%0A%20%20%20%20%20%20%20%20%7B%20block%3A%20%27b%27%2C%20mods%3A%20%7B%20m2%3A%20%27v2%27%20%7D%20%7D%0A%20%20%20%20%5D%0A%7D)%3B)


5.1.0 result:
```html
<div class="b b_m1_v1 b_m2_v2"></div>
```


### 3. bemhtml should not duplicate elem class if mix is the same elem.

Weird case, but for completeness why not to check it

```js
({
    block: 'b',
    elem: 'e',
    mix: { elem: 'e' }
});
```

4.3.4 result:
```html
<div class="b__e b__e"></div>
```

[demo](http://bem.github.io/bem-xjst/?bemhtml=&bemjson=(%7B%0A%20%20%20%20block%3A%20%27b%27%2C%0A%20%20%20%20elem%3A%20%27e%27%2C%0A%20%20%20%20mix%3A%20%7B%20elem%3A%20%27e%27%20%7D%0A%7D)%3B)

5.0.0 result:
```html
<div class="b__e b__e"></div>
```

[demo](http://miripiruni.github.io/bem-xjst/?bemhtml=&bemjson=(%7B%0A%20%20%20%20block%3A%20%27b%27%2C%0A%20%20%20%20elem%3A%20%27e%27%2C%0A%20%20%20%20mix%3A%20%7B%20elem%3A%20%27e%27%20%7D%0A%7D)%3B)

5.1.0 result:
```html
<div class="b__e"></div>
```

### 4. bemhtml should not duplicate elem class if mix is the same block elem.

Weird case, but for completeness why not to check it.

```js
({
    block: 'b',
    elem: 'e',
    mix: { block: 'b', elem: 'e' }
});
```

4.3.4 result:
```html
<div class="b__e b__e"></div>
```

[demo](http://bem.github.io/bem-xjst/?bemhtml=&bemjson=(%7B%0A%20%20%20%20block%3A%20%27b%27%2C%0A%20%20%20%20elem%3A%20%27e%27%2C%0A%20%20%20%20mix%3A%20%7B%20block%3A%20%27b%27%2C%20elem%3A%20%27e%27%20%7D%0A%7D)%3B)


5.0.0 result:
```html
<div class="b__e b__e"></div>
```

[demo](http://miripiruni.github.io/bem-xjst/?bemhtml=&bemjson=(%7B%0A%20%20%20%20block%3A%20%27b%27%2C%0A%20%20%20%20elem%3A%20%27e%27%2C%0A%20%20%20%20mix%3A%20%7B%20block%3A%20%27b%27%2C%20elem%3A%20%27e%27%20%7D%0A%7D)%3B)

5.1.0 result:
```html
<div class="b__e"></div>
```

### 5. bemhtml should not duplicate elem class if mix the same elem to elem in block.

Weird case, but for completeness why not to check it.

```js
({
    block: 'b',
    content: {
        elem: 'e',
        mix: { elem: 'e' }
    }
});
```

4.3.4 result:
```html
<div class="b"><div class="b__e b__e"></div></div>
```

[demo](http://bem.github.io/bem-xjst/?bemhtml=&bemjson=(%7B%0A%20%20%20%20block%3A%20%27b%27%2C%0A%20%20%20%20content%3A%20%7B%0A%20%20%20%20%20%20%20%20elem%3A%20%27e%27%2C%0A%20%20%20%20%20%20%20%20mix%3A%20%7B%20elem%3A%20%27e%27%20%7D%0A%20%20%20%20%7D%0A%7D)%3B)

5.0.0 result:
```html
<div class="b"><div class="b__e b__e"></div></div>
```

[demo](http://miripiruni.github.io/bem-xjst/?bemhtml=&bemjson=(%7B%0A%20%20%20%20block%3A%20%27b%27%2C%0A%20%20%20%20content%3A%20%7B%0A%20%20%20%20%20%20%20%20elem%3A%20%27e%27%2C%0A%20%20%20%20%20%20%20%20mix%3A%20%7B%20elem%3A%20%27e%27%20%7D%0A%20%20%20%20%7D%0A%7D)%3B)

5.1.0 result:
```html
<div class="b"><div class="b__e"></div></div>
```



### 6. bemhtml should not duplicate elem class if mix is the same block elem with elemMods.

```js
({
    block: 'b',
    elem: 'e',
    mix: { elem: 'e', elemMods: { modname: 'modval' } }
});
```

4.3.4 result:
```html
<div class="b__e b__e b__e_modname_modval"></div>
```

[demo](http://bem.github.io/bem-xjst/?bemhtml=&bemjson=(%7B%0A%20%20%20%20block%3A%20%27b%27%2C%0A%20%20%20%20elem%3A%20%27e%27%2C%0A%20%20%20%20mix%3A%20%7B%20elem%3A%20%27e%27%2C%20elemMods%3A%20%7B%20modname%3A%20%27modval%27%20%7D%20%7D%0A%7D)%3B)

5.0.0 result:
```html
<div class="b__e b__e b__e_modname_modval"></div>
```

[demo](http://miripiruni.github.io/bem-xjst/?bemhtml=&bemjson=(%7B%0A%20%20%20%20block%3A%20%27b%27%2C%0A%20%20%20%20elem%3A%20%27e%27%2C%0A%20%20%20%20mix%3A%20%7B%20elem%3A%20%27e%27%2C%20elemMods%3A%20%7B%20modname%3A%20%27modval%27%20%7D%20%7D%0A%7D)%3B)

5.1.0 result:
```html
<div class="b__e b__e_modname_modval"></div>
```

### 7. bemhtml should not duplicate block elem elemMods class

```js
({
    block: 'b',
    elem: 'e',
    mix: { block: 'b', elem: 'e', elemMods: { modname: 'modval' } }
});
```

4.3.4 result:
```html
<div class="b__e b__e b__e_modname_modval"></div>
```

[demo](http://bem.github.io/bem-xjst/?bemhtml=&bemjson=(%7B%0A%20%20%20%20block%3A%20%27b%27%2C%0A%20%20%20%20elem%3A%20%27e%27%2C%0A%20%20%20%20mix%3A%20%7B%20block%3A%20%27b%27%2C%20elem%3A%20%27e%27%2C%20elemMods%3A%20%7B%20modname%3A%20%27modval%27%20%7D%20%7D%0A%7D)%3B)

5.0.0 result:
```html
<div class="b__e b__e b__e_modname_modval"></div>
```

[demo](http://miripiruni.github.io/bem-xjst/?bemhtml=&bemjson=(%7B%0A%20%20%20%20block%3A%20%27b%27%2C%0A%20%20%20%20elem%3A%20%27e%27%2C%0A%20%20%20%20mix%3A%20%7B%20block%3A%20%27b%27%2C%20elem%3A%20%27e%27%2C%20elemMods%3A%20%7B%20modname%3A%20%27modval%27%20%7D%20%7D%0A%7D)%3B)

5.1.0 result:
```html
<div class="b__e b__e_modname_modval"></div>
```


## “Who cares” cases (zero cost but enjoyable)

Weird cases, but for completeness why not to check it.

### 8. bemhtml should duplicate block mods class if mix is the same block with mods.

But who cares? It’s pretty rare case.
To fix this we need to compare each key/value pairs. It’s too expensive.
I believe that developers should not want to do this.

```js
({
    block: 'b',
    mods: { m: 'v' },
    mix: { block: 'b', mods: { m: 'v' } }
});
```

4.3.4 result:
```html
<div class="b b_m_v b b_m_v"></div>
```

[demo](http://bem.github.io/bem-xjst/?bemhtml=&bemjson=(%7B%0A%20%20%20%20block%3A%20%27b%27%2C%0A%20%20%20%20mods%3A%20%7B%20m%3A%20%27v%27%20%7D%2C%0A%20%20%20%20mix%3A%20%7B%20block%3A%20%27b%27%2C%20mods%3A%20%7B%20m%3A%20%27v%27%20%7D%20%7D%0A%7D)%3B)

5.0.0 result:
```html
<div class="b b_m_v b b_m_v"></div>
```

[demo](http://miripiruni.github.io/bem-xjst/?bemhtml=&bemjson=(%7B%0A%20%20%20%20block%3A%20%27b%27%2C%0A%20%20%20%20mods%3A%20%7B%20m%3A%20%27v%27%20%7D%2C%0A%20%20%20%20mix%3A%20%7B%20block%3A%20%27b%27%2C%20mods%3A%20%7B%20m%3A%20%27v%27%20%7D%20%7D%0A%7D)%3B)

5.1.0 result:
```html
<div class="b b_m_v b_m_v"></div>
```


### 9. bemhtml should duplicate elem elemMod class

```js
({
    block: 'b',
    content: {
        elem: 'e',
        elemMods: { modname: 'modval' },
        mix: { elem: 'e', elemMods: { modname: 'modval' } }
    }
});
```

But who cares? It’s pretty rare case.
To fix this we need to compare each key/value pairs. It’s too expensive.
I believe that developers should not want to do this.

4.3.4 result:
```html
<div class="b">
    <div class="b__e b__e_modname_modval b__e b__e_modname_modval"></div>
</div>
```

[demo](http://bem.github.io/bem-xjst/?bemhtml=&bemjson=(%7B%0A%20%20%20%20block%3A%20%27b%27%2C%0A%20%20%20%20content%3A%20%7B%0A%20%20%20%20%20%20%20%20elem%3A%20%27e%27%2C%0A%20%20%20%20%20%20%20%20elemMods%3A%20%7B%20modname%3A%20%27modval%27%20%7D%2C%0A%20%20%20%20%20%20%20%20mix%3A%20%7B%20elem%3A%20%27e%27%2C%20elemMods%3A%20%7B%20modname%3A%20%27modval%27%20%7D%20%7D%0A%20%20%20%20%7D%0A%7D)%3B)

5.0.0 result:
```html
<div class="b">
    <div class="b__e b__e_modname_modval b__e b__e_modname_modval"></div>
</div>
```

[demo](http://miripiruni.github.io/bem-xjst/?bemhtml=&bemjson=(%7B%0A%20%20%20%20block%3A%20%27b%27%2C%0A%20%20%20%20content%3A%20%7B%0A%20%20%20%20%20%20%20%20elem%3A%20%27e%27%2C%0A%20%20%20%20%20%20%20%20elemMods%3A%20%7B%20modname%3A%20%27modval%27%20%7D%2C%0A%20%20%20%20%20%20%20%20mix%3A%20%7B%20elem%3A%20%27e%27%2C%20elemMods%3A%20%7B%20modname%3A%20%27modval%27%20%7D%20%7D%0A%20%20%20%20%7D%0A%7D)%3B)

5.1.0 result:
```html
<div class="b">
    <div class="b__e b__e_modname_modval b__e_modname_modval"></div>
</div>
```


# 2016-01-29, [v5.0.0](https://github.com/bem/bem-xjst/compare/v4.3.3...v5.0.0), @miripiruni
**BEMHTML breaking changes**: behavior mods and elemMods BEMJSON fields are changed. 

BEM-XJST now should not treat mods as elemMods if block exist.
```js
// BEMJSON
{
  block: 'b',
  elem: 'e',
  mods: { m: 'v' } // will be ignored because of elem
}

// Result with v4.3.3
'v class="b__e b__e_m_v"></div>'

// Result with v5.0.0
'<div class="b1__e1"></div>'
```

BEM-XJST should not treat elemMods as mods.
```js
// BEMJSON
{
  block: 'b1',
  elemMods: { m1: 'v1' }
}

// Result with v4.3.3
'<div class="b1 b1_m1_v1"></div>'

// Result with v5.0.0
'<div class="b1"></div>'
```

**BEM-XJST breaking changes**: BEM-XJST now supports two template engines — BEMHTML for getting HTML output and BEMTREE for getting BEMJSON. By default BEM-XJST will use BEMHTML engine.
Usage example:

```js
var bemxjst = require('bem-xjst');
var bemhtml = bemxjst.bemhtml;

// Add templates
var templates = bemhtml.compile(function() {
  block('b').content()('yay');
});

// Apply templates to data context in BEMJSON format and get result as HTML string
templates.apply({ block: 'b' });
// Result: <div class="b">yay</div>
```

```js
var bemxjst = require('bem-xjst');
var bemtree = bemxjst.bemtree;

// Add templates
var templates = bemtree.compile(function() {
  block('b').content()('yay');
});

// Apply templates to data context in BEMJSON format and get result as BEMJSON
templates.apply({ block: 'b' });
// Result: { block: 'b1', content: 'yay' }
```


Now supports changing elemMods in runtime. Example:
```js
// Template
block('b1').elem('e1').def()(function() {
  this.elemMods.a = 'b';
  return applyNext();
});
// BEMJSON
{ block: 'b1', elem: 'e1' }
// Result:
'<div class="b1__e1 b1__e1_a_b"</div>'
```

BEMTREE will return Boolean as is. Example:
```js
// Input BEMJSON
[
  true,
  { block: 'b1', content: true },
  [ { elem: 'e1', content: true }, true ]
]
// Output BEMJSON
[
  true,
  { block: 'b1', content: true },
  [ { elem: 'e1', content: true }, true ]
]
```

## 2016-01-22, [v4.3.3](https://github.com/bem/bem-xjst/compare/v4.3.2...v4.3.3), @miripiruni
Should properly render attr values:
```js
// BEMJSON
{
    tag: 'input',
    attrs: {
        name: undefined, // will not render at all
        value: null,     // will not render
        disabled: false, // will not render too
        disabled: true,  // will render as attr without value: disabled
        value: 0,        // will render as you expect: value="0"
        placeholder: ''  // will render as is: placeholder=""
    }
}
// Result:
'<input disabled value="0" placeholder=""/>'
```

Skip mix item if falsy:

```js
// BEMJSON
{
    block: 'b1',
    mix: [ null, '', false, undefined, 0, { block: 'b2' } ]
}
// Will render to:
'<div class="b1 b2"></div>'
```


Commits:
* [[`a48aeab5a6`](https://github.com/bem/bem-xjst/commit/a48aeab5a6)] - **BEMHTML**: should properly render attr values (miripiruni)
* [[`e8e468dce7`](https://github.com/bem/bem-xjst/commit/e8e468dce7)] - **BEMHTML**: skip mix item if falsy (miripiruni)

## 2016-01-19, [v4.3.2](https://github.com/bem/bem-xjst/compare/v4.3.1...v4.3.2), @miripiruni
From this moment we have intelligible changelog. Hooray!

`elem === ''` means no elem. Example:
```js
// BEMJSON:
{ block: 'b2', elem: '' }
// Result:
'<div class="b2"></div>'
```

Now BEM-XJST will ignore empty string as modName and elemModName. Example:
```js
// BEMJSON:
{ block: 'a', mods: { '': 'b' } }
// Result:
'<div class="a"></div>'

// BEMJSON:
{ block: 'a', elem: 'b', elemMods: { '': 'c' } }
// Result:
'<div class="a__b"></div>'
```

Commits:
* [[`41604e3567`](https://github.com/bem/bem-xjst/commit/41604e3567)] - Port of 6c427cc (#152): class-builder: `elem === ''` means no elem (miripiruni)
* [[`62763e6b16`](https://github.com/bem/bem-xjst/commit/62763e6b16)] - Port of 0872a8b (#164): should ignore empty string as modName and elemModName (miripiruni)
* [[`e11506e010`](https://github.com/bem/bem-xjst/commit/e11506e010)] - CHANGELOG.md added (miripiruni)
* [[`74055c9e23`](https://github.com/bem/bem-xjst/commit/74055c9e23)] - **travis**: Run tests on node 4 (Vladimir Grinenko)

## 2015-12-23, [v4.3.1](https://github.com/bem/bem-xjst/compare/v4.3.0...v4.3.1), @miripiruni
Order of execution `match`es was changed. Example:

```js
// BEMJSON: { block: 'b' }
// Template:
block('b')(
  // this.ctx.opa is undefined
  match(function() { return this.ctx.opa; })(
    content()(
      // this match will not executed because of match before
      match(function() { return true; })(function() {
        return 'nope';
      })
    )
  )
);
// Result: <div class="b"></div>
```

Commits:
* [[`f61e647656`](https://github.com/bem/bem-xjst/commit/f61e647656)] - **bemxjst**: fix order of execution of `match`es (Fedor Indutny) 

## 2015-12-23, [v4.3.0](https://github.com/bem/bem-xjst/compare/v4.2.7...v4.3.0), @miripiruni
Now all shortcuts for predicates (attrs, bem, cls, content, js, mix, tag and etc) must have no arguments.
```js
// Incorrect!
block('b').tag('span'); // Will throw `BEMHTML error: Predicate should not have arguments`

// Correct:
block('b').tag()('span');
```

Commits:
* [[`efa223d413`](https://github.com/bem/bem-xjst/commit/efa223d413)] - Throw error if args passed to shortcut predicates (Vladimir Grinenko) 
* [[`059c0b9bfb`](https://github.com/bem/bem-xjst/commit/059c0b9bfb)] - **Context**: Remove unused BEM field (Vladimir Grinenko) 
* [[`351896b840`](https://github.com/bem/bem-xjst/commit/351896b840)] - **util**: Remove unused NAME_PATTERN variable (Vladimir Grinenko) 

## 2015-11-13, [v4.2.7](https://github.com/bem/bem-xjst/compare/v4.2.6...v4.2.7), Fedor Indutny 
* [[`1ab21c3523`](https://github.com/bem/bem-xjst/commit/1ab21c3523)] - **match**: re-throw exceptions and restore state (sbmaxx) 
* [[`c08cd5fc42`](https://github.com/bem/bem-xjst/commit/c08cd5fc42)] - fix generateId (sbmaxx) 
* [[`cf8aea8382`](https://github.com/bem/bem-xjst/commit/cf8aea8382)] - refactoring for templates function reuse detection (Sergey Berezhnoy) 

## 2015-11-02, [v4.2.6](https://github.com/bem/bem-xjst/compare/v4.2.5...v4.2.6), Sergey Berezhnoy 
* [[`c0aa4f9f95`](https://github.com/bem/bem-xjst/commit/c0aa4f9f95)] - close #101: \[4.x\] Compiled bundle is broken after minification. (Sergey Berezhnoy) 
* [[`7baa64cffa`](https://github.com/bem/bem-xjst/commit/7baa64cffa)] - added editorconfig (sbmaxx) 

## 2015-10-22, [v4.2.5](https://github.com/bem/bem-xjst/compare/v4.2.4...v4.2.5), Fedor Indutny 
* [[`9c34a371c4`](https://github.com/bem/bem-xjst/commit/9c34a371c4)] - **tree**: verify `.match()` arguments (Fedor Indutny) 
* [[`657e6c1c47`](https://github.com/bem/bem-xjst/commit/657e6c1c47)] - **make**: browser bundle (Mikhail Troshev) 

## 2015-09-22, [v4.2.4](https://github.com/bem/bem-xjst/compare/v4.2.3...v4.2.4), Fedor Indutny 
* [[`568af675dc`](https://github.com/bem/bem-xjst/commit/568af675dc)] - **bench**: update bem-xjst (Fedor Indutny) 
* [[`8d41f98c8f`](https://github.com/bem/bem-xjst/commit/8d41f98c8f)] - **runtime**: escaping optimization (Mikhail Troshev) 

## 2015-09-04, [v4.2.3](https://github.com/bem/bem-xjst/compare/v4.2.2...v4.2.3), Fedor Indutny 
* [[`fd19a48f4e`](https://github.com/bem/bem-xjst/commit/fd19a48f4e)] - **runtime**: fix list indexes for non-BEM entities (Fedor Indutny) 

## 2015-08-19, [v4.2.2](https://github.com/bem/bem-xjst/compare/v4.2.1...v4.2.2), Fedor Indutny 
* [[`dc627d968f`](https://github.com/bem/bem-xjst/commit/dc627d968f)] - **runtime**: restore `_currBlock` (Fedor Indutny) 
* [[`f1d1798562`](https://github.com/bem/bem-xjst/commit/f1d1798562)] - add test for save context while render plain html items (Sergey Berezhnoy) 

## 2015-08-18, [v4.2.1](https://github.com/bem/bem-xjst/compare/v4.2.0...v4.2.1), Fedor Indutny 
* [[`d469902e92`](https://github.com/bem/bem-xjst/commit/d469902e92)] - **runtime**: use ClassBuilder everywhere (Fedor Indutny) 

## 2015-08-18, [v4.2.0](https://github.com/bem/bem-xjst/compare/v4.1.0...v4.2.0), Fedor Indutny 
* [[`f5046467bc`](https://github.com/bem/bem-xjst/commit/f5046467bc)] - **api**: introduce `.compile(..., { naming: ... })` (Fedor Indutny) 
* [[`bee0f0fca0`](https://github.com/bem/bem-xjst/commit/bee0f0fca0)] - **utils**: separate class builder instance (Fedor Indutny) 

## 2015-08-17, [v4.1.0](https://github.com/bem/bem-xjst/compare/v4.0.2...v4.1.0), Fedor Indutny 
* [[`6cb6f3b226`](https://github.com/bem/bem-xjst/commit/6cb6f3b226)] - **runtime**: wildcard elem templates (Fedor Indutny) 

## 2015-08-11, [v4.0.2](https://github.com/bem/bem-xjst/compare/v4.0.1...v4.0.2), Fedor Indutny 
* [[`1b62db8ef6`](https://github.com/bem/bem-xjst/commit/1b62db8ef6)] - **tree**: proper `extend()`/`replace()`/`wrap()` (Fedor Indutny) 

## 2015-08-04, [v4.0.1](https://github.com/bem/bem-xjst/compare/v4.0.0...v4.0.1), Fedor Indutny 
* [[`b9a426d203`](https://github.com/bem/bem-xjst/commit/b9a426d203)] - **runtime**: do not propagate elem to JS params in mix (Fedor Indutny) 
* [[`3c7f23994f`](https://github.com/bem/bem-xjst/commit/3c7f23994f)] - **runtime**: do not propagate default `mods` (Fedor Indutny) 
* [[`6b9de40b71`](https://github.com/bem/bem-xjst/commit/6b9de40b71)] - **runtime**: support `0` input (Fedor Indutny) 

## 2015-07-31, [v4.0.0](https://github.com/bem/bem-xjst/compare/v3.1.1...v4.0.0), Fedor Indutny 
* [[`0fd0a0722d`](https://github.com/bem/bem-xjst/commit/0fd0a0722d)] - **tree**: add syntax sugar to `.wrap()` (Fedor Indutny) 

## 3.1.1 Fedor Indutny 
* [[`20a94f45ea`](https://github.com/bem/bem-xjst/commit/20a94f45ea)] - **match**: fix early `once` / `wrap` (Fedor Indutny) 

## 3.1.0 Fedor Indutny 
* [[`7a89388869`](https://github.com/bem/bem-xjst/commit/7a89388869)] - **tree**: `.wrap()` method (Fedor Indutny) 

## 3.0.1 Fedor Indutny 
* [[`56d9d5f8ed`](https://github.com/bem/bem-xjst/commit/56d9d5f8ed)] - **runtime**: allocate `mods`/`elemMods` once (Fedor Indutny) 

## 3.0.0 Fedor Indutny 
* [[`4cc90a0e78`](https://github.com/bem/bem-xjst/commit/4cc90a0e78)] - **compiler**: enchance stack traces for basic compile (Fedor Indutny) 
* [[`861beb1120`](https://github.com/bem/bem-xjst/commit/861beb1120)] - **runtime**: support mixing with block itself (Fedor Indutny) 
* [[`51e468f8a1`](https://github.com/bem/bem-xjst/commit/51e468f8a1)] - **test**: do not use `.apply.call()` (Fedor Indutny) 
* [[`6c50202514`](https://github.com/bem/bem-xjst/commit/6c50202514)] - **lib**: deprecate `BEMHTML.apply.call(BEMJSON)` (Fedor Indutny) 
* [[`5a26b3205a`](https://github.com/bem/bem-xjst/commit/5a26b3205a)] - **runtime**: custom mode with local changes (Fedor Indutny) 

## 2.0.1 Fedor Indutny 
* [[`640daa6f33`](https://github.com/bem/bem-xjst/commit/640daa6f33)] - **npm**: do not ignore bundle (Fedor Indutny) 

## 2.0.0 Fedor Indutny 
* [[`43e827572b`](https://github.com/bem/bem-xjst/commit/43e827572b)] - **readme**: a bit of API documentation (Fedor Indutny) 
* [[`8ee713e278`](https://github.com/bem/bem-xjst/commit/8ee713e278)] - **readme**: link to changes, license (Fedor Indutny) 
* [[`bf895db486`](https://github.com/bem/bem-xjst/commit/bf895db486)] - **bench**: bump hash (Fedor Indutny) 
* [[`9b547cd43a`](https://github.com/bem/bem-xjst/commit/9b547cd43a)] - **compiler**: support adding templates at runtime (Fedor Indutny) 
* [[`fccd9d4121`](https://github.com/bem/bem-xjst/commit/fccd9d4121)] - **lib**: `xjstOptions({ flush: true })` (Fedor Indutny) 
* [[`41baa6a296`](https://github.com/bem/bem-xjst/commit/41baa6a296)] - **tree**: `.xjstOptions({ ... })` for compiler options (Fedor Indutny) 
* [[`678e33e19d`](https://github.com/bem/bem-xjst/commit/678e33e19d)] - **runtime**: skip flushing on overridden `.def()` (Fedor Indutny) 
* [[`46860e95c2`](https://github.com/bem/bem-xjst/commit/46860e95c2)] - **runtime**: wildcard applies to default entities too (Fedor Indutny) 
* [[`1140426b01`](https://github.com/bem/bem-xjst/commit/1140426b01)] - **runtime**: invalidate nested `applyNext()` (Fedor Indutny) 
* [[`038303ad57`](https://github.com/bem/bem-xjst/commit/038303ad57)] - **bench**: log errors (Fedor Indutny) 
* [[`555b00be20`](https://github.com/bem/bem-xjst/commit/555b00be20)] - **tree**: introduce `.once()` (Fedor Indutny) 
* [[`32ac07086e`](https://github.com/bem/bem-xjst/commit/32ac07086e)] - **runtime**: put `BEMContext` to `sharedContext` too (Fedor Indutny) 
* [[`93edc168a5`](https://github.com/bem/bem-xjst/commit/93edc168a5)] - **readme**: running benchmarks (Fedor Indutny) 
* [[`071c231b61`](https://github.com/bem/bem-xjst/commit/071c231b61)] - **test**: `fail` in fixtures (Fedor Indutny) 
* [[`8eab96ebe0`](https://github.com/bem/bem-xjst/commit/8eab96ebe0)] - **benchmarks**: bump bem-xjst version (Fedor Indutny) 
* [[`51dee4762f`](https://github.com/bem/bem-xjst/commit/51dee4762f)] - **context**: `_flush` method (Fedor Indutny) 
* [[`8d05d9a2d6`](https://github.com/bem/bem-xjst/commit/8d05d9a2d6)] - **benchmarks**: initial (Fedor Indutny) 
* [[`c959d7014b`](https://github.com/bem/bem-xjst/commit/c959d7014b)] - **compiler**: support running in `this` context (Fedor Indutny) 
* [[`0007fc0c6a`](https://github.com/bem/bem-xjst/commit/0007fc0c6a)] - **package**: revert `postinstall` changes (Fedor Indutny) 
* [[`ad7b156f5c`](https://github.com/bem/bem-xjst/commit/ad7b156f5c)] - **make**: fix installation (Fedor Indutny) 
* [[`cc0e595a7f`](https://github.com/bem/bem-xjst/commit/cc0e595a7f)] - **package**: hopefully `postinstall` is better (Fedor Indutny) 
* [[`7210961de3`](https://github.com/bem/bem-xjst/commit/7210961de3)] - **package**: compile bundle on install too (Fedor Indutny) 
* [[`b9ff3cb480`](https://github.com/bem/bem-xjst/commit/b9ff3cb480)] - **runtime**: support `undefined` mix (Fedor Indutny) 
* [[`6d7606fb9a`](https://github.com/bem/bem-xjst/commit/6d7606fb9a)] - **runtime**: support `block('*')` (Fedor Indutny) 
* [[`069ab0c2ee`](https://github.com/bem/bem-xjst/commit/069ab0c2ee)] - **runtime**: rename to `BEMContext` for compatibility (Fedor Indutny) 
* [[`5b633f05cf`](https://github.com/bem/bem-xjst/commit/5b633f05cf)] - **runtime**: allow overriding BEMHTMLContext (Fedor Indutny) 
* [[`ad085de169`](https://github.com/bem/bem-xjst/commit/ad085de169)] - **runtime**: support both changes and ctx in applyCtx (Fedor Indutny) 
* [[`2f89bf6d54`](https://github.com/bem/bem-xjst/commit/2f89bf6d54)] - **tree**: support inline arg to `extend()`/`replace()` (Fedor Indutny) 
* [[`21c05beaa8`](https://github.com/bem/bem-xjst/commit/21c05beaa8)] - **tree**: fix singular `replace()`/`extend()` (Fedor Indutny) 
* [[`d9fa30df0a`](https://github.com/bem/bem-xjst/commit/d9fa30df0a)] - **tree**: propagate `this` to replace()/extend() (Fedor Indutny) 
* [[`28cd78099e`](https://github.com/bem/bem-xjst/commit/28cd78099e)] - **runtime**: support string literal mix (Fedor Indutny) 
* [[`ef0659d7ee`](https://github.com/bem/bem-xjst/commit/ef0659d7ee)] - **runtime**: fix elem in mix classes (Fedor Indutny) 
* [[`ee7d1defa4`](https://github.com/bem/bem-xjst/commit/ee7d1defa4)] - **match**: store bitmask instead of `index` (Fedor Indutny) 
* [[`04666caa7e`](https://github.com/bem/bem-xjst/commit/04666caa7e)] - **compiler**: make it work with `require(...)` (Fedor Indutny) 
* [[`dbed08005a`](https://github.com/bem/bem-xjst/commit/dbed08005a)] - **context**: support `this.reapply()` (Fedor Indutny) 
* [[`6d2621613b`](https://github.com/bem/bem-xjst/commit/6d2621613b)] - **tree**: revert useless changes (Fedor Indutny) 
* [[`bc965af5ec`](https://github.com/bem/bem-xjst/commit/bc965af5ec)] - **runtime**: proper fix for #43 (Fedor Indutny) 
* [[`acc7e6bd49`](https://github.com/bem/bem-xjst/commit/acc7e6bd49)] - **runtime**: inherit `mods` properly (Fedor Indutny) 
* [[`43b5596bb7`](https://github.com/bem/bem-xjst/commit/43b5596bb7)] - **tree**: do not use `.map()` too (Fedor Indutny) 
* [[`2c1db76676`](https://github.com/bem/bem-xjst/commit/2c1db76676)] - **tree**: remove `.forEach` for old browser support (Fedor Indutny) 
* [[`42e235a14a`](https://github.com/bem/bem-xjst/commit/42e235a14a)] - **runtime**: take mods from the context too (Fedor Indutny) 
* [[`57f0e4d066`](https://github.com/bem/bem-xjst/commit/57f0e4d066)] - **runtime**: fix mix in JSON (Fedor Indutny) 
* [[`adf3216d8b`](https://github.com/bem/bem-xjst/commit/adf3216d8b)] - **runtime**: fix `mix` overwriting `jsParams` (Fedor Indutny) 
* [[`8b8ab29813`](https://github.com/bem/bem-xjst/commit/8b8ab29813)] - **runtime**: lazily set mods (Fedor Indutny) 
* [[`3f9e352da7`](https://github.com/bem/bem-xjst/commit/3f9e352da7)] - **runtime**: applyNext({ changes }) (Fedor Indutny) 
* [[`321b135195`](https://github.com/bem/bem-xjst/commit/321b135195)] - **tree**: proper nesting (Fedor Indutny) 
* [[`5ce73b1437`](https://github.com/bem/bem-xjst/commit/5ce73b1437)] - **test**: split into tree/runtime (Fedor Indutny) 
* [[`e38d2d3f5e`](https://github.com/bem/bem-xjst/commit/e38d2d3f5e)] - **test**: `oninit()` test (Fedor Indutny) 
* [[`0d9af0af69`](https://github.com/bem/bem-xjst/commit/0d9af0af69)] - **tree**: support `oninit()` (Fedor Indutny) 
* [[`de1b33e1b4`](https://github.com/bem/bem-xjst/commit/de1b33e1b4)] - **runtime**: support mix (Fedor Indutny) 
* [[`7eba120f1c`](https://github.com/bem/bem-xjst/commit/7eba120f1c)] - **runtime**: port over position/list stuff from i-bem (Fedor Indutny) 
* [[`8684c66636`](https://github.com/bem/bem-xjst/commit/8684c66636)] - **context**: port over `extend` and friends (Fedor Indutny) 
* [[`5462a46189`](https://github.com/bem/bem-xjst/commit/5462a46189)] - **runtime**: render without tag (Fedor Indutny) 
* [[`3e8d1d86a9`](https://github.com/bem/bem-xjst/commit/3e8d1d86a9)] - **tree**: fix ordering of the subpredicates (Fedor Indutny) 
* [[`ee3397128a`](https://github.com/bem/bem-xjst/commit/ee3397128a)] - **lib**: fix bug with grouping by elem (Fedor Indutny) 
* [[`b2fac673fa`](https://github.com/bem/bem-xjst/commit/b2fac673fa)] - **lib**: preserve block until next BEM entity (Fedor Indutny) 
* [[`cf0396218b`](https://github.com/bem/bem-xjst/commit/cf0396218b)] - **lib**: render attrs for non-bem entities (Fedor Indutny) 
* [[`e21f60baeb`](https://github.com/bem/bem-xjst/commit/e21f60baeb)] - **lib**: set block/elem/mods properly (Fedor Indutny) 
* [[`88f3160c37`](https://github.com/bem/bem-xjst/commit/88f3160c37)] - **lib**: do not render `undefined` (Fedor Indutny) 
* [[`a40cf34ff3`](https://github.com/bem/bem-xjst/commit/a40cf34ff3)] - **lib**: restore block/mods/elemMods (Fedor Indutny) 
* [[`3838318f3d`](https://github.com/bem/bem-xjst/commit/3838318f3d)] - **lib**: remove `bundle` file (Fedor Indutny) 
* [[`b9cf698aa8`](https://github.com/bem/bem-xjst/commit/b9cf698aa8)] - **lib**: add missing file (Fedor Indutny) 
* [[`152c6eb22c`](https://github.com/bem/bem-xjst/commit/152c6eb22c)] - **travis**: fix the build :) (Fedor Indutny) 
* [[`0b408d8c84`](https://github.com/bem/bem-xjst/commit/0b408d8c84)] - **package**: run `make` on `npm test` (Fedor Indutny) 
* [[`cf1c636a10`](https://github.com/bem/bem-xjst/commit/cf1c636a10)] - **lib**: jshint/jscs library (Fedor Indutny) 
* [[`c444ad0197`](https://github.com/bem/bem-xjst/commit/c444ad0197)] - **lib**: support custom modes (Fedor Indutny) 
* [[`298d2e2f04`](https://github.com/bem/bem-xjst/commit/298d2e2f04)] - **lib**: support elemMod/mod predicates (Fedor Indutny) 
* [[`a60a13741a`](https://github.com/bem/bem-xjst/commit/a60a13741a)] - **lib**: support custom predicates (Fedor Indutny) 
* [[`6d6bf43242`](https://github.com/bem/bem-xjst/commit/6d6bf43242)] - **compiler**: stub out new prototype (Fedor Indutny) 

## 1.0.0 Fedor Indutny 
* [[`1d859c734b`](https://github.com/bem/bem-xjst/commit/1d859c734b)] - **compiler**: replace()/extend() modes (vkz) 
* [[`1995df639e`](https://github.com/bem/bem-xjst/commit/1995df639e)] - **test**: test runtime mode again (Fedor Indutny) 

## 0.9.0 Fedor Indutny 
* [[`fcaf0514cb`](https://github.com/bem/bem-xjst/commit/fcaf0514cb)] - **compiler**: bump `this._mode` predicate (Fedor Indutny) 

## 0.8.3 Fedor Indutny 
* [[`f1f6d60ee6`](https://github.com/bem/bem-xjst/commit/f1f6d60ee6)] - **compiler**: fix replacing context in maps (Fedor Indutny) 

## 0.8.2 Fedor Indutny 
* [[`dc70685c99`](https://github.com/bem/bem-xjst/commit/dc70685c99)] - **compiler**: fix elem autoinsertion (Fedor Indutny) 

## 0.8.1 Fedor Indutny 
* [[`708f45b510`](https://github.com/bem/bem-xjst/commit/708f45b510)] - **bemhtml**: modulesProvidedDeps in scope for all envs (Vladimir Grinenko) 

## 0.8.0 Fedor Indutny 
* [[`845b4dee26`](https://github.com/bem/bem-xjst/commit/845b4dee26)] - **deps**: bump xjst and add globalInit (Fedor Indutny) 

## 0.7.1 Fedor Indutny 
* [[`54a3165861`](https://github.com/bem/bem-xjst/commit/54a3165861)] - Fix modules deps in wrap method (Vladimir Grinenko) 

## 0.7.0 Fedor Indutny 
* [[`3574d12b71`](https://github.com/bem/bem-xjst/commit/3574d12b71)] - Pass modules deps to wrap method (Vladimir Grinenko) 
* [[`fd5de7f4fc`](https://github.com/bem/bem-xjst/commit/fd5de7f4fc)] - AddedAdded russian README file (Dima Belitsky) 
* [[`d7d3eff9d2`](https://github.com/bem/bem-xjst/commit/d7d3eff9d2)] - Remove ometajs from deps (closes #11) (Vladimir Grinenko) 

## 0.6.1 Fedor Indutny 
* [[`f20817ab17`](https://github.com/bem/bem-xjst/commit/f20817ab17)] - **package**: bump xjst version, better asserts (Fedor Indutny) 

## 0.6.0 Fedor Indutny 
* [[`b1dbb2b193`](https://github.com/bem/bem-xjst/commit/b1dbb2b193)] - **package**: bump xjst (Fedor Indutny) 

## 0.5.0 Fedor Indutny 
* [[`b089f6d96c`](https://github.com/bem/bem-xjst/commit/b089f6d96c)] - **compiler**: use global $$ vars (Fedor Indutny) 
* [[`3222bb33fa`](https://github.com/bem/bem-xjst/commit/3222bb33fa)] - Update compiler.js (Sergey Berezhnoy) 

## 0.4.0 Fedor Indutny 
* [[`c6fd078ccb`](https://github.com/bem/bem-xjst/commit/c6fd078ccb)] - **compiler**: introduce `wrap` option (Fedor Indutny) 

## 0.3.6 Fedor Indutny 
* [[`7d8bf0363d`](https://github.com/bem/bem-xjst/commit/7d8bf0363d)] - **package**: fix dependencies (Fedor Indutny) 
* [[`74b329c4ca`](https://github.com/bem/bem-xjst/commit/74b329c4ca)] - **package**: update xjst (Fedor Indutny) 
* [[`2dc8582467`](https://github.com/bem/bem-xjst/commit/2dc8582467)] - **test**: fix API test (Fedor Indutny) 

## 0.3.5 Fedor Indutny 
* [[`fae6dfd4ad`](https://github.com/bem/bem-xjst/commit/fae6dfd4ad)] - **api**: support .elemMod('mod', 'value') (Fedor Indutny) 

## 0.3.4 Fedor Indutny 
* [[`8d9c8c4b03`](https://github.com/bem/bem-xjst/commit/8d9c8c4b03)] - **bemhtml**: forgot to expose methods (Fedor Indutny) 

## 0.3.3 Fedor Indutny 
* [[`de0e1bda2f`](https://github.com/bem/bem-xjst/commit/de0e1bda2f)] - **api**: new methods (Fedor Indutny) 

## 0.3.2 Fedor Indutny 
* [[`b336c5b3ff`](https://github.com/bem/bem-xjst/commit/b336c5b3ff)] - **test**: add regression test for applyNext problem (Fedor Indutny) 

## 0.3.1 Fedor Indutny 
* [[`962baa2fd2`](https://github.com/bem/bem-xjst/commit/962baa2fd2)] - **compiler**: add `!this.elem` only in correct places (Fedor Indutny) 

## 0.3.0 Fedor Indutny 
* [[`5ed3f3a95b`](https://github.com/bem/bem-xjst/commit/5ed3f3a95b)] - **compiler**: introduce elemMatch (Fedor Indutny) 
* [[`26c5322c70`](https://github.com/bem/bem-xjst/commit/26c5322c70)] - ***Revert*** "**test**: add test for !this.elem" (Fedor Indutny) 
* [[`7c4e465f4f`](https://github.com/bem/bem-xjst/commit/7c4e465f4f)] - ***Revert*** "**compiler**: add !this.elem" (Fedor Indutny) 
* [[`da65a0002f`](https://github.com/bem/bem-xjst/commit/da65a0002f)] - Add npm package version badge (Sergey Belov) 

## 0.2.5 Fedor Indutny 
* [[`fd3042966b`](https://github.com/bem/bem-xjst/commit/fd3042966b)] - **compiler**: swap order of arguments in applyCtx (Fedor Indutny) 

## 0.2.4 Fedor Indutny 
* [[`cb2b43789b`](https://github.com/bem/bem-xjst/commit/cb2b43789b)] - **compiler**: support multiple args for applyCtx (Fedor Indutny) 
* [[`fec1ceebe2`](https://github.com/bem/bem-xjst/commit/fec1ceebe2)] - **test**: add test for !this.elem (Fedor Indutny) 

## 0.2.3 Fedor Indutny 
* [[`8165a18039`](https://github.com/bem/bem-xjst/commit/8165a18039)] - **compiler**: add !this.elem (Fedor Indutny) 

## 0.2.2 Fedor Indutny 
* [[`28e2744539`](https://github.com/bem/bem-xjst/commit/28e2744539)] - **compiler**: applyCtx => applyNext(...), not apply() (Fedor Indutny) 
* [[`4cbdf537d9`](https://github.com/bem/bem-xjst/commit/4cbdf537d9)] - Update README.md (Sergey Berezhnoy) 

## 0.2.1 Fedor Indutny 
* [[`476e1d699f`](https://github.com/bem/bem-xjst/commit/476e1d699f)] - **compiler**: don't generate cache without changes (Fedor Indutny) 

## 0.2.0 Fedor Indutny 
* [[`83f9c83d67`](https://github.com/bem/bem-xjst/commit/83f9c83d67)] - **cache**: split strings at compile time (Fedor Indutny) 

## 0.1.5 Fedor Indutny 
* [[`8b76f70c80`](https://github.com/bem/bem-xjst/commit/8b76f70c80)] - **compiler**: cache should work with __$history (Fedor Indutny) 

## 0.1.4 Fedor Indutny 
* [[`2c8d518470`](https://github.com/bem/bem-xjst/commit/2c8d518470)] - **compiler**: mark user and runtime code (Fedor Indutny) 

## 0.1.3 Fedor Indutny 
* [[`aee8aac588`](https://github.com/bem/bem-xjst/commit/aee8aac588)] - **compiler**: options.cache=true support (Fedor Indutny) 

## 0.1.2 Fedor Indutny 
* [[`32eb32e052`](https://github.com/bem/bem-xjst/commit/32eb32e052)] - **package**: export cli (Fedor Indutny) 

## 0.1.1 Fedor Indutny 
* [[`0210d0953b`](https://github.com/bem/bem-xjst/commit/0210d0953b)] - **cli**: initial (Fedor Indutny) 

## 0.1.0 Fedor Indutny 
* [[`d68bae6dc1`](https://github.com/bem/bem-xjst/commit/d68bae6dc1)] - **test**: fix test (Fedor Indutny) 
* [[`ac3d9fac3a`](https://github.com/bem/bem-xjst/commit/ac3d9fac3a)] - **package**: downgrade xjst version (Fedor Indutny) 

## 0.0.6 Fedor Indutny 
* [[`788a866c66`](https://github.com/bem/bem-xjst/commit/788a866c66)] - **package**: update xjst (Fedor Indutny) 

## 0.0.5 Fedor Indutny 
* [[`3e73d250ca`](https://github.com/bem/bem-xjst/commit/3e73d250ca)] - **runtime**: fix working with uninitialized mods (Fedor Indutny) 

## 0.0.4 Fedor Indutny 
* [[`489f6f21f3`](https://github.com/bem/bem-xjst/commit/489f6f21f3)] - **compiler**: add mod('key', 'value') predicate (Fedor Indutny) 

## 0.0.3 Fedor Indutny 
* [[`9007b559d6`](https://github.com/bem/bem-xjst/commit/9007b559d6)] - **test**: fix tests after xjst update (Fedor Indutny) 

## 0.0.2 Fedor Indutny 
* [[`869eb06674`](https://github.com/bem/bem-xjst/commit/869eb06674)] - **package**: change name (Fedor Indutny) 
* [[`1ca290a389`](https://github.com/bem/bem-xjst/commit/1ca290a389)] - **lib**: re-release (Fedor Indutny) 
* [[`798cc6f48a`](https://github.com/bem/bem-xjst/commit/798cc6f48a)] - **compiler**: remove explicit context (Fedor Indutny) 
* [[`60b4543df1`](https://github.com/bem/bem-xjst/commit/60b4543df1)] - **travis**: fix (Fedor Indutny) 
* [[`838a4f0be0`](https://github.com/bem/bem-xjst/commit/838a4f0be0)] - **readme**: example (Fedor Indutny) 

## 0.0.1 Fedor Indutny 
* [[`69ebb0fb5e`](https://github.com/bem/bem-xjst/commit/69ebb0fb5e)] - **package**: add xjst dependency (Fedor Indutny) 
* [[`c45dc59a99`](https://github.com/bem/bem-xjst/commit/c45dc59a99)] - **ibem**: fixes (Fedor Indutny) 
* [[`28ebc48f72`](https://github.com/bem/bem-xjst/commit/28ebc48f72)] - **compiler**: do not beautify (Fedor Indutny) 
* [[`982cf4b542`](https://github.com/bem/bem-xjst/commit/982cf4b542)] - **compiler**: ibem=false mode (Fedor Indutny) 
* [[`9820cebe68`](https://github.com/bem/bem-xjst/commit/9820cebe68)] - **readme**: fix name (Fedor Indutny) 
* [[`05b017f5ad`](https://github.com/bem/bem-xjst/commit/05b017f5ad)] - **compiler**: do not touch shared i-bem ast (Fedor Indutny) 
* [[`08b6eafabd`](https://github.com/bem/bem-xjst/commit/08b6eafabd)] - initial (Fedor Indutny) 
