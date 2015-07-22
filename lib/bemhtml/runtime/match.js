var utils = require('./utils');

var PropertyMatch = require('./tree').PropertyMatch;
var PropertyAbsent = require('./tree').PropertyAbsent;
var CustomMatch = require('./tree').CustomMatch;

function MatchProperty(template, pred) {
  this.template = template;
  this.key = pred.key;
  this.value = pred.value;
}

MatchProperty.prototype.exec = function exec(context) {
  return context[this.key] === this.value;
};

function MatchNested(template, pred) {
  this.template = template;
  this.keys = pred.key;
  this.value = pred.value;
}

MatchNested.prototype.exec = function exec(context) {
  var val = context;
  for (var i = 0; i < this.keys.length - 1; i++) {
    val = val[this.keys[i]];
    if (!val)
      return false;
  }

  return val[this.keys[i]] === this.value;
};

function MatchAbsent(template, pred) {
  this.template = template;
  this.key = pred.key;
}

MatchAbsent.prototype.exec = function exec(context) {
  return !context[this.key];
};

function MatchCustom(template, pred) {
  this.template = template;
  this.body = pred.body;
}

MatchCustom.prototype.exec = function exec(context) {
  return this.body.call(context);
};

function MatchTemplate(mode, template) {
  this.mode = mode;
  this.predicates = new Array(template.predicates.length);
  this.body = template.body;

  for (var i = 0; i < this.predicates.length; i++) {
    var pred = template.predicates[i];
    if (pred instanceof PropertyMatch) {
      if (utils.isArray(pred.key))
        this.predicates[i] = new MatchNested(this, pred);
      else
        this.predicates[i] = new MatchProperty(this, pred);
    } else if (pred instanceof PropertyAbsent) {
      this.predicates[i] = new MatchAbsent(this, pred);
    } else if (pred instanceof CustomMatch) {
      this.predicates[i] = new MatchCustom(this, pred);
    } else {
      throw new Error('Unknown predicate type: ' + pred.constructor.name);
    }
  }
}
exports.MatchTemplate = MatchTemplate;

function Match(entity) {
  this.entity = entity;
  this.bemhtml = this.entity.bemhtml;
  this.templates = [];

  // applyNext mask
  this.mask = [ 0 ];

  this.count = 0;
}
exports.Match = Match;

Match.prototype.clone = function clone(entity) {
  var res = new Match(entity);

  res.templates = this.templates.slice();
  res.mask = this.mask.slice();
  res.count = this.count;

  return res;
};

Match.prototype.prepend = function prepend(other) {
  this.templates = other.templates.concat(this.templates);
  this.count += other.count;

  while (Math.ceil(this.count / 31) > this.mask.length)
    this.mask.push(0);
};

Match.prototype.push = function push(template) {
  this.templates.push(new MatchTemplate(this, template));
  this.count++;

  if (Math.ceil(this.count / 31) > this.mask.length)
    this.mask.push(0);
};

Match.prototype.exec = function exec(context) {
  var template;
  var mask = this.mask[0];
  var bitIndex = 0;
  var bit = 1;
  for (var i = 0; i < this.count; i++) {
    if ((mask & bit) === 0) {
      template = this.templates[i];
      for (var j = template.predicates.length - 1; j >= 0; j--) {
        var pred = template.predicates[j];

        /* jshint maxdepth : false */
        if (!pred.exec(context))
          break;
      }

      // All predicates matched!
      if (j === -1)
        break;
    }

    if (bit === 0x40000000) {
      bitIndex++;
      mask = this.mask[bitIndex];
      bit = 1;
    } else {
      bit <<= 1;
    }
  }

  if (i === this.count)
    return undefined;

  var oldMask = mask;
  var oldMatch = this.bemhtml.match;
  this.mask[bitIndex] |= bit;
  this.bemhtml.match = this;

  var out;
  if (typeof template.body === 'function')
    out = template.body.call(context);
  else
    out = template.body;

  this.mask[bitIndex] = oldMask;
  this.bemhtml.match = oldMatch;

  return out;
};
