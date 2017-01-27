# Static linter for templates

Linting allows you see some warnings about template code in STDERR. List of checks you can find in [migration guides](https://github.com/bem/bem-xjst/wiki/Migration-guides).

`cd migration/ && npm i`

`cd ../`

`./migration/lib/index.js --lint --input ./path-to-templates/ --from 7 --to 8`

where
 * `lint` lint option (if not present script will rewrite your templates)
 * `input` path to templates (relative to current directory or absolute)
 * `7` is major version from. If you specify `0` common check will be included.
 * `8` is major to lint.

Result of linting is console warning like this:

```
BEM-XJST WARNING:
>>>> Function that returns a literal can be replaced with literal itself.
>>>> migration/tmpls/template.js:8:1
>>>> function() { return 42; }
```

# Migration tool for templates

Migration tool helps you migrate your project to next major version of bem-xjst.

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

# List of transformers (checks)

 * Array to function generator
 * Object to function generator
 * Don’t check `this.elemMods`
 * Don’t check `this.mods`
 * If function generator return simple type rewrite this function to it’s return value
 * Check for HTML entities. Warning about using UTF-8 symbols.
 * def() must return something
 * No empty mode call
 * No empty mode
 * No more `this.`.
 * Apply call to apply
 * API changed (require('bem-xjst').bemhtml)
 * `elemMatch()` to `elem()` with `match()`
 * `mods` value
 * `once()` to `def()`
 * `this.isArray()` to `Array.isArray()`
 * `xhtml: true` option for backwards capability (from 6 to 7)
 * `attrs()` to `addAttrs()`
 * `js()` to `addJs()`
 * `mix()` to `addMix()`


# Tests

`npm test`


# Migrate from old DSL BEMHTML to JS syntax

Take a look at https://github.com/bem/bem-templates-converter
