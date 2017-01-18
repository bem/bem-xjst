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

var log = function log(arr) {
  if (!Array.isArray(arr)) arr = [ arr ];
  arr.push('\n');
  console.log(arr.join('\n'));
};

if (argv.lint)
  log('bem-xjst static linter started…');

var transformers = ls.filter(function(fileName) {
  var major = fileName[0];

  return major > argv.from && major <= argv.to;
})

var files = [ '*.bemhtml.js', '*.bemtree.js' ];

var formatExtensions = function formatExtensions(arr) {
  return arr
    .map(function(mask) { return '-iname "' + mask + '"'; })
    .join(' -o ');
}

var input = argv.input;

if (input[input.length - 1] === '/')
  input = input.substr(0, input.length - 1);

var cmd = 'find ' + input + ' ' + formatExtensions(files);

require('child_process').exec(cmd, function(err, stdout, stderr) {
  var cmd;

  if (stdout.length === 0) {
    log('No ' + files.join(' or ') + ' files found.');
    process.exit(1);
  }

  for (var i = 0; i < transformers.length; i++) {
    cmd = [
      './migration/node_modules/jscodeshift/bin/jscodeshift.sh',
      '-t ' + trDir + transformers[i],
      stdout.split('\n').join(' '),
      '--print'
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

    log('Check rule: ' + transformers[i].replace(/^\d-/, '').replace(/-/g, ' ').replace(/\.js$/g, ''));
    execSync(cmd, { stdio: 'inherit', encoding: 'utf8' })
  }
});
