'use strict';

const inherits = require('inherits');

class XJST {

  constructor(templates = '', options = {}) {
    this.options = options;
    this.templates = [templates];
    this.engine = require(`./lib/bemxjst`);
  }

  apply(json) {
    return this.runtime.apply(json);
  }

  compile(templates) {
    this.templates.push(templates);
    this.runtime.compile(templates);
    return this;
  }

  use(plugin) {
    console.log(`apply engine: ${plugin.name}`);
    inherits(plugin.engine, this.engine);
    this.engine = plugin.engine;

    const options = Object.assign(this.options, plugin.options);
    const instance = new this.engine(options);

    this.runtime = {};
    instance.compile(''); // ¯ \ _ (ツ) _ / ¯
    instance.exportApply(this.runtime);

    // member templates between engine changes
    this.templates.forEach(templates => {
      this.compile(templates);
    });

    return this;
  }

}

XJST.plugin = function(name, runtime) {
  return function (options = {}) {
    return {
      name: name,
      engine: runtime(options), // we can pass options to every plugin
      options: options
    };
  };
}

module.exports = XJST;
