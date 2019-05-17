'use strict';
const execSync = require('child_process').execSync;
const fs = require('fs');
const stats = require('./lib/stats');

const argv = require('yargs')
  .describe('bemjson', 'amount of bemjson files to render (default 100)')
  .describe('repeat', 'repeat test (default 1)')
  .describe('dataPath', 'path to bemjson files')
  .describe('templatePath', 'path to template file')
  .describe('verbose', 'verbose results')
  .help('h')
  .alias('help', 'h')
  .argv;

/**
 * Поворачивает матрицу чисел на бок
 * Было:
 * [
 *   [ 1, 2, 3 ],
 *   [ 4, 5, 6 ],
 *   [ 7, 8, 9 ]
 *  ]
 *
 *  Стало:
 *  [
 *   [ 1, 4, 7 ],
 *   [ 2, 5, 8 ],
 *   [ 3, 6, 9 ]
 *  ]
 * @returns {Object}
 * @param {Number[][]} arr
 */
const turnMatrix = function(arr) {
  var rows = arr.length;

  return arr[0].map(function(item, i) {
    var ret = [];
    for (var n = 0; n < rows; n++) ret.push(arr[n][i]);
    return ret;
  });
};

/**
 * @param {Number[]} arr
 * @return {Number[]}
 */
const sort = function(arr) {
  const sortNumbers = function(a, b) { return (a < b) ? -1 : 1; };
  return [].concat(arr).sort(sortNumbers);
};

/**
 * Вычисляет перцентиль
 * @param {Number[]} arr
 * @param {Number} percentile (0.5)
 */
const getPercentile = function(arr, percentile) {
  const ret = [].concat(arr);
  return sort(ret)[Math.round(ret.length * percentile) - 1];
};

/**
 * Конвертирует наносекунды в миллисекунды
 * @param {Number} ns
 * @returns {Number}
 */
const nsToMs = function(ns) {
  return ns / 1e6;
};

/**
 * Предоставляет аналитику о корреляции двух чисел
 * @param {Number} n
 * @param {Number} m
 * @returns {Object}
 */
const analyseCorrelation = function(n, m) {
  return {
    rev1: n,
    rev2: m,
    'diff abs': n > m ? n - m : m - n,
    'diff percent': (1 - (n > m ? m / n : n / m)) * 100
  };
};

/**
 * Запускает один тест в дочернем процессе
 * @param {String} rev ревизия
 * @returns {Number[]}
 */
const runTest = function(rev) {
  var cmd = 'node test.js';
  cmd += ' --rev ' + rev;
  cmd += ' --bemjson ' + (argv.bemjson || 100);
  if (argv.dataPath) cmd += ' --dataPath ' + argv.dataPath;
  if (argv.templatePath) cmd += ' --templatePath ' + argv.templatePath;
  if (argv.verbose) cmd += ' --verbose';

  console.log(cmd);
  var ret = JSON.parse(execSync(cmd, { encoding: 'utf8' }));

  dumpToFile([ rev, argv.bemjson ].join('-'), ret);

  return ret;
};

const dumpToFile = function dumpToFile(path, ret) {
  path = outDir + '/' + path + '-' + Date.now() + '.dat';

  ret = sort(ret);

  var h = new stats.Registry({
    "$default": [
      {
        left: 1,
        right: 30,
        precision: 1
      }
    ]
  });

  for (var i = 0; i < ret.length; i++)
    h.updateHistogram('t', ret[i]);

  fs.writeFileSync(path, JSON.stringify(h.snapshot()[0][1]));
};

const averageHistogram = function(dat) {
  var d = dat[0];
  var res = {};

  var average = function(a) {
    return a.reduce(function(p, c) { return p + c; }) / a.length;
  };

  for (var i = 0; i < d.length; i++) {
    res[d[i][0].toString()] = [];
    for (var j = 0; j < dat.length; j++)
      res[d[i][0].toString()].push(dat[j][i][1]);
  }

  for (var i = 0; i < d.length; i++)
    res[d[i][0].toString()] = average(res[d[i][0].toString()]);

  return Object.keys(res).map(function(key) {
    return [ key, res[key] ];
  });
};

/**
 * Повторяет вызов функции fn n раз
 * @param {Number} n
 * @param {Function} fn
 * @param {*} arg
 * @returns {*[]} массив результатов вызова
 */
const runMany = function(n, fn, arg) {
  /**
   * @type {Number[][]}
   */
  const manyRunsResult = [];

  for (var i = 0; i < n; i++)
    manyRunsResult.push(fn(arg));

  return manyRunsResult;
};


/**
 * Повторяет вызов функции fn n раз
 * @param {Number} n
 * @param {Function} fn
 * @param {*} arg
 * @returns {*[]} массив результатов вызова
 */
const repeat = function(n, fn, arg) {
  /**
   * @type {Number[][]}
   */
  var res = [];

  for (var i = 0; i < n; i++) {
    res = res.concat(fn(arg));
  }

  return res;
};

const main = function(rev) {
  var res = argv.repeat > 0 ?
    runMany(argv.repeat, runTest, rev)
      .map(function(arr) { return getPercentile(arr, 0.95); }) :
    runTest(rev);

  return {
      '0.5': getPercentile(res, 0.5),
      '0.9': getPercentile(res, 0.9),
      '0.95': getPercentile(res, 0.95)
    };

  /*
  return nsToMs(
    getPercentile(
      turnMatrix(runMany(argv.repeat || 100, runTest, rev))
        .map(function(arr) { return getPercentile(arr, 0.2); }),
      0.95
    )
  );
  */
};

/**
 * Подготавливает зависимости теста
 * @param {String} rev1 ревизия
 * @param {String} rev2 ревизия
 */
const prepareTest = function prepareTest(rev1, rev2) {
  var cmd = './prepare.sh';
  cmd += ' ' + rev1;
  cmd += ' ' + rev2;
  return execSync(cmd, { stdio: [ 0, 1, 2 ], encoding: 'utf8' });
};

const buildGraph = function buildGraph(dir) {
  var cmd = './lib/compare.py ' + dir;
  var ls = fs.readdirSync(dir);

  for (var i = 0; i < ls.length; i++)
    cmd += ' ' + dir + '/' + ls[i];

  console.log(cmd);

  return execSync(cmd, { stdio: [ 0, 1, 2 ], encoding: 'utf8' });
};

prepareTest(argv.rev1, argv.rev2);

console.log('Test started…');
// console.log(argv);
// console.log(new Date(Date.now()));

var outDir = './dat-' + argv.rev1.slice(0, 5) + '-' + argv.rev2.slice(0, 5);
fs.mkdirSync(outDir);

var startTime = process.hrtime();
var resultRev1 = main(argv.rev1);
var resultRev2 = main(argv.rev2);
var totalTime = process.hrtime(startTime);

console.log('Total test time: ', (totalTime[0] * 1e9 + totalTime[1]) / 1e6);

buildGraph(outDir);

Object.keys(resultRev1).forEach(function(percentile) {
  console.log('Percentile: ', percentile);
  console.log(analyseCorrelation(resultRev1[percentile], resultRev2[percentile]));
  console.log('');
});
