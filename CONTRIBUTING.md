# bem-xjst contributing notes

If you want help you can fix issues than labeled [help wanted](https://github.com/bem/bem-xjst/issues?q=is%3Aissue+is%3Aopen+label%3A%22help+wanted%22).

## Development dependencies

All `devDependencies` must fix only major version. Use `^` in package.json.

## Unit Tests

To run tests cast `npm run test`.

## Benchmarks

To run benchmarks see [bench readme](https://github.com/bem/bem-xjst/blob/master/bench/README.md).

## Release version 

### Before

1. Functional: unit tests.
2. Performance: benchmarks.
3. Integration: check Islands and web4 (skip if you not from Yandex :).
4. Write changelog (use [changelog-maker](https://github.com/rvagg/changelog-maker)) и release notes.
5. Don’t forget about `git tag`.
6. If you build package from support branch (4.x, 5.x etc) don’t forget about [`-- tag`](https://docs.npmjs.com/cli/publish) parameter of `npm publish`.

### After
1. Merge PR about update `bem-xjst` dependency to [`enb-bemxjst`](https://github.com/enb/enb-bemxjst/). If you build package from support branch update `enb-bemxjst-6x`.
2. Write changelog `enb-bemxjst`.
3. Publish `enb-bemxjst` npm release.
4. Update bem-xjst online demo.


# Online demo 

To update or change online demo read [manual](https://github.com/bem/bem-xjst/blob/gh-pages/README.md).
