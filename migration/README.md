# Migration tool

`cd migration/ && npm i`

`cd ../`

`./bin/bem-xjst-migrate ./path-to-templates/ 7 8`

where
 * `7` is current bem-xjst version on your project
 * `8` is major version to migrate.

Notice that templates in `./path-to-templates` will be overwritten.

# Static Lint


`cd migration/ && npm i`

`cd ../`

`./bin/bem-xjst-lint ./path-to-templates/ 0 8`

where
 * `0` is major version from
 * `8` is major to lint.

Result of linting is console warning like this:

```
BEM-XJST WARNING:
>>>> Function that returns a literal can be replaced with literal itself.
>>>> migration/tmpls/template.js:8
>>>> function() { return 42; }
```

# Tests

`npm test`


# Migrate from old DSL BEMHTML to JS syntax

Take a look at https://github.com/bem/bem-templates-converter
