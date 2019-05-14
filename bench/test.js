'use strict';
const fs = require('fs');

const argv = require('yargs')
  .describe('rev', 'bem-xjst revision (commit hash)')
  .describe('bemjson', 'amount of bemjson files to render (default 2000)')
  .describe('dataPath', 'path to bemjson files')
  .describe('templatePath', 'path to template file')
  .describe('verbose', 'verbose results')
  .help('h')
  .alias('help', 'h')
  .argv;

const dataPath = argv.dataPath || './node_modules/web-data/data';
const templatePath = argv.templatePath || './node_modules/web-data/templates.js';
const files = fs.readdirSync(dataPath);
const times = argv.bemjson || 2000;
const secInNs = 1e9;
const res = [];

const bemhtml = require('./bem-xjst-' + argv.rev).bemhtml;
const templates = bemhtml.compile(fs.readFileSync(templatePath, 'utf8'), { escapeContent: true });

for (var i = 0; i < times; i++) {
  var path = dataPath + '/' + files[i % files.length];
  // argv.verbose && console.warn(path);
  var data = JSON.parse(fs.readFileSync(path, 'utf8'));

  var time = process.hrtime();
  templates.apply(data);
  var diff = process.hrtime(time);

  res.push((diff[0] * secInNs + diff[1]) / 1000000);
}

console.log(JSON.stringify(res));
