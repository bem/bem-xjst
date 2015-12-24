function ClassBuilder(options) {
  this.modDelim = options.mod || '_';
  this.elemDelim = options.elem || '__';
}
exports.ClassBuilder = ClassBuilder;

ClassBuilder.prototype.build = function build(block, elem) {
  if (elem === undefined)
    return block;
  else
    return block + this.elemDelim + elem;
};

ClassBuilder.prototype.buildModPostfix = function buildModPostfix(modName,
                                                                  modVal) {
  var res = this.modDelim + modName;
  if (modVal !== true) res += this.modDelim + modVal;
  return res;
};

ClassBuilder.prototype.buildBlockClass = function buildBlockClass(name,
                                                                  modName,
                                                                  modVal) {
  var res = name;
  if (modVal) res += this.buildModPostfix(modName, modVal);
  return res;
};

ClassBuilder.prototype.buildElemClass = function buildElemClass(block,
                                                                name,
                                                                modName,
                                                                modVal) {
  var res = this.buildBlockClass(block) + this.elemDelim + name;
  if (modVal) res += this.buildModPostfix(modName, modVal);
  return res;
};

ClassBuilder.prototype.split = function split(key) {
  return key.split(this.elemDelim, 2);
};

/**
 * Public method available in templates context
 * @param opts
 *   @param {String} opts.block
 *   @param {String} [opts.elem]
 *   @param {String} [opts.modName]
 *   @param {String} [opts.modVal]
 * @example
 * // returns 'b_m_v'
 * stringify({ block: 'b', modName: 'm', modVal: 'v' });
 * @example
 * // returns 'b__e_m_v'
 * stringify({ block: 'b', elem: 'e', modName: 'm', modVal: 'v' });
 * @returns {String} BEM name
 */
ClassBuilder.prototype.stringify = function stringify(opts) {
  if (!opts || !opts.block) return '';
  if (!opts.modName) return this.build(opts.block, opts.elem);

  return opts.elem ?
    this.buildElemClass(opts.block, opts.elem, opts.modName, opts.modVal) :
    this.buildBlockClass(opts.block, opts.modName, opts.modVal);
};
