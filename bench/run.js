var fs = require('fs');
var path = require('path');
var util = require('util');

var benchmark = require('benchmark');

var argv = require('yargs')
    .describe('grep', 'filter templates to run')
    .describe('compare', 'compare with the previous bem-xjst version')
    .describe('compile', 'benchmark compile')
    .describe('flush', 'benchmark _flush()')
    .describe('min-samples', 'minimum number of samples')
    .describe('max-time', 'maximum amount of time to wait')
    .help('h')
    .alias('help', 'h')
    .argv;

var templatesDir = path.resolve(__dirname, 'templates');
var dir = fs.readdirSync(templatesDir);

var templates = [];

dir.forEach(function(file) {
  if (!/\.bemhtml$/.test(file))
    return;

  var name = file.replace(/\.bemhtml$/, '');
  var input = require(path.resolve(templatesDir, name + '.bemjson'));

  templates.push({
    name: name,
    content: fs.readFileSync(path.resolve(templatesDir, file)) + '',
    input: JSON.stringify(input)
  });
});

// node run.js --grep filter
if (argv.grep) {
  var re = new RegExp(argv.grep);
  templates = templates.filter(function(template) {
    return re.test(template.name);
  });
}

var xjst = {
  next: require('../').bemhtml,
  prev: require('bem-xjst').bemhtml
};

util._extend(benchmark.options, {
  minSamples: (argv['min-samples'] | 0) || 50,
  maxTime: (argv['max-time'] | 0) || 2
});
var suite = new benchmark.Suite();

function both(callback) {
  callback('next', xjst.next);
  if (argv.compare)
    callback('prev', xjst.prev);
}

templates.forEach(function(template) {
  if (argv.compile) {
    both(function(version, xjst) {
      // Compilation speed benchmark
      suite.add('compile:' + template.name + ':' + version, function() {
        xjst.compile(template.content, {
          context: 'this'
        });
      });
    });
  }

  both(function(version, xjst) {
    var precompiled = xjst.compile(template.content, {
      context: 'this'
    });
    var input = JSON.parse(template.input);

    // Test that it does not crash
    try {
      precompiled.apply(input);
    } catch (e) {
      console.error(e.stack);
    }

    // Rendering speed
    suite.add('render:' + template.name + ':' + version, function() {
      precompiled.apply(input);
    });
  });

  if (argv.flush) {
    both(function(version, xjst) {
      var precompiled = xjst.compile(template.content, {
        context: 'this'
      });
      var input = JSON.parse(template.input);

      precompiled.BEMContext.prototype._flush = function _flush(str) {
        return '';
      };

      // Rendering speed
      suite.add('flush:' + template.name + ':' + version, function() {
        precompiled.apply(input);
      });
    });
  }
});

var stat = [];

function checkResults(rme, hz, stats) {
  if (!rme || !hz) return;

  stat.push({ rme: rme, hz: hz, stats: stats });

  if (stat.length % 2) return;

  var i = stat.length - 1;
  var prev = stat[i];
  var next = stat[i - 1];

  console.log('next.stats.mean:', next.stats.mean);
  console.log('next.stats.deviation:', next.stats.deviation);
  console.log('prev.stats.mean:', prev.stats.mean);
  console.log('prev.stats.deviation:', prev.stats.deviation);

  check(
    next.stats.mean - next.stats.deviation,
    next.stats.mean + next.stats.deviation,
    prev.stats.mean - prev.stats.deviation,
    prev.stats.mean + prev.stats.deviation,
    next.stats.mean - prev.stats.mean
  );

  console.log('\n');
}

function check(optimisticNext, pessimisticNext, optimisticPrev, pessimisticPrev, diff) {
  if (optimisticNext > pessimisticPrev) {
    console.log('Slow than prev version: diff ' + diff + ' sec');
  } else if (pessimisticNext < optimisticPrev) {
    console.log('Faster than prev version: diff ' + diff + ' sec');
  } else {
    console.log('Next is the same as prev.');
  }
}

suite.on('cycle', function(event) {
  console.log(String(event.target));
  if (argv.compare)
    checkResults(event.target.stats.rme, event.target.hz, event.target.stats);
});
suite.run();
