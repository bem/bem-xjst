# Migration tool

`cd migration/ && npm i`

`cd ../`

`./migration/lib/index.js --input ./path-to-templates/ --from 7 --to 8`

where
 * `7` is current bem-xjst version on your project
 * `8` is major version to migrate.

Notice that templates in `./path-to-templates/` will be overwritten.

## Codestyle config

You can create json file with several
[options](https://github.com/benjamn/recast/blob/52a7ec3eaaa37e78436841ed8afc948033a86252/lib/options.js#L1) that have recast.

Using `config` option you can pass path to json config:

`./migration/lib/index.js --input ./path-to-templates-dir --from 4 --to 8 --config ~/my-prj/config/codestyle-config.json`

Notice: path to json config must be absolute.

See example of codestyle config `sample-config.json` in this directory.

# Static Lint

Linting works the same way as migrate except you need add `lint` option.

`cd migration/ && npm i`

`cd ../`

`./migration/lib/index.js --lint --input ./path-to-templates/ --from 0 --to 8`

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
