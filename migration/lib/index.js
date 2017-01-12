#!/usr/bin/env node
'use strict';

var fs = require('fs');
var execSync = require('child_process').execSync;
var trDir = './migration/lib/transformers/';
var ls = fs.readdirSync(trDir);

var argv = require('yargs')
    .option('input', {
      describe: 'templates directory',
      alias: 'i',
      demand: true,
      type: 'string'
    })
    .option('from', {
      describe: 'current major version of bem-xjst',
      alias: 'f',
      default: '0',
      type: 'string'
    })
    .option('to', {
      describe: 'major version of bem-xjst to update for',
      alias: 't',
      default: '8',
      type: 'string'
    })
    .option('lint', {
      describe: 'lint mode',
      default: false,
      alias: 'l'
    })
    .option('config', {
      describe: 'path to codestyle config for jscodeshift output',
      alias: 'c'
    })
    .help('h')
    .alias('help', 'h')
    .argv;

if (argv.lint)
  console.log('bem-xjst static linter started…');

var transformers = ls.filter(function(fileName) {
  var major = fileName[0];

  return major > argv.from && major <= argv.to;
})

require('child_process').exec('find ' + argv.input + ' -iname "*.bemhtml.js" -o -iname "*.priv.js"', function(err, stdout, stderr) {
  var cmd;
  console.log('Process files:');
  console.log(stdout);

  for (var i = 0; i < transformers.length; i++) {
    cmd = [
      './migration/node_modules/jscodeshift/bin/jscodeshift.sh',
      '-t ' + trDir + transformers[i],
      stdout.split('\n').join(' ')
    ];

    if (argv.lint)
      cmd.push('--lint=true');

    if (argv.config) {
      try {
        var config = require(argv.config);
      } catch(e) {
        console.error('Error: cannot require config file from ' + argv.config);
        console.error(e);
        process.exit(1);
      }

      cmd.push('--config=' + argv.config);
    }

    cmd = cmd.join(' ');

    execSync(cmd, { stdio: 'inherit', encoding: 'utf8' })
  }
});
