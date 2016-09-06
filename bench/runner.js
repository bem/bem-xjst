'use strict';
const execSync = require('child_process').execSync;
const argv = require('yargs')
    .describe('bemjson', 'amount of bemjson files (default 2000, max 2000)')
    .describe('repeat', 'repeat test (default 100)')
    .describe('verbose', 'verbose results')
    .describe('dataPath', 'path where bemjson files')
    .describe('templatePath', 'path to template file')
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
 * @param {Numbers[][]} arr
 */
const turnMatrix = function(arr) {
  var rows = arr.length;
  var cols = arr[0].length;

  return arr[0].map(function(item, i) {
    var ret = [];
    for (var n = 0; n < rows; n++) ret.push(arr[n][i]);
    return ret;
  });
};

/**
 * @param {Numbers[]}
 * @return {Numbers[]}
 */
const sort = function(arr) {
  const sortNumbers = function(a, b) { return (a < b) ? -1 : 1; };
  return [].concat(arr).sort(sortNumbers);
}

/**
 * Вычисляет перцентиль
 * @param {Numbers[]} arr
 * @param {Number} percentile (0.5)
 */
const getPercentile = function(arr, percentile) {
  const ret = [].concat(arr);
  return sort(ret)[Math.round(ret.length * percentile) - 1];
};

/**
 * Конвертирует наносекунды в миллисекунды
 * @param {Number}
 * @returns {Number}
 */
const nsToMs = function(ns) {
  return ns/1e6;
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
}

/**
 * Запускает один тест в дочернем процессе
 * @param {String} rev ревизия
 * @returns {Numbers[]}
 */
const runTest = function(rev) {
  var cmd = 'node test.js';
  cmd += ' --rev ' + rev;
  cmd += ' --bemjson ' + (argv.bemjson || 100);
  argv.dataPath && (cmd += ' --dataPath ' + argv.dataPath);
  argv.templatePath && (cmd += ' --templatePath ' + argv.templatePath);
  argv.verbose && (cmd += ' --verbose');
  return JSON.parse(execSync(cmd, { encoding: 'utf8' }));
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
   * @type {Numbers[][]}
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
   * @type {Numbers[][]}
   */
  var res = [];

  for (var i = 0; i < n; i++) {
    res = res.concat(fn(arg));
  }

  return res;
};

const main = function(rev) {
  if (argv.repeat > 0) {
    return getPercentile(
      runMany(argv.repeat || 100, runTest, rev)
        .map(function(arr) { return getPercentile(arr, 0.95); }),
      0.95);
  }

  return getPercentile(runTest(rev), 0.95);

  //return nsToMs(
    //getPercentile(
      //turnMatrix(runMany(argv.repeat || 100, runTest, rev))
        //.map(function(arr) { return getPercentile(arr, 0.2); }),
      //0.95
    //)
  //);
};

/**
 * Подготавливает зависимости теста
 * @param {String} rev1 ревизия
 * @param {String} rev2 ревизия
 */
const prepareTest = function(rev1, rev2) {
  var cmd = './prepare.sh';
  cmd += ' ' + argv.rev1;
  cmd += ' ' + argv.rev2;
  return execSync(cmd, { stdio: [ 0, 1, 2 ], encoding: 'utf8' });
};

prepareTest(argv.rev1, argv.rev2);

console.log('Test started…');
console.log(argv);
console.log(new Date(Date.now()));

var startTime = process.hrtime();
var resultRev1 = main(argv.rev1);
var resultRev2 = main(argv.rev2);
var totalTime = process.hrtime(startTime);

console.log('Total test time: ', (totalTime[0] * 1e9 + totalTime[1]) / 1e6);

console.log(analyseCorrelation(resultRev1, resultRev2));
