var fs = require('fs');
var bemhtmlPrev = require('bem-xjst').bemhtml;
var bemhtmlNext = require('bem-xjst').bemhtml;
var dataPath = './node_modules/web-data/data';
var files = fs.readdirSync(dataPath);
var templatesPrev = bemhtmlPrev.compile(fs.readFileSync('./node_modules/web-data/templates.js', 'utf8'));
var templatesNext = bemhtmlNext.compile(fs.readFileSync('./node_modules/web-data/templates.js', 'utf8'));

var argv = require('yargs')
    .describe('bemjsons', 'amount of bemjsons (default 2000, max 2000)')
    .describe('repeats', 'amount of repeats test')
    .describe('verbose', 'verbose results')
    .help('h')
    .alias('help', 'h')
    .argv;

var sortNumbers = function(a, b) { return (a < b) ? -1 : 1; };

var test = function() {
  var timesPrev = [];
  var timesNext = [];
  var res = { compile: '', applyPrev: [], applyNext: [] };
  var times = argv.bemjsons || 2000;

  // Revision 1
  for (var i = 0; i < times; i++) {
      var path = dataPath + '/' + files[i];
      var data = JSON.parse(fs.readFileSync(path, 'utf8'));

      var timePrev = process.hrtime();
      templatesPrev.apply(data);
      var diffPrev = process.hrtime(timePrev);
      res.applyPrev.push(diffPrev[0] * 1000000000 + diffPrev[1]);
  }

  // Revision 2
  for (var j = 0; j < times; j++) {
      var path = dataPath + '/' + files[j];
      var data = JSON.parse(fs.readFileSync(path, 'utf8'));

      var timeNext = process.hrtime();
      templatesNext.apply(data);
      var diffNext = process.hrtime(timeNext);
      res.applyNext.push(diffNext[0] * 1000000000 + diffNext[1]);
  }


  //res.applyPrev.sort(sortNumbers);
  //res.applyNext.sort(sortNumbers);

  argv.verbose && console.log(JSON.stringify(res));

  return {
    prev: {
      apply: res.applyPrev
      //'20': res.applyPrev[499]/1000000,
      //'50': res.applyPrev[1099]/1000000,
      //'75': res.applyPrev[1599]/1000000,
      //'90': res.applyPrev[1899]/1000000,
      //'99': res.applyPrev[1989]/1000000
    },
    next: {
      apply: res.applyNext
      //'20': res.applyNext[499]/1000000,
      //'50': res.applyNext[1099]/1000000,
      //'75': res.applyNext[1599]/1000000,
      //'90': res.applyNext[1899]/1000000,
      //'99': res.applyNext[1989]/1000000
    }
  };
};

var results = {
  prev: [],
  next: []
};


var times = argv.repeats || 100;

for (var n = 0; n < times; n++) {
  console.log('Test iteration: ' + n + '…');
  var res = test();
  results.prev.push(res.prev);
  results.next.push(res.next);
};

var transp = { prev: [], next: [] };
var bj = argv.bemjsons || 2000;

for (var i = 0; i < bj; i++) {
  if (!Array.isArray(transp.prev[i])) {
    transp.prev[i] = [];
    transp.next[i] = [];
  }

  for (var n = 0; n < times; n++) {
    transp.prev[i].push(results.prev[n].apply[i]);
    transp.next[i].push(results.next[n].apply[i]);
  }
}

for (var i = 0; i < bj; i++) {
  transp.prev[i].sort(sortNumbers);
  transp.next[i].sort(sortNumbers);
}

console.log(JSON.stringify(transp, null, '\t'));

var r = {
  prev: [],
  next: []
};

var m = 7;
for (var n = 0; n < bj; n++) {
  r.prev.push(transp.prev[n][m]/1000000);
  r.next.push(transp.next[n][m]/1000000);
};

console.log('r', JSON.stringify(r, null, '\t'));

// Calculate results:
var av = function(arr) {
  return arr.reduce(function(previousValue, currentValue, currentIndex, array) {
    return previousValue + currentValue;
  })/arr.length;
};

var proxy = function(perc) {
  return function(i) { return i[perc]; };
}

var resByPercentile = function(perc, results) {
  var prev = av(results.prev.map(proxy(perc)));
  var next = av(results.next.map(proxy(perc)));

  console.log('Results by ' + perc + ' percentile:');
  argv.verbose && console.log('prev: ' + prev);
  argv.verbose && console.log('next: ' + next);
  console.log(prev > next ? (next/prev) : (prev/next));
  console.log('\n');
}

//resByPercentile('20', results);
//resByPercentile('50', results);
//resByPercentile('75', results);
//resByPercentile('90', results);
//resByPercentile('99', results);
//
resByPercentile('20', r);
resByPercentile('50', r);
resByPercentile('75', r);
resByPercentile('90', r);
resByPercentile('99', r);
