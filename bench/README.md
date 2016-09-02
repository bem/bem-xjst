# Benchmarks

Ordinary benchmark test:

1. Make sure that the `benchmarks/package.json` has the right git hash of `bem-xjst` before running!

2. install dependencies: `npm install`

3. Run test

Apply compare:
`node apply-stand.js`

The test runs `bemhtml.apply(bemjson)` for 2000 times on real web3 bemjson data.
Test repeats 100 times. Then avarege of percentiles computed.

Or you can run old test:

`node run.js --compile --compare --min-samples 1000`


Benchmark help:
```bash
node run.js --help
```


