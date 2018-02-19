# bem-xjst

Declarative template engine for the browser and server with regular JS syntax.

[![NPM version](http://img.shields.io/npm/v/bem-xjst.svg?style=flat)](http://www.npmjs.org/package/bem-xjst)
[![Build Status](http://img.shields.io/travis/bem/bem-xjst/master.svg)](https://travis-ci.org/bem/bem-xjst)
[![Dependency Status](https://david-dm.org/bem/bem-xjst.svg)](https://david-dm.org/bem/bem-xjst)
[![devDependency Status](https://david-dm.org/bem/bem-xjst/dev-status.svg)](https://david-dm.org/bem/bem-xjst#info=devDependencies)
[![Coverage Status](https://coveralls.io/repos/github/bem/bem-xjst/badge.svg?branch=coverage-badge)](https://coveralls.io/github/bem/bem-xjst?branch=coverage-badge)

## Features

### Templates are extensible: they can be redefined or extended

You can redefine or extend just a particular part of output not only by simple
redefinition via new templates but also using ‘modes’. E.g. it may be a tag name
or its content.

```js
block('link')({ tag: 'span' });
// The template sets tag to `span` for all `link` blocks.
// And tag mode can be redefined if any condition passed.

block('link').match((node, ctx) => ctx.url)({ tag: 'a' });
// The template sets tag to `a` only if block `link` have `url` field.
// Otherwise tag will be ‘span’ as previous template says.
```

### Pattern matching

Templates are written using [pattern matching](/docs/en/7-runtime.md#how-templates-are-selected-and-applied) for the values and structure of input data

```js
block('list')({ tag: 'ul' });
block('item')({ tag: 'li' });
```

We can apply these two declarative-style templates templates to data:
```js
{
  block: 'list',
  content: [
    {
      block: 'item',
      content: {
          block: 'list',
          content: [
              { block: 'item', content: 'CSS' },
              { block: 'item', content: 'HTML' }
          ]
      }
    },
    {
      block: 'item',
      content: {
          block: 'list',
          content: { block: 'item', content: 'JS' }
      }
    }
  ] 
}
```

The result is:

```html
<ul class="list">
    <li class="item">
        <ul class="list">
            <li class="item">CSS</li>
            <li class="item">HTML</li>
        </ul>
    </li>
    <li class="item">
        <ul class="list">
            <li class="item">JS</li>
        </ul>
    </li>
</ul>
```

As you can see templates are as simple as CSS.

### Automatic recursive traversing upon input data

In the example above you may have noticed that bem-xjst automaticaly traverses input data by `content` fields. This behaviour is default feature of bem-xjst.

### Default rendering

Built-in rendering behavior is used by default, even if the user didn’t add templates. Even without templates. For example from above it will be:

```html
<div class="list">
    <div class="item">
        <div class="list">
            <div class="item">CSS</div>
            <div class="item">HTML</div>
        </div>
    </div>
    <div class="item">
        <div class="list">
            <div class="item">JS</div>
        </div>
    </div>
</div>
```

That is more than half of the work ;) You will add the salt (couple of templates for tags) and the HTML-soup is very tasty!


### No DSL, only JavaScript

Written in JavaScript, so the entire JavaScript infrastructure is available for checking code quality and conforming to best practices.

Since templates is a regular JavaScript code you can use automatic syntax validator from your editor and tools like JSHint/ESLint.

### Runs on a server and client

You can use bem-xjst in any browser as well as in any JavaScript VM. We support Node.JS v0.10 and higher.


## Tell me more

See documentation:

1. [About](/docs/en/1-about.md)
2. [Quick Start](/docs/en/2-quick-start.md)
3. [API: usage, methods, signatures and etc](/docs/en/3-api.md)
4. [Input data format](/docs/en/4-data.md): BEMJSON
5. [Templates syntax](/docs/en/5-templates-syntax.md)
6. [Templates context](/docs/en/6-templates-context.md)
7. [Runtime](/docs/en/7-runtime.md): processes for selecting and applying templates


## Try it

### Online sandbox

[Online demo](https://bem.github.io/bem-xjst/) allows you to share code snippets, change versions and etc. Happy templating!


### Install npm package

To compile bem-xjst, you need [Node.js](https://nodejs.org/) v0.10 or later, and [npm](https://www.npmjs.com/).

```bash
npm install bem-xjst
```

Copy-paste [example from quick start](https://github.com/bem/bem-xjst/blob/master/docs/en/2-quick-start.md#basic-example) or see [simple example](https://github.com/bem/bem-xjst/tree/master/examples/simple-page) from repository. Then read [documentation](https://github.com/bem/bem-xjst/blob/master/docs/en/) and start experimenting with bem-xjst.


## Is bem-xjst used in production?

Yes. A lot of projects in [Yandex](https://company.yandex.com/) and Alfa-Bank, also in opensource projects based on [bem-core](https://github.com/bem/bem-core) and [bem-components](https://github.com/bem/bem-components).

## Benchmarks

See [readme](https://github.com/bem/bem-xjst/tree/master/bench).

## Runtime linter

See [readme](https://github.com/bem/bem-xjst/tree/master/runtime-lint).

## Static linter and migration tool for templates

See [readme](https://github.com/bem/bem-xjst/tree/master/migration).

## Links

 * [Documentation](https://en.bem.info/platform/bem-xjst/)
 * [Changelog](CHANGELOG.md) and [releases notes](https://github.com/bem/bem-xjst/releases)
 * [Contributing guide](https://github.com/bem/bem-xjst/blob/master/CONTRIBUTING.md)
 * [Online demo](https://bem.github.io/bem-xjst/) (you can share code snippets)
 * Twitter account: [@bemxjst](https://twitter.com/bemxjst)
 * [Migration guides](https://github.com/bem/bem-xjst/wiki/Migration-guides) for all major versions
