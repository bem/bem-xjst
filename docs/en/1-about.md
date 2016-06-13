# About bem-xjst

## What is bem-xjst?

bem-xjst is a template engine for web development using the BEM methodology.

It contains two engines:

1. **BEMHTML** — for transforming BEMJSON to HTML.
1. **BEMTREE** — for transforming BEMJSON with data to BEMJSON with a BEM tree for further transformation using BEMHTML.

The template engine is based on the declarative principles of [XSLT](https://www.w3.org/TR/xslt) (eXtensible Stylesheet Language Transformations). The name XJST (eXtensible JavaScript Transformations) was also created as an analogy to XSLT.

Before using the template engine, you should review:

1. [BEMJSON format for input data](4-data.md)
1. [How to write templates](5-templates-syntax.md)
1. [Processes for selecting and applying templates](7-runtime.md)

## Features

1. Templates are extensible: they can be redefined or extended.
1. Templates are written using [pattern matching](7-runtime.md#how-templates-are-selected-and-applied) for the values and structure of input data.
1. Traverses input data by default.
1. Built-in rendering behavior is used by default, even if the user didn’t add templates.
1. Written in JavaScript, so the entire JavaScript infrastructure is available for checking code quality and conforming to best practices.
1. Doesn’t require compiling templates.
1. API provided for adding templates in runtime.
1. Runs on a server and client.

***

Read next: [Quick Start](2-quick-start.md)
