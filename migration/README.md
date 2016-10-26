# Mirgation tool

`cd migration/ && npm i`

`cd ../`

`./bin/bem-xjst-migrate ./path-to-templates/ 8`

where 8 is major version to migrate.

Notice that templates in `./path-to-templates` will be destructive rewrited.

# Static Lint


`cd migration/ && npm i`

`cd ../`

`./bin/bem-xjst-lint ./path-to-templates/ 8`

Where 8 is major version to lint.

Result of linting is console warning like this:

```
BEM-XJST WARNING:
>>>> Function that returns a literal can be replaced with literal itself.
>>>> migration/tmpls/template.js:8
>>>> function() { return 42; }
```

# Tests

`./node_modules/.bin/jest --bail`

