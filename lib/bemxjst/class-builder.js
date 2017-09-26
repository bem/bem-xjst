function ClassBuilder(options) {
  this.elemDelim = options.elem || '__';

  this.modDelim = typeof options.mod === 'string' ?
    {
      name: options.mod || '_',
      val: options.mod || '_'
    } :
    {
      name: options.mod && options.mod.name || '_',
      val: options.mod && options.mod.val || '_'
    };
}

exports.ClassBuilder = ClassBuilder;

ClassBuilder.prototype.build = function(block, elem) {
  if (!elem)
    return block;
  else
    return block + this.elemDelim + elem;
};

ClassBuilder.prototype.buildModPostfix = function(modName, modVal) {
  var res = this.modDelim.name + modName;
  if (modVal !== true) res += this.modDelim.val + modVal;
  return res;
};

ClassBuilder.prototype.buildBlockClass = function(name, modName, modVal) {
  var res = name;
  if (modVal) res += this.buildModPostfix(modName, modVal);
  return res;
};

ClassBuilder.prototype.buildElemClass = function(block, name, modName, modVal) {
  return this.buildBlockClass(block) +
    this.elemDelim +
    name +
    this.buildModPostfix(modName, modVal);
};

ClassBuilder.prototype.split = function(key) {
  return key.split(this.elemDelim, 2);
};
