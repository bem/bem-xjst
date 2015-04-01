/**
 * Separator for modifiers and their values
 * @const
 * @type String
 */
var MOD_DELIM = '_',

/**
 * Separator between block names and a nested element
 * @const
 * @type String
 */
    ELEM_DELIM = '__',

/**
 * Pattern for acceptable names of elements and modifiers
 * @const
 * @type String
 */
    NAME_PATTERN = '[a-zA-Z0-9-]+';

function buildModPostfix(modName, modVal) {
  var res = MOD_DELIM + modName;
  if(modVal !== true) res += MOD_DELIM + modVal;
  return res;
}
exports.buildModPostfix = buildModPostfix;

function buildBlockClass(name, modName, modVal) {
  var res = name;
  if(modVal) res += buildModPostfix(modName, modVal);
  return res;
}
exports.buildBlockClass = buildBlockClass;

function buildElemClass(block, name, modName, modVal) {
  var res = buildBlockClass(block) + ELEM_DELIM + name;
  if(modVal) res += buildModPostfix(modName, modVal);
  return res;
}
exports.buildElemClass = buildElemClass;

var buildEscape = (function() {
  var ts = { '"' : '&quot;', '&' : '&amp;', '<' : '&lt;', '>' : '&gt;' };
  var f = function(t) { return ts[t] || t; };
  return function(r) {
    r = new RegExp(r, 'g');
    return function(s) { return ('' + s).replace(r, f); };
  };
})();

exports.xmlEscape = buildEscape('[&<>]');
exports.attrEscape = buildEscape('["&<>]');

exports.extend = function extend(o1, o2) {
  if (!o1 || !o2)
    return o1 || o2;

  var res = {};
  var n;

  for (n in o1)
    if (o1.hasOwnProperty(n))
      res[n] = o1[n];
  for (n in o2)
    if (o2.hasOwnProperty(n))
      res[n] = o2[n];
  return res;
};

var SHORT_TAGS = { // хэш для быстрого определения, является ли тэг коротким
  area : 1, base : 1, br : 1, col : 1, command : 1, embed : 1, hr : 1, img : 1,
  input : 1, keygen : 1, link : 1, meta : 1, param : 1, source : 1, wbr : 1 };

exports.isShortTag = function isShortTag(t) {
  return SHORT_TAGS.hasOwnProperty(t);
};

exports.isSimple = function isSimple(obj) {
    if (!obj || obj === true) return true;
    return typeof obj === 'string' || typeof obj === 'number';
};
