# Runtime linter

Runtime linter can be used for runtime check templates and BEMJSON. To use runtime linter you need to turn on [`runtimeLint` option](https://github.com/bem/bem-xjst/blob/master/docs/en/3-api.md#runtime-linting).

List of checks:

* boolean value in attributes (recomend to use string value)
* mods for elem
* changes or additons in `this.ctx.mods`
* class in `attrs` (recomend use `cls`)
* `data-bem` attribute in `attrs` (recomend use `js`)
* mix the same mod of elemMod (warning about useless operation)
* wrong naming (elem delimeter in block names or mod delimeter in mod name and etc)
* `mods` and `elemMods` values can’t be an Array type
