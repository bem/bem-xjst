# Benchmarks

## New benchmark test

1. Install dependencies: `npm i`

2. Run test

`node runner.js --rev1 d53646f2c340b5496fbd75a5313e3284b58e238d --rev2 d53646f2c340b5496fbd75a5313e3284b58e238d --bemjson 1000 --dataPath ~/bemjson/data --templatePath ./node_modules/web-data/templates.js`

`dataPath` and `templatePath` are optional.

The results of test would be directory `dat-d5364-and-d5364` with svg histogram and STDOUT with some numbers.

You can download 1000 bemjson files from https://github.com/miripiruni/web-data


## Old test

Or you can run old test:

1. Make sure that the `benchmarks/package.json` has the right git hash of `bem-xjst` before running!

2. Run `node run.js --compile --compare --min-samples 1000`


Benchmark help:
```bash
node run.js --help
```
