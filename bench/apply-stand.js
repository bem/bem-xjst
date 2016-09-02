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

var test = function() {
  var timesPrev = [];
  var timesNext = [];
  var res = { compile: '', applyPrev: [], applyNext: [] };
  var times = argv.bemjsons || 2000;

  // Revision 1
  for (var i = 0; i < times; i++) {
      var path = dataPath + '/' + files[i];
      if (!files[i]) {
        console.log(i);
        console.log(files);
        console.log(path);
      }
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

  var sortNumbers = function(a, b) { return (a < b) ? -1 : 1; };

  res.applyPrev.sort(sortNumbers);
  res.applyNext.sort(sortNumbers);

  argv.verbose && console.log(JSON.stringify(res));

  return {
    prev: {
      '20': res.applyPrev[499]/1000000,
      '50': res.applyPrev[1099]/1000000,
      '75': res.applyPrev[1599]/1000000,
      '90': res.applyPrev[1899]/1000000,
      '99': res.applyPrev[1989]/1000000
    },
    next: {
      '20': res.applyNext[499]/1000000,
      '50': res.applyNext[1099]/1000000,
      '75': res.applyNext[1599]/1000000,
      '90': res.applyNext[1899]/1000000,
      '99': res.applyNext[1989]/1000000
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

// Calculate results:
var av = function(arr) {
  return arr.reduce(function(previousValue, currentValue, currentIndex, array) {
    return previousValue + currentValue;
  })/arr.length;
};

var proxy = function(perc) {
  return function(i) { return i[perc]; };
}

var resByPercentile = function(perc) {
  var prev = av(results.prev.map(proxy(perc)));
  var next = av(results.next.map(proxy(perc)));

  console.log('Results by ' + perc + ' percentile:');
  argv.verbose && console.log('prev: ' + prev);
  argv.verbose && console.log('next: ' + next);
  console.log(prev > next ? (next/prev) : (prev/next));
  console.log('\n');
}

resByPercentile('20');
resByPercentile('50');
resByPercentile('75');
resByPercentile('90');
resByPercentile('99');
