# Benchmarks

Ordinary benchmark test:

1. Make sure that the `benchmarks/package.json` has the right git hash of `bem-xjst` before running!

2. install dependencies: `npm install`

3. Run test

Apply compare:
```bash node runner.js
    --rev1 d53646f2c340b5496fbd75a5313e3284b58e238d
    --rev2 d53646f2c340b5496fbd75a5313e3284b58e238d
    --bemjson 1000
    --dataPath ./node_modules/web-data/data
    --templatePath ./node_modules/web-data/templates.js
```

`dataPath` and `templatePath` are optional.

The test runs `bemhtml.apply(bemjson)` on 1000 bemjson data.  Then average of percentiles computed.

Or you can run old test:

`node run.js --compile --compare --min-samples 1000`


Benchmark help:
```bash
node run.js --help
```


