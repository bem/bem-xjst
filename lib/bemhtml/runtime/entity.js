var Template = require('./tree').Template;
var PropertyMatch = require('./tree').PropertyMatch;
var ModeMatch = require('./match').ModeMatch;

function Entity(bemhtml, block, elem, templates) {
  this.bemhtml = bemhtml;

  this.block = null;
  this.elem = null;
  this.jsClass = null;

  // "Fast modes"
  this.def = new ModeMatch(this);
  this.tag = new ModeMatch(this);
  this.attrs = new ModeMatch(this);
  this.mod = new ModeMatch(this);
  this.js = new ModeMatch(this);
  this.mix = new ModeMatch(this);
  this.bem = new ModeMatch(this);
  this.cls = new ModeMatch(this);
  this.content = new ModeMatch(this);

  // "Slow modes"
  this.rest = null;

  // Initialize
  this.init(block, elem);
  this.initModes(templates);
}
exports.Entity = Entity;

Entity.prototype.init = function init(block, elem) {
  this.block = block;
  this.elem = elem;

  // Class for jsParams
  if (this.elem === undefined)
    this.jsClass = this.block;
  else
    this.jsClass = this.block + '__' + this.elem;
};

Entity.prototype.initModes = function initModes(templates) {
  for (var i = 0; i < templates.length; i++) {
    var template = templates[i];
    for (var j = template.predicates.length - 1; j >= 0; j--) {
      var pred = template.predicates[j];
      if (!(pred instanceof PropertyMatch))
        continue;

      if (pred.key !== '_mode')
        continue;

      if (pred.value === 'tag' ||
          pred.value === 'attrs' ||
          pred.value === 'js' ||
          pred.value === 'mix' ||
          pred.value === 'bem' ||
          pred.value === 'cls' ||
          pred.value === 'content' ||
          pred.value === 'default') {
        template.predicates.splice(j, 1);
        if (pred.value === 'default')
          this.def.push(template);
        else
          this[pred.value].push(template);
        break;
      }
    }

    if (j === -1)
      this.def.push(template);
  }

  // Default .content() template for applyNext()
  if (this.content.count !== 0)
    this.content.push(new Template([], contentMode));

  // .def() default
  if (this.def.count !== 0) {
    var self = this;
    this.def.push(new Template([], function() {
      return self.defaultBody(this);
    }));
  }
};

function contentMode() {
  return this.ctx.content;
}

// NOTE: This could be potentially compiled into inlined invokations
Entity.prototype.run = function run(context) {
  if (this.def.count !== 0)
    return this.def.exec(context);

  return this.defaultBody(context);
};

Entity.prototype.defaultBody = function defaultBody(context) {
  var tag = context.ctx.tag;
  if (tag === undefined)
    tag = this.tag.exec(context);

  var js;
  if (context.ctx.js !== false)
    js = this.js.exec(context);

  var bem = this.bem.exec(context);
  var cls = this.cls.exec(context);
  var mix = this.mix.exec(context);
  var attrs = this.attrs.exec(context);
  var content = this.content.exec(context);

  // Default content
  if (this.content.count === 0 && content === undefined)
    content = context.ctx.content;

  return this.bemhtml.render(context,
                             this,
                             tag,
                             js,
                             bem,
                             cls,
                             mix,
                             attrs,
                             content);
};
