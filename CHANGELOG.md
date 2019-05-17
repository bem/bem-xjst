# BEM-XJST Changelog

# 2018-05-17 [v8.9.5](https://github.com/bem/bem-xjst/compare/v8.9.4...v8.9.5), @tadatuta

Performance optimization of `utils.isSimple`.
BEMHTML: Roll back `Set` optimization in BEMHTML.prototype.renderMix.

# 2018-05-07 [v8.9.4](https://github.com/bem/bem-xjst/compare/v8.9.3...v8.9.4), @tadatuta

Performance: optimization in BEMHTML.prototype.renderMix

# 2018-04-17 [v8.9.3](https://github.com/bem/bem-xjst/compare/v8.9.2...v8.9.3), @miripiruni

From v8.6.8 exportName [was in lower case](https://github.com/bem/bem-xjst/commit/b20bb52bfd9d73f81e13f7164c21104b7f4fdc64#diff-ee97c5091b89979aace94674818996baL32) (`bemhtml` or `bemtree`). Now this degradation fixed.

Commits:
* [[`2cbdb1635a`](https://github.com/bem/bem-xjst/commit/2cbdb1635a)] - Merge pull request #517 from bem/issue-516_export-name (Slava Oliyanchuk)


# 2018-04-16 [v8.9.2](https://github.com/bem/bem-xjst/compare/v8.9.1...v8.9.2), @miripiruni

1) New `singleQuotesInJsAttrs` option. Read [documentation](https://github.com/bem/bem-xjst/blob/master/docs/en/3-api.md#singlequotesfordataattrs-option).

2) Fixed bug with runtime lint and circular json in stack trace.

3) Documentation updated: templates will be applyed for any `attrs` field with BEM-entities.


Commits:
* [[`b314d859a3`](https://github.com/bem/bem-xjst/commit/b314d859a3)] - Merge pull request #518 from bem/singleQuotesInJsAttrs (Slava Oliyanchuk)
* [[`28a0a4ad37`](https://github.com/bem/bem-xjst/commit/28a0a4ad37)] - Merge pull request #519 from bem/issue-474__circular-json (Slava Oliyanchuk)
* [[`d520b6624b`](https://github.com/bem/bem-xjst/commit/d520b6624b)] - Merge pull request #521 from bem/issue-423__attrs-apply (Slava Oliyanchuk)
* [[`ae23db1828`](https://github.com/bem/bem-xjst/commit/ae23db1828)] - **Docs**: attrs templating hidden feature (for #423) (miripiruni)
* [[`26b3ea543c`](https://github.com/bem/bem-xjst/commit/26b3ea543c)] - Merge pull request #515 from bem/tadatuta-patch-1 (Slava Oliyanchuk)
* [[`63c31acf6c`](https://github.com/bem/bem-xjst/commit/63c31acf6c)] - Merge pull request #522 from vrozaev/prose-patch-1 (Slava Oliyanchuk)
* [[`87ca06be5f`](https://github.com/bem/bem-xjst/commit/87ca06be5f)] - соркащенный =\> сокращенный (Rozaev Viktor)
* [[`3152b1f85f`](https://github.com/bem/bem-xjst/commit/3152b1f85f)] - Runtime lint: custom stringify function (fix for #474) (miripiruni)
* [[`0c15b96ddc`](https://github.com/bem/bem-xjst/commit/0c15b96ddc)] - **BEMHTML**: singleQuotesForDataAttrs option (miripiruni)
* [[`d5c13102a1`](https://github.com/bem/bem-xjst/commit/d5c13102a1)] - Single quotes for data-attrs (sbmaxx)
* [[`d407a669d2`](https://github.com/bem/bem-xjst/commit/d407a669d2)] - fixup (miripiruni)
* [[`ed90694d97`](https://github.com/bem/bem-xjst/commit/ed90694d97)] - Update 3-api.md (Vladimir Grinenko)
* [[`e87712b141`](https://github.com/bem/bem-xjst/commit/e87712b141)] - **Docs**: Add anchor (Vladimir Grinenko)


# 2018-03-05 [v8.9.1](https://github.com/bem/bem-xjst/compare/v8.9.0...v8.9.1), @miripiruni

Bug fixed: dot-delimited dependencies from global scope in object notation.

Example:

```js
var bundle = bemhtml.generate('', { requires: { i18n: { globals: 'BEM.I18N' } } });
```

Notation with dot (`BEM.I18N`) did not work from v8.6.7 to v8.9.0. Now this bug fixed.

Commits:
* [[`fc7b19fc4f`](https://github.com/bem/bem-xjst/commit/fc7b19fc4f)] - Merge pull request #501 from dustyo-O/global-dot-delimited-deps (Slava Oliyanchuk)

# 2018-02-20 [v8.9.0](https://github.com/bem/bem-xjst/compare/v8.8.8...v8.9.0), @miripiruni

Brand new object-like shortcut syntax. See docs for examples.


# 2018-02-12 [v8.8.8](https://github.com/bem/bem-xjst/compare/v8.8.7...v8.8.8), @miripiruni

Module require resolving refactor. See
[docs](https://github.com/bem/bem-xjst/blob/v8.8.8/docs/en/3-api.md#using-thirdparty-libraries).

In other case, if you specify multiple modular systems, template will attempt to
get it from them in this order:

1. Global
2. CommonJS
2. YModules (if available)

If required module was found on some step, next steps will be ignored and template will use that first retrieved module.

Thus, if module available in global variable, its value will be provided inside template, in spite of module avialability in CommonJS/YModules.

Same way, CommonJS module is more prior to YModules one.

Commits:
* [[`4b1b87c427`](https://github.com/bem/bem-xjst/commit/4b1b87c427f7d0ad5ca143717030d4c94ba78845)] - Module require resolving refactor (#493)

# 2018-02-05 [v8.8.7](https://github.com/bem/bem-xjst/compare/v8.8.6...v8.8.7), @miripiruni

Dependency enb/enb-source-map updated to v1.12.0.

Commits:
* [[`2ac8eb7339`](https://github.com/bem/bem-xjst/commit/2ac8eb7339)] - **Deps**: enb/enb-source-map 1.12.0 (miripiruni)


# 2018-02-01 [v8.8.6](https://github.com/bem/bem-xjst/compare/v8.8.5...v8.8.6), @miripiruni

* Don't output `i-bem` html class if `cls()` and `bem:false` (issue #499)
* Documentation: minor codestyle issues fixed


# 2017-11-18 [v8.8.5](https://github.com/bem/bem-xjst/compare/v8.8.4...v8.8.5), @miripiruni

Previous source maps support fixed.

Commits:
* [[`ba102b752a`](https://github.com/bem/bem-xjst/commit/ba102b752a)] - Merge pull request #488 from bem/issue-487_apply (Slava Oliyanchuk)
* [[`e3d1bddc5f`](https://github.com/bem/bem-xjst/commit/e3d1bddc5f)] - **Tests**: apply() should lookup field from bemjson by default (miripiruni)
* [[`e7b7d13a7c`](https://github.com/bem/bem-xjst/commit/e7b7d13a7c)] - **Docs**: apply mode without templates (fix for #487) (miripiruni)
* [[`0f01a86f0e`](https://github.com/bem/bem-xjst/commit/0f01a86f0e)] - тся/ться (DoctorDee)

# 2017-10-24 [v8.8.4](https://github.com/bem/bem-xjst/compare/v8.8.3...v8.8.4), @miripiruni

Fixed #484 Wrap should save BEMContext.

Commits:
* [[`309a9d1d37`](https://github.com/bem/bem-xjst/commit/309a9d1d37)] - Merge pull request #485 from bem/issue-484__wrap-bug (Slava Oliyanchuk)
* [[`070701f3ad`](https://github.com/bem/bem-xjst/commit/070701f3ad)] - **bem-xjst**: Wrap should save BEMContext (miripiruni)


# 2017-10-13 [v8.8.3](https://github.com/bem/bem-xjst/compare/v8.8.2...v8.8.3), @miripiruni

Patch version for several fixes in `generate()` method.

Commits:
* [[`2eb33ddeec`](https://github.com/bem/bem-xjst/commit/2eb33ddeec)] - **Compiler**: several require fixes (#481) (dustyo-O)
* [[`739ba5aa06`](https://github.com/bem/bem-xjst/commit/739ba5aa06)] - Merge pull request #483 from innabelaya/master (Slava Oliyanchuk)
* [[`fa096983bb`](https://github.com/bem/bem-xjst/commit/fa096983bb)] - fix typo (Inna Belaya)

# 2017-09-26 [v8.8.2](https://github.com/bem/bem-xjst/compare/v8.8.1...v8.8.2), @miripiruni

Fix: generate() exports to commonJS

Commits:
* [[`45cff63b77`](https://github.com/bem/bem-xjst/commit/45cff63b77)] - **compiler**: use exp var instead of global to export (Alexandr Shleyko)
* [[`d459327fe1`](https://github.com/bem/bem-xjst/commit/d459327fe1)] - **Examples**: source maps in Node.js (miripiruni)

# 2017-09-26 [v8.8.1](https://github.com/bem/bem-xjst/compare/v8.8.0...v8.8.1), @miripiruni

Custom naming improved: `mods` can be an object `{ name: '...', val: '...' }`. Backward capability is supported.

Commits:
* [[`85a5f41570`](https://github.com/bem/bem-xjst/commit/85a5f41570)] - Merge pull request #470 from bem/issue-469__mod-val-setting (Slava Oliyanchuk)
* [[`8e4a9e3459`](https://github.com/bem/bem-xjst/commit/8e4a9e3459)] - **Docs**: fix argument name (miripiruni)


# 2017-09-26 [v8.8.0](https://github.com/bem/bem-xjst/compare/v8.7.1...v8.8.0), @miripiruni

When you use `production` option with `true` value you can define function for custom error logging. This function will be used instead of regular `console.error`. Custom function will be filled with two arguments:

1) Object with block, element and modifiers fields where error occurred.
2) Original JS error.

You can define custom `onError` function by extending prototype of `BEMContext`. For example:

```js
var bemxjst = require('bem-xjst');
var templates = bemxjst.bemhtml.compile('', { production: true });

templates.BEMContext.prototype.onError = function(context, err) { … };
```


Commits:
* [[`3d818a7548`](https://github.com/bem/bem-xjst/commit/3d818a7548)] - **BEMXJST**: API for custom error logger (fix for #475) (miripiruni)
* [[`3ad1d8b513`](https://github.com/bem/bem-xjst/commit/3ad1d8b513)] - **Trivial**: test for applyNext changes in this.ctx (miripiruni)
* [[`738ee7a71c`](https://github.com/bem/bem-xjst/commit/738ee7a71c)] - Fix username in the example (baymer)

# 2017-07-18 [v8.7.1](https://github.com/bem/bem-xjst/compare/v8.7.0...v8.7.1), @miripiruni

Nested mixes are supported. This functionality has been worked in v1.x but then somehow was broken. Now you can use it again.

```js
{ block: 'b', mix: { block: 'c', mix: { block: 'nested-mix', js: true } } }
```

Will be rendered as:

```html
<div class="b c nexted-mix i-bem"></div>
```

BEMHTML: OL and UL end tags is not optional according to [W3C HTML4 spec](https://www.w3.org/TR/html4/index/elements.html).

Commits:
* [[`a2c71800c6`](https://github.com/bem/bem-xjst/commit/a2c71800c6)] - Merge pull request #473 from bem/issue-472 (Slava Oliyanchuk)
* [[`3e777b797a`](https://github.com/bem/bem-xjst/commit/3e777b797a)] - Remove ul and ol from list of optional tags, they are NOT optional (Vitaly Harisov)
* [[`58916ebf05`](https://github.com/bem/bem-xjst/commit/58916ebf05)] - Merge pull request #471 from gulalex181/prose-patch-1 (Slava Oliyanchuk)
* [[`04374187b6`](https://github.com/bem/bem-xjst/commit/04374187b6)] - Пропущен предлог в "описано *в* разделе про режимы" (Alexander Gulnyashkin)
* [[`1641c5b45c`](https://github.com/bem/bem-xjst/commit/1641c5b45c)] - Merge pull request #448 from bem/issue-241__nested-mixes-2 (Slava Oliyanchuk)


# 2017-07-18 [v8.7.0](https://github.com/bem/bem-xjst/compare/v8.6.13...v8.7.0), @miripiruni

* [Source map support added](https://github.com/bem/bem-xjst/blob/master/docs/en/3-api.md#source-maps).
* Runtime line check: mods can’t be Array typed.

Commits:
* [[`83acd1491d`](https://github.com/bem/bem-xjst/commit/83acd1491d)] - Merge pull request #454 from bem/issue-108__source-maps (Slava Oliyanchuk)
* [[`9167586c17`](https://github.com/bem/bem-xjst/commit/9167586c17)] - Source map support (issue #108) (miripiruni)
* [[`f01daa92a1`](https://github.com/bem/bem-xjst/commit/f01daa92a1)] - Merge pull request #462 from bem/issue-420__runtime-lint-mods-value (Slava Oliyanchuk)


# 2017-07-13 [v8.6.13](https://github.com/bem/bem-xjst/compare/v8.6.12...v8.6.13), @miripiruni

`generate()` method fixed: CommonJS variant should not affect global.

Commits:
* [[`64f1fef2b6`](https://github.com/bem/bem-xjst/commit/64f1fef2b6)] - Merge pull request #457 from bem/qfox.generate-commonjs-module (Slava Oliyanchuk)
* [[`f12b428185`](https://github.com/bem/bem-xjst/commit/f12b428185)] - Merge pull request #463 from bem/greenkeeper-uglify-js-3.0.14 (Slava Oliyanchuk)


# 2017-06-07 [v8.6.12](https://github.com/bem/bem-xjst/compare/v8.6.11...v8.6.12), @miripiruni

Dependency updated: vow and uglify-js.

Commits:
* [[`908c67d5ef`](https://github.com/bem/bem-xjst/commit/908c67d5ef)] - **Migration**: js() to addJs() tests added (miripiruni)
* [[`f869eff854`](https://github.com/bem/bem-xjst/commit/f869eff854)] - Merge pull request #453 from bem/issue-449__bench-for-8x (Slava Oliyanchuk)
* [[`88ea1bf670`](https://github.com/bem/bem-xjst/commit/88ea1bf670)] - Merge pull request #456 from bem/greenkeeper-vow-0.4.16 (Slava Oliyanchuk)
* [[`f70449d2a5`](https://github.com/bem/bem-xjst/commit/f70449d2a5)] - chore(package): update vow to version 0.4.16 (greenkeeperio-bot)
* [[`887c452615`](https://github.com/bem/bem-xjst/commit/887c452615)] - **Bench**: support v8.x (Fix #449) (miripiruni)
* [[`b832e39287`](https://github.com/bem/bem-xjst/commit/b832e39287)] - Merge pull request #440 from bem/translation-review (Slava Oliyanchuk)
* [[`745b2ffeb8`](https://github.com/bem/bem-xjst/commit/745b2ffeb8)] - fix syntax (Sergei Bocharov)
* [[`a2d25efb5a`](https://github.com/bem/bem-xjst/commit/a2d25efb5a)] - Merge pull request #447 from bem/greenkeeper-uglify-js-3.0.3 (Slava Oliyanchuk)
* [[`bad85fc45b`](https://github.com/bem/bem-xjst/commit/bad85fc45b)] - chore(package): update uglify-js to version 3.0.3 (greenkeeperio-bot)


# 2017-04-28 [v8.6.11](https://github.com/bem/bem-xjst/compare/v8.6.10...v8.6.11), @miripiruni

Fixed bug: now BEMXJST exec new oninit functions on every compile (see issue #356).

Commits:
* [[`4d164a5f56`](https://github.com/bem/bem-xjst/commit/4d164a5f56)] - Merge pull request #437 from bem/issue-356__oninit (Slava Oliyanchuk)


# 2017-04-28 [v8.6.10](https://github.com/bem/bem-xjst/compare/v8.6.9...v8.6.10), @miripiruni

Memory lick fixed. See https://github.com/bem/bem-xjst/issues/433

This release is port of v4.4.2

Commits:
* [[`876b5cbfd6`](https://github.com/bem/bem-xjst/commit/876b5cbfd6)] - **Match**: Fixed this.restoreDepth call possibly (issue #433) (miripiruni)


# 2017-04-28 [v8.6.9](https://github.com/bem/bem-xjst/compare/v8.6.8...v8.6.9), @miripiruni

Fixed several bugs:
1. wrong depth calculation (see issue #439)
2. Absent i-bem when mix elem with js (issue #441)
3. ApplyCtx and wrong position value (issue #202)

Commits:
* [[`da1e3aa691`](https://github.com/bem/bem-xjst/commit/da1e3aa691)] - **BEMXJST**: run() should revert depth (fix #439) (miripiruni)
* [[`a23e36c1cc`](https://github.com/bem/bem-xjst/commit/a23e36c1cc)] - mocha watch npm command (miripiruni)
* [[`808469f270`](https://github.com/bem/bem-xjst/commit/808469f270)] - **BEMHTML**: fix render i-bem when mix elem with js (fix #441) (miripiruni)
* [[`8afc3109a3`](https://github.com/bem/bem-xjst/commit/8afc3109a3)] - **Compiler**: exportName option (fix for #397) (miripiruni)
* [[`578c89a204`](https://github.com/bem/bem-xjst/commit/578c89a204)] - **BEMXJST**: applyCtx should reset position (miripiruni)


# 2017-04-28 [v8.6.8](https://github.com/bem/bem-xjst/compare/v8.6.7...v8.6.8), @miripiruni

BEMTREE and BEMHTML allows you using thirdparty libraries as well as a global dependencies and YModules, CommonJS modules and global depsendencies.
See [docs](https://github.com/bem/bem-xjst/blob/master/docs/en/3-api.md#using-thirdparty-libraries) for more information.

Commits:
* [[`45d841594b`](https://github.com/bem/bem-xjst/commit/45d841594b)] - Merge pull request #424 from bem/issue-375__modules (Slava Oliyanchuk)


# 2017-03-19 [v8.6.7](https://github.com/bem/bem-xjst/compare/v8.6.6...v8.6.7), @miripiruni

Technical release. Rollback commit: https://github.com/bem/bem-xjst/pull/429/files

Commits:
* [[`4b09e72281`](https://github.com/bem/bem-xjst/commit/4b09e72281)] - Merge pull request #429 from bem/rollback-recompileInput (Slava Oliyanchuk)
* [[`20236743ce`](https://github.com/bem/bem-xjst/commit/20236743ce)] - Rollback function reuse in recompileInput (Vladimir Grinenko)

# 2017-03-17 [v8.6.6](https://github.com/bem/bem-xjst/compare/v8.6.5...v8.6.6), @miripiruni

`oninit` fixed. It was broken after bundle minification (v8.6.1)

Comment:
* [[`5fc91cbf49`](https://github.com/bem/bem-xjst/commit/5fc91cbf49)] - **BEMXJST**: revert exportApply optimization (miripiruni)

# 2017-03-16 [v8.6.5](https://github.com/bem/bem-xjst/compare/v8.6.4...v8.6.5), @miripiruni

Fixed bug with `unquotedAttrs: true` option: BEMHTML should escape attributes.

Commits:
* [[`fa054d71a2d`](https://github.com/bem/bem-xjst/commit/fa054d71a2dc6365484f15e53e045dbdbcd2ec1a)] - **BEMHTML**: unquotedAttrs should escape attributes (miripiruni)

# 2017-03-15 [v8.6.4](https://github.com/bem/bem-xjst/compare/v8.6.3...v8.6.4), @miripiruni

Commits:
* [[`96bcd16fcc`](https://github.com/bem/bem-xjst/commit/96bcd16fcc)] - Merge pull request #426 from bem/do-not-require-in-runtime (Slava Oliyanchuk)
* [[`d6323faa7c`](https://github.com/bem/bem-xjst/commit/d6323faa7c)] - Compiler .generate(): do not require in runtime (miripiruni)

# 2017-02-27 [v8.6.3](https://github.com/bem/bem-xjst/compare/v8.6.2...v8.6.3), @miripiruni

Fixed bug with function template body and appendContent()/prependContent(). See issue #422.

Commits:
* [[`92ba4570eb`](https://github.com/bem/bem-xjst/commit/92ba4570eb)] - Merge pull request #425 from bem/issue-422__append-prepend-bug (Slava Oliyanchuk)
* [[`79602b94f6`](https://github.com/bem/bem-xjst/commit/79602b94f6)] - **TREE**: fixed issue #422 append/prepend content with function body (miripiruni)
* [[`4adfc677b0`](https://github.com/bem/bem-xjst/commit/4adfc677b0)] - **Trivial**: node 7 in Travis (miripiruni)

# 2017-02-27 [v8.6.2](https://github.com/bem/bem-xjst/compare/v8.6.1...v8.6.2), @miripiruni

Fixed bug with `match()` without argument. See issue [#418](https://github.com/bem/bem-xjst/issues/418).

Commits:
* [[`d6187fb28a`](https://github.com/bem/bem-xjst/commit/d6187fb28a)] - **TRIVIAL**: remove gziped artifacts after size test (miripiruni)
* [[`0b5cb61800`](https://github.com/bem/bem-xjst/commit/0b5cb61800)] - Merge pull request #419 from bem/issue-418__match-argument (Slava Oliyanchuk)
* [[`a834c30ddd`](https://github.com/bem/bem-xjst/commit/a834c30ddd)] - **TREE**: Match must have an argument (#418 fixed) (miripiruni)

# 2017-02-17 [v8.6.1](https://github.com/bem/bem-xjst/compare/v8.6.0...v8.6.1), @miripiruni

1. CI check: BEMHML and BEMTREE bundle size after gzip. Now you can see it in Travis log.
2. Bundle size reduced (–6%).
3. Now bem-xjst in Node.js used without bundling via browserify.
4. BEMHTML.renderMix fixed.
5. Coverage increased to 100%.

Commits:
* [[`91b5abea50`](https://github.com/bem/bem-xjst/commit/91b5abea50)] - **BEMXJST**: allow apply() inside match() (fix for #309) (miripiruni)
* [[`4eabbfe5a8`](https://github.com/bem/bem-xjst/commit/4eabbfe5a8)] - **BEMXJST**: smaller runUnescaped (miripiruni)
* [[`155fc64253`](https://github.com/bem/bem-xjst/commit/155fc64253)] - **ClassBuilder**: buildElemClass always used with modVal (miripiruni)
* [[`06310a7b1d`](https://github.com/bem/bem-xjst/commit/06310a7b1d)] - More optimizations (miripiruni)
* [[`8e6f1395a4`](https://github.com/bem/bem-xjst/commit/8e6f1395a4)] - **BEMHTML**: _shortTagCloser definition fix (miripiruni)
* [[`feeb97192f`](https://github.com/bem/bem-xjst/commit/feeb97192f)] - **BEMXJST**: localBody fn compress; sharedContext compress (miripiruni)
* [[`fb2b63f09d`](https://github.com/bem/bem-xjst/commit/fb2b63f09d)] - **CI**: bundle size after uglifyjs (miripiruni)
* [[`b1e459fa17`](https://github.com/bem/bem-xjst/commit/b1e459fa17)] - **BEMHTML**: get rid of unused variable and curly brackets (miripiruni)
* [[`3af967b7bf`](https://github.com/bem/bem-xjst/commit/3af967b7bf)] - **BEMHTML**: inline renderNoTag function (miripiruni)
* [[`26361d748b`](https://github.com/bem/bem-xjst/commit/26361d748b)] - **Context**: Remove unused _onceRef (miripiruni)
* [[`fc5b329ac4`](https://github.com/bem/bem-xjst/commit/fc5b329ac4)] - More squeeze (miripiruni)
* [[`43a3cb71fd`](https://github.com/bem/bem-xjst/commit/43a3cb71fd)] - Compact utils.fnToString (miripiruni)
* [[`a044604aba`](https://github.com/bem/bem-xjst/commit/a044604aba)] - Compact defaultBody function (miripiruni)
* [[`7e49f78cad`](https://github.com/bem/bem-xjst/commit/7e49f78cad)] - Drop all optional function names (miripiruni)
* [[`9ea4fa86ab`](https://github.com/bem/bem-xjst/commit/9ea4fa86ab)] - ***Revert*** "Error.captureStackTrace for IE" (miripiruni)
* [[`ee703d61b3`](https://github.com/bem/bem-xjst/commit/ee703d61b3)] - More compress (miripiruni)
* [[`529252328f`](https://github.com/bem/bem-xjst/commit/529252328f)] - **Tree**: minify method definition (miripiruni)
* [[`40ca41d26c`](https://github.com/bem/bem-xjst/commit/40ca41d26c)] - **Tests**: case with any subpredicates order (miripiruni)
* [[`0da1f697de`](https://github.com/bem/bem-xjst/commit/0da1f697de)] - Istanbul ignore else (miripiruni)
* [[`6b91a4b1ba`](https://github.com/bem/bem-xjst/commit/6b91a4b1ba)] - **ExtendMatch**: removed unnecessary local call (miripiruni)
* [[`ad9b2b7814`](https://github.com/bem/bem-xjst/commit/ad9b2b7814)] - More tests (miripiruni)
* [[`a24357a0e9`](https://github.com/bem/bem-xjst/commit/a24357a0e9)] - **BEMHTML**: renderMix fixed (miripiruni)
* [[`687969fb14`](https://github.com/bem/bem-xjst/commit/687969fb14)] - Use bem-xjst in Node.js without bundling via browserify (#407 and #408 fixed) (Slava Oliyanchuk)

# 2017-01-27 [v8.6.0](https://github.com/bem/bem-xjst/compare/v8.5.2...v8.6.0), @miripiruni

Migration tool and Static linter introduced. See [readme](https://github.com/bem/bem-xjst/blob/master/migration/README.md).

Commits:
* [[`4ed06f1b84`](https://github.com/bem/bem-xjst/commit/4ed06f1b84)] - More tests (#405) (Slava Oliyanchuk)
* [[`cebda10963`](https://github.com/bem/bem-xjst/commit/cebda10963)] - migrate bin removed (miripiruni)
* [[`b9fd0c43ae`](https://github.com/bem/bem-xjst/commit/b9fd0c43ae)] - Line in lint report added (Slava Oliyanchuk)
* [[`4c7b5ff259`](https://github.com/bem/bem-xjst/commit/4c7b5ff259)] - Link to migration readme fixed (Slava Oliyanchuk)
* [[`97a6fe54c6`](https://github.com/bem/bem-xjst/commit/97a6fe54c6)] - Link to migration readme fixed (Slava Oliyanchuk)
* [[`0b3b876b95`](https://github.com/bem/bem-xjst/commit/0b3b876b95)] - Static analyzer: migration and lint tool (fix for #49 and #353) (Slava Oliyanchuk)
* [[`edac12fa4b`](https://github.com/bem/bem-xjst/commit/edac12fa4b)] - Link to option (Slava Oliyanchuk)
* [[`960c604862`](https://github.com/bem/bem-xjst/commit/960c604862)] - Runtime lint readme (Slava Oliyanchuk)
* [[`a4146c1c94`](https://github.com/bem/bem-xjst/commit/a4146c1c94)] - **Deps**: Throw away minimalistic-assert dependency (#398) (Slava Oliyanchuk)

# 2017-01-10 [v8.5.2](https://github.com/bem/bem-xjst/compare/v8.5.1...v8.5.2), @miripiruni

This release is port of v7.6.4.

Fixed bug in BEMTREE: special html field render as it’s value.

Example of BEMJSON: `{ block: 'b1', content: { html: '<br>' } }`

Render result with v7.6.2 (before fix): `{ block: 'b1', content: '<br>' }`.
Render result with v7.6.3 (after fix): `{ block: 'b1', content: { html: '<br>' } }`.

Commits:
* [[`f955d4080e`](https://github.com/bem/bem-xjst/commit/f955d4080e)] - **BEMTREE**: special unescaped html field from BEMJSON should render as is (miripiruni)

# 2016-12-12 [v8.5.1](https://github.com/bem/bem-xjst/compare/v8.5.0...v8.5.1), @miripiruni

Fixed bug: calculate position if block/elem was replaced via `replace()`. See [issue #394](https://github.com/bem/bem-xjst/issues/394).

Commits:
* [[`71cca07f04`](https://github.com/bem/bem-xjst/commit/71cca07f04)] - Merge pull request #395 from bem/replace-position__issue-394 (Slava Oliyanchuk)
* [[`b32094e75f`](https://github.com/bem/bem-xjst/commit/b32094e75f)] - **Test**: position with appendContent()/prependContent() (miripiruni)
* [[`eaa2728082`](https://github.com/bem/bem-xjst/commit/eaa2728082)] - **BEMHTML**: fix position with replace() (#394 fixed) (miripiruni)

# 2016-12-08 [v8.5.0](https://github.com/bem/bem-xjst/compare/v8.4.2...v8.5.0), @miripiruni

BEMTREE: added modes related to data: js(), addJs(), mix(), addMix(), mods(), addElemMods(), elemMods().

Commits:
* [[`a70d794d15`](https://github.com/bem/bem-xjst/commit/a70d794d15)] - Merge pull request #382 from bem/bemtree-modes__issue-362 (Slava Oliyanchuk)
* [[`70cfeb51c6`](https://github.com/bem/bem-xjst/commit/70cfeb51c6)] - **BEMTREE**: js(), mix(), mods(), elemMods() added (miripiruni)

# 2016-12-08 [v8.4.2](https://github.com/bem/bem-xjst/compare/v8.4.1...v8.4.2), @miripiruni

Escaping functions fixed: now argumengs `undefined` or `null` and `NaN` will give you empty string as a result. In previous versions you get stringified results (`'undefined'`, `'null'`, `'NaN'`).

Commits:
* [[`fb127451ed`](https://github.com/bem/bem-xjst/commit/fb127451ed)] - Merge pull request #387 from bem/yeti-or.notEscapeFalsy (Slava Oliyanchuk)
* [[`ae3ecc5e6e`](https://github.com/bem/bem-xjst/commit/ae3ecc5e6e)] - **Docs**: notes about arg types in escaping functions (miripiruni)
* [[`f68c0a7555`](https://github.com/bem/bem-xjst/commit/f68c0a7555)] - **Docs**: links fixed, some spellings fixed (Slava Oliyanchuk)
* [[`60ca7146b9`](https://github.com/bem/bem-xjst/commit/60ca7146b9)] - **Docs**: minor changes (links, spelling, etc) (Slava Oliyanchuk)
* [[`1977ee83da`](https://github.com/bem/bem-xjst/commit/1977ee83da)] - **Utils**: escaping function should’t render undefined/Null/NaN (Vasiliy Loginevskiy)
* [[`d44db0ad2c`](https://github.com/bem/bem-xjst/commit/d44db0ad2c)] - **Docs**: headers fixed (Slava Oliyanchuk)
* [[`e88732a7af`](https://github.com/bem/bem-xjst/commit/e88732a7af)] - **Docs**: headers fixed (Slava Oliyanchuk)
* [[`f8610fb928`](https://github.com/bem/bem-xjst/commit/f8610fb928)] - **Docs**: about js (Slava Oliyanchuk)
* [[`f3660f8a47`](https://github.com/bem/bem-xjst/commit/f3660f8a47)] - **Docs**: example cut (Slava Oliyanchuk)
* [[`54a3e7d447`](https://github.com/bem/bem-xjst/commit/54a3e7d447)] - **Docs**: fix spelling (Slava Oliyanchuk)
* [[`11e3079ab9`](https://github.com/bem/bem-xjst/commit/11e3079ab9)] - **Docs**: readme updated (#390 fixed) (miripiruni)
* [[`79b3e4e125`](https://github.com/bem/bem-xjst/commit/79b3e4e125)] - Bundle size metrica (Fix for #366) (miripiruni)

# 2016-11-28 [v8.4.1](https://github.com/bem/bem-xjst/compare/v8.4.0...v8.4.1), @miripiruni

Fix: `extend(function(ctx, json) { … })` mode callback now have two arguments. The same as `match()` and other.

Commits:
* [[`6a0ea778cf`](https://github.com/bem/bem-xjst/commit/6a0ea778cf)] - Merge pull request #386 from bem/issues/385 (Slava Oliyanchuk)
* [[`21e5716819`](https://github.com/bem/bem-xjst/commit/21e5716819)] - Provide arguments for extend() mode (Vladimir Grinenko)

# 2016-11-28 [v8.4.0](https://github.com/bem/bem-xjst/compare/v8.3.1...v8.4.0), @miripiruni

New option `unquotedAttrs`. See [docs](https://github.com/bem/bem-xjst/blob/master/docs/en/3-api.md#unquoted-attributes).

Commits:
* [[`53f8444bca`](https://github.com/bem/bem-xjst/commit/53f8444bca)] - **BEMHTML**: support unquoted attributes (fix for #364) (miripiruni)
* [[`52609624a1`](https://github.com/bem/bem-xjst/commit/52609624a1)] - Help wanted added (Slava Oliyanchuk)
* [[`85512601d9`](https://github.com/bem/bem-xjst/commit/85512601d9)] - **Docs**: write about template arguments and arrow function (fix for #367) (miripiruni)
* [[`7efbc32ba0`](https://github.com/bem/bem-xjst/commit/7efbc32ba0)] - **Docs**: def() parameter in JSDoc changed (Slava Oliyanchuk)

# 2016-10-20 [v8.3.1](https://github.com/bem/bem-xjst/compare/v8.3.0...v8.3.1), @miripiruni

`extend()` mode fixed. Read [documentation](https://github.com/bem/bem-xjst/blob/master/docs/en/5-templates-syntax.md#extend).

In documentation:

* description about `this.extend(o1, o2)` added
* spelling fixed
* description about production mode added

Commits:
* [[`19c4789a05`](https://github.com/bem/bem-xjst/commit/19c4789a05)] - **Docs**: describe this.extend() fix for #355 (miripiruni)
* [[`ff8ca15360`](https://github.com/bem/bem-xjst/commit/ff8ca15360)] - Merge pull request #363 from bem/issue-180__extend (Slava Oliyanchuk)
* [[`ab9d3cae90`](https://github.com/bem/bem-xjst/commit/ab9d3cae90)] - **BEMXJST**: extend() mode fix #180 (miripiruni)
* [[`4263533c70`](https://github.com/bem/bem-xjst/commit/4263533c70)] - **docs**: Fix type (Vladimir Grinenko)
* [[`3f3169e87d`](https://github.com/bem/bem-xjst/commit/3f3169e87d)] - **Docs**: production mode (miripiruni)
* [[`6ad3d5c154`](https://github.com/bem/bem-xjst/commit/6ad3d5c154)] - **Bench**: bemjson files is not required (miripiruni)
* [[`efa1d9a8c4`](https://github.com/bem/bem-xjst/commit/efa1d9a8c4)] - **Bench**: template for v7.x added (miripiruni)
* [[`53db045a94`](https://github.com/bem/bem-xjst/commit/53db045a94)] - changelog updated (miripiruni)

# 2016-10-10 [v8.3.0](https://github.com/bem/bem-xjst/compare/v8.2.0...v8.3.0), @miripiruni

New option `production`. When it set to `true` bem-xjst will render bemjson even if one template contains error.

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

Commits:
* [[`cb6f9dff62`](https://github.com/bem/bem-xjst/commit/cb6f9dff62)] - **BEMXJST**: production option (fix for #298) (miripiruni)

# 2016-10-06 [v8.2.0](https://github.com/bem/bem-xjst/compare/v8.1.0...v8.2.0), @miripiruni

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

Commits:
* [[`207b3733de`](https://github.com/bem/bem-xjst/commit/207b3733de)] - Merge pull request #361 from bem/issue-360__optional-closing-tags (Slava Oliyanchuk)
* [[`042dcb1385`](https://github.com/bem/bem-xjst/commit/042dcb1385)] - **BEMHTML**: Omit optional closing tags (fix for #360) (miripiruni)

# 2016-10-06 [v8.1.0](https://github.com/bem/bem-xjst/compare/v8.0.0...v8.1.0), @miripiruni

New modes: `mods()`, `elemMods()`, `addMods()`, `addElemMods()`.

#### mods

```js
/**
 * @param {function|Object} mods
 */
mods()(mods)
```

Hash for modifiers of block.

**Example**

```js
block('link').mods()({ type: 'download' });
block('link').mods()(function() { return { type: 'download' }; });
```

Value from `mods()` mode rewrite value from BEMJSON.

By default returns `this.mods`.

```js
// BEMJSON:
{ block: 'b' }

// Template:
block('b').def()(function() {
    return apply('mods');
});
```

The result is `{}`.

You can use `addMods()` mode to add modifiers. `addMods()` is shortcut of `mods()`:
```js
addMods()({ theme: 'dark' }); // This is equivalent to following:
mods()(function() {
    this.mods = this.extend(applyNext(), { theme: 'dark' });
    return this.mods;
});
```

#### elemMods

```js
/**
 * @param {function|Object} elemMods
 */
elemMods()(elemMods)
```

Hash for modifiers of element.

**Example**

```js
block('link').elemMods()({ type: 'download' });
block('link').elemMods()(function() { return { type: 'download' }; });
```

Value from `elemMods()` mode rewrite value from BEMJSON.

By default returns `this.mods`.

```js
// BEMJSON:
{ block: 'b', elem: 'e' }

// Template:
block('b').elem('e').def()(function() {
    return apply('mods');
});
```

The result is `{}`.

You can use addElemMods mode to add modifiers for element. addElemMods is
shortcut of elemMods:
```js
addElemMods()({ theme: 'dark' }); // This is equivalent to following:
elemMods()(function() {
    this.elemMods = this.extend(applyNext(), { theme: 'dark' });
    return this.elemMods;
});
```

Commits:
* [[`07417ca5a1`](https://github.com/bem/bem-xjst/commit/07417ca5a1)] - **Semantic**: introduce mods(), addMods(), elemMods(), addElemMods() (miripiruni)
* [[`6bcbaaad4d`](https://github.com/bem/bem-xjst/commit/6bcbaaad4d)] - **BEMHTML**: misc optimizations (miripiruni)

# 2016-09-23 [v8.0.0](https://github.com/bem/bem-xjst/compare/v7.3.1...v8.0.0), @miripiruni

## Changes in modes behaviour

* Now `mix()`, `js()`, `attrs()` modes will replace BEMJSON values.
* If you want extend BEMJSON value in the modes please use `applyNext()`.
* In all the modes `applyNext()` will return BEMJSON value if it exists.
* If you want add mix, js or attrs now you can use `addMix()`, `addJs()` or `addAttrs()` modes.

More about new behaviour you can [read in documentation](https://github.com/bem/bem-xjst/blob/master/docs/en/5-templates-syntax.md#description-of-standard-modes).

## `escapeContent: true` by default

If you want to mantain backward capabitity you can set `escapeContent: false` manualy.

Notice that `applyCtx(…)` and `this.reapply(…)` returns strings. It means that if result  will be escaped if contains HTML tags.

Commits:

* [[`299a72663d`](https://github.com/bem/bem-xjst/commit/299a72663d)] - **BEMHTML**: Set default value of escapeContent to true (fix for #323) (miripiruni)
* [[`de8f13c8a2`](https://github.com/bem/bem-xjst/commit/de8f13c8a2)] - Merge pull request #311 from bem/issue-261__semantic-changes-in-modes (Slava Oliyanchuk)
* [[`3de409279f`](https://github.com/bem/bem-xjst/commit/3de409279f)] - **Docs**: spelling fixed (miripiruni)
* [[`a12b3634bc`](https://github.com/bem/bem-xjst/commit/a12b3634bc)] - **BEMXJST**: Tree.methods cleanup (miripiruni)
* [[`722028a6fa`](https://github.com/bem/bem-xjst/commit/722028a6fa)] - **BEMHTML**: codestyle (miripiruni)
* [[`d3b28e0065`](https://github.com/bem/bem-xjst/commit/d3b28e0065)] - **BEMHTML**: more tests about add*() modes (miripiruni)
* [[`6ea96d2e9e`](https://github.com/bem/bem-xjst/commit/6ea96d2e9e)] - **BEMHTML**: addMix fixed (miripiruni)
* [[`88f290df7d`](https://github.com/bem/bem-xjst/commit/88f290df7d)] - **Docs**: spelling fixed (miripiruni)
* [[`76428b6b09`](https://github.com/bem/bem-xjst/commit/76428b6b09)] - **Semantic**: introduce addJs (miripiruni)
* [[`b7c89c94e4`](https://github.com/bem/bem-xjst/commit/b7c89c94e4)] - **Semantic**: introduce addAttrs (miripiruni)
* [[`2835877ced`](https://github.com/bem/bem-xjst/commit/2835877ced)] - **Semantic**: introduce addMix (miripiruni)
* [[`ffb3e36252`](https://github.com/bem/bem-xjst/commit/ffb3e36252)] - **Semantic**: change behaviour of `mix`, `js` и `attrs` modes (miripiruni)

# 2016-09-22 [v7.3.1](https://github.com/bem/bem-xjst/compare/v7.3.0...v7.3.1), @miripiruni

New runtime lint cases:
* check block, elem, modifier names and modifier values
* check if mixed entity has the same modifier

New benchmark test with histogram graph any revision compare and no dependencies.

Commits:
* [[`bd0dd65980`](https://github.com/bem/bem-xjst/commit/bd0dd65980)] - Merge pull request #352 from bem/issue-350__check-mix (Slava Oliyanchuk)
* [[`b26bdf6045`](https://github.com/bem/bem-xjst/commit/b26bdf6045)] - **Docs**: modes in BEMTREE (fix for #335) (miripiruni)
* [[`4f41cb41b7`](https://github.com/bem/bem-xjst/commit/4f41cb41b7)] - Runtime lint: check block, elem, modifier names and modifier values (miripiruni)
* [[`6daa6fe7ea`](https://github.com/bem/bem-xjst/commit/6daa6fe7ea)] - Runtime lint: check mix the same elemMods (miripiruni)
* [[`9a128aa330`](https://github.com/bem/bem-xjst/commit/9a128aa330)] - Runtime lint: check mix the same mods (miripiruni)
* [[`7c6ce3abe2`](https://github.com/bem/bem-xjst/commit/7c6ce3abe2)] - **Docs**: example improved (miripiruni)
* [[`bf385ec6d0`](https://github.com/bem/bem-xjst/commit/bf385ec6d0)] - **Bench**: port of new benchmark test from v6.x (miripiruni)

# 2016-09-21 [v7.3.0](https://github.com/bem/bem-xjst/compare/v7.2.0...v7.3.0), @miripiruni

1. Support `mod()` and `elemMod()` without second argument

```js
/**
 * @param {String} modName name of the block modifier
 * @param {String|Boolean} [modVal] value of the block modifier
 */
mod(modName, modVal)
```

If second argument of `mod()` was omited then templates with any
non-empty value of modifier will be applied.

```js
block('a').mod('size').tag()('span');
```
Template will be applied to BEMJSON node if block equals to 'a' and
'size' modifier exists (equals neither to `undefined` nor to `''` nor to `false`
nor to `null`).

```js
{ block: 'a', mods: { size: true } },
{ block: 'a', mods: { size: 's' } },
{ block: 'a', mods: { size: 0 } }
```

But templates will not be applied to entities:
```js
{ block: 'a', mods: { theme: 'dark' /* no `size` modifier */ } },
{ block: 'a', mods: {} },
{ block: 'a', mods: { size: '', } },
{ block: 'a', mods: { size: undefined } },
{ block: 'a', mods: { size: false } },
{ block: 'a', mods: { size: null } }
```

The same for `elemMod()` mode.

2. Runtime lint warning for class and data-bem attributes in attrs field in BEMJSON or `attrs()` template result.

BEMJSON:
```js
// class in attrs
{ block: 'class-attr-bemjson', attrs: { id: 'test', class: 'jquery' } },
{ block: 'class-attr-tmpl' },

// 'data-bem' in attrs
{ block: 'databem-attr-bemjson', attrs: { 'data-bem': { block: 'a', js: true } } },
{ block: 'databem-attr-tmpl' }
```

Templates:
```js
block('class-attr-tmpl').attrs()(function() {
    return { class: 'wrong' };
});

block('databem-attr-tmpl').attrs()(function() {
    return { 'data-bem': 'wrong' };
});
```

Now with such templates or such BEMJSON you will get warnings:
```js
BEM-XJST WARNING: looks like you’re trying to set HTML class from attrs field in BEMJSON. Please use cls() mode for it. See documentation: https://github.com/bem/bem-xjst/blob/master/docs/en/5-templates-syntax.md#cls
ctx: {"block":"class-attr-tmpl"}
attrs: {"class":"wrong"}

BEM-XJST WARNING: looks like you’re trying to set data-bem attribute from attrs field in BEMJSON. Please use js() mode for it. See documentation: https://github.com/bem/bem-xjst/blob/master/docs/en/5-templates-syntax.md#js
ctx: {"block":"databem-attr-bemjson","attrs":{"data-bem":{"block":"a","js":true}}}
attrs: {"data-bem":{"block":"a","js":true}}

BEM-XJST WARNING: looks like you’re trying to set data-bem attribute from attrs field in BEMJSON. Please use js() mode for it. See documentation: https://github.com/bem/bem-xjst/blob/master/docs/en/5-templates-syntax.md#js
ctx: {"block":"databem-attr-bemjson","attrs":{"data-bem":{"block":"a","js":true}}}
attrs: {"data-bem":{"block":"a","js":true}}

BEM-XJST WARNING: looks like you’re trying to set data-bem attribute from attrs field in BEMJSON. Please use js() mode for it. See documentation: https://github.com/bem/bem-xjst/blob/master/docs/en/5-templates-syntax.md#js
ctx: {"block":"databem-attr-tmpl"}
attrs: {"data-bem":"wrong"}
```

Commits:
* [[`61e555bddf`](https://github.com/bem/bem-xjst/commit/61e555bddf)] - Merge pull request #346 from bem/issue-274__mods-wildcard (Slava Oliyanchuk)
* [[`6a9625d0b9`](https://github.com/bem/bem-xjst/commit/6a9625d0b9)] - Merge pull request #349 from bem/issue-212__attrs-runtime-lint (Slava Oliyanchuk)
* [[`53dbfef63d`](https://github.com/bem/bem-xjst/commit/53dbfef63d)] - Merge pull request #347 from bem/del-mod (Slava Oliyanchuk)
* [[`5f5221f603`](https://github.com/bem/bem-xjst/commit/5f5221f603)] - Fixed #274: Support `mod(m)` and `elemMod(em)` without second argument (miripiruni)
* [[`9aacd9105b`](https://github.com/bem/bem-xjst/commit/9aacd9105b)] - Runtime lint: Warning about class or data-bem in `attrs` (miripiruni)

# 2016-09-13 [v7.2.0](https://github.com/bem/bem-xjst/compare/v7.1.0...v7.2.0), @miripiruni

By turning on `runtimeLint` option you can get warnings about wrong templates or input data.
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

  // changes in this.ctx.mods
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

Commits:
* [[`0e0486a230c`](https://github.com/bem/bem-xjst/commit/0e0486a230c007f49a96535f0cd8c3b9b050aedf)] - Runtime lint (miripiruni)


# 2016-09-09 [v7.1.0](https://github.com/bem/bem-xjst/compare/v7.0.4...v7.1.0), @miripiruni

You can use `appendContent` and `prependContent` modes to add child nodes to content.

```js
block('quote')(
    prependContent()('“'), // add some things before actual content
    appendContent()('”'), // add content to the end
    appendContent({ block: 'link' }); // add more content to the end
);
```

```js
{ block: 'quote', content: 'I came, I saw, I templated.' }
```

*Result of templating:*

```html
<div class="quote">“I came, I saw, I templated.”<div class="link"></div></div>
```

`appendContent()` and `prependContent()` is a shortcuts to `content()` + `applyNext()`:

```js
// appendContent() is the same as:
content()(function() {
    return [
        applyNext(),
        'additional content'
    ];
});

// prependContent() is the same as:
content()(function() {
    return [
        'additional content',
        applyNext()
    ];
});
```

Commits:
* [[`b59973d5b2`](https://github.com/bem/bem-xjst/commit/b59973d5b2)] - Merge pull request #337 from bem/content-mods (Slava Oliyanchuk)
* [[`bfc4e09c0c`](https://github.com/bem/bem-xjst/commit/bfc4e09c0c)] - **Tests**: identify test is slow on Travis. Accuracy changed. (miripiruni)

# 2016-09-09 [v7.0.4](https://github.com/bem/bem-xjst/compare/v7.0.3...v7.0.4), @miripiruni

Functions `this.xmlEscape()`, `this.attrEscape()` and `this.jsAttrEscape()` optimized. See [PR #328](https://github.com/bem/bem-xjst/pull/328#issuecomment-245779443).

Commits:
* [[`fb9b96ec6a`](https://github.com/bem/bem-xjst/commit/fb9b96ec6a)] - Merge pull request #328 from bem/faster-escaping (Slava Oliyanchuk)
* [[`3e80b00c1f`](https://github.com/bem/bem-xjst/commit/3e80b00c1f)] - **Utils**: faster escaping functions (see issue #327) (miripiruni)
* [[`d53646f2c3`](https://github.com/bem/bem-xjst/commit/d53646f2c3)] - Merge pull request #330 from bem/greenkeeper-mocha-3.0.2 (Slava Oliyanchuk)
* [[`5c1d93eea4`](https://github.com/bem/bem-xjst/commit/5c1d93eea4)] - chore(package): update mocha to version 3.0.2 (greenkeeperio-bot)
* [[`442aaecffa`](https://github.com/bem/bem-xjst/commit/442aaecffa)] - Merge pull request #325 from bem/coverage-badge (Slava Oliyanchuk)
* [[`0636def423`](https://github.com/bem/bem-xjst/commit/0636def423)] - **Match**: unused code removed (miripiruni)
* [[`36860b9421`](https://github.com/bem/bem-xjst/commit/36860b9421)] - **Deps**: ^ added (miripiruni)
* [[`0a031dbfa8`](https://github.com/bem/bem-xjst/commit/0a031dbfa8)] - **Coverage**: move _compile method to fixtures.js (miripiruni)
* [[`15fcf1a60c`](https://github.com/bem/bem-xjst/commit/15fcf1a60c)] - **Coverage**: more (miripiruni)
* [[`9294f767f1`](https://github.com/bem/bem-xjst/commit/9294f767f1)] - **Coverage**: this.identify (miripiruni)
* [[`371e94b16a`](https://github.com/bem/bem-xjst/commit/371e94b16a)] - Coverage bundles with source maps (miripiruni)
* [[`f68ecd8a55`](https://github.com/bem/bem-xjst/commit/f68ecd8a55)] - Istanbul test coverage (miripiruni)
* [[`faac9c5bb0`](https://github.com/bem/bem-xjst/commit/faac9c5bb0)] - **Bench**: support bem-xjst 7.x (miripiruni)

# 2016-07-29 [v7.0.3](https://github.com/bem/bem-xjst/compare/v7.0.2...v7.0.3), @miripiruni

Fixed bug with `{ html: '' }`. In 7.0.2 result is `[object Object]`. In 7.0.3: `''`.

Commits:
* [[`bc28643520`](https://github.com/bem/bem-xjst/commit/bc28643520)] - **BEMXJST**: work with empty string in html field (miripiruni)
* [[`5bd2476ae5`](https://github.com/bem/bem-xjst/commit/5bd2476ae5)] - **Docs**: variable name fixed (miripiruni)

# 2016-07-15, [v7.0.2](https://github.com/bem/bem-xjst/compare/v7.0.1...v7.0.2), @miripiruni

Fixed case with `html` and `tag` fields.

```js
{
    tag: false,
    html: '<script>console.log("hello html");</script>'
}
```

Result with v7.0.1:

```html
[object Object]
```

Result with v7.0.2:

```html
<script>console.log("hello html");</script>
```

Commits:
* [[`184a659371`](https://github.com/bem/bem-xjst/commit/184a659371)] - BEMHTML: should properly render unescaped html field if `tag:false` present (fix for #312)
* [[`21bc431a6c`](https://github.com/bem/bem-xjst/commit/21bc431a6c)] - Merge pull request #295 from bem/renderClose (Slava Oliyanchuk)
* [[`6362bd9d54`](https://github.com/bem/bem-xjst/commit/6362bd9d54)] - v7.0.0 is deprecated (Slava Oliyanchuk)
* [[`4c54ada780`](https://github.com/bem/bem-xjst/commit/4c54ada780)] - Merge pull request #288 from vithar/docs-anchors (Slava Oliyanchuk)

# 2016-07-07, [v7.0.1](https://github.com/bem/bem-xjst/compare/v7.0.0...v7.0.1), @miripiruni

Fixed issue with undefined nested mix.

v7.0.0 marked as deprecated because of #303.

Commits:
* [[`3b9c4220c6`](https://github.com/bem/bem-xjst/commit/3b9c4220c6)] - **BEMHTML**: Fix for #303 undefined nested mix (miripiruni)

# 2016-06-27, [v7.0.0](https://github.com/bem/bem-xjst/compare/v6.5.2...v7.0.0), @miripiruni

Hooray! Next major version is here!

Breaking changes:
1. No more `this.isArray()`. Use `Array.isArray()` instead.
2. No more `once()` mode. You dont need it at all.
3. Now `xhtml` option default value is `false`. But you can set it to `true` manualy.
4. `modVal` and `elemModVal` cast to String before checking to match. See docs for examples.

Commits:

* [[`97574f5282`](https://github.com/bem/bem-xjst/commit/97574f5282)] - **BEMHTML**: #214 Inverse xhtml option default value to false (miripiruni)
* [[`caad627dce`](https://github.com/bem/bem-xjst/commit/caad627dce)] - Fix #213: Throw away this.isArray() (miripiruni)
* [[`26d0725c39`](https://github.com/bem/bem-xjst/commit/26d0725c39)] - Fix #213: Throw away once() (miripiruni)
* [[`079a5c89b2`](https://github.com/bem/bem-xjst/commit/079a5c89b2)] - Merge pull request #266 from bem/issue-220__mod-types (Slava Oliyanchuk)

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

Now bem-xjst trim and escape cls.

**Example**

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

**Example**

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

bem-xjst should not inherit mods from namesake parent block.

**Example**

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

bem-xjst should not match on removed mods.

**Example**

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

Bug fixed: in case of same block `mods` disappearing. Now bem-xjst keep it.

**Example**

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

**Example**

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

*Result of templating:*

```html
<div class="danger">&amp;nbsp;&lt;script src="alert()"&gt;&lt;/script&gt;</div>
```

If you want avoid escaping in content [use special value](4-data#content): `{ html: '…' }`.

* [[`9bdb20479a`](https://github.com/bem/bem-xjst/commit/9bdb20479a)] - Merge pull request #217 from bem/escaping2 (Slava Oliyanchuk)
* [[`9cb7249d03`](https://github.com/bem/bem-xjst/commit/9cb7249d03)] - Package name fixed (Slava Oliyanchuk)
* [[`54d505922b`](https://github.com/bem/bem-xjst/commit/54d505922b)] - BEMXJST runSimple small refactoring (miripiruni)

# 2016-04-18, [v6.3.1](https://github.com/bem/bem-xjst/compare/v6.3.1...v6.3.0), @miripiruni

Improved error message about no block subpredicate.

**Example**

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

*Result of templating:*

 ```html
 <br>
 ```

# 2016-03-24, [v6.1.1](https://github.com/bem/bem-xjst/compare/v6.1.0...v6.1.1), @miripiruni

Fix for calc position.

**Example**

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

**Example**

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

Now supports changing elemMods in runtime.

**Example**

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

BEMTREE will return Boolean as is.

**Example**


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

`elem === ''` means no elem.

**Example**


```js
// BEMJSON:
{ block: 'b2', elem: '' }
// Result:
'<div class="b2"></div>'
```

Now BEM-XJST will ignore empty string as modName and elemModName.

**Example**

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
Order of execution `match`es was changed.

**Example**

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
