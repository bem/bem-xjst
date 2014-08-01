/* global oninit, Vow */

module.exports = function() {

oninit(function(exports) {

var undef,
    BEM_ = {},
    toString = Object.prototype.toString,
    isArray = Array.isArray || function(obj) {
        return toString.call(obj) === '[object Array]';
    },
    buildEscape = (function() {
        var ts = { '"' : '&quot;', '&' : '&amp;', '<' : '&lt;', '>' : '&gt;' },
            f = function(t) { return ts[t] || t; };
        return function(r) {
            r = new RegExp(r, 'g');
            return function(s) { return ('' + s).replace(r, f); };
        };
    })();

function BEMContext(context, apply_) {
    this.ctx = context;
    this.apply = apply_;
    this._buf = {};
    this.__queue = [];
    this._ = this;

    // Stub out fields that will be used later
    this._mode = '';
    this.block = undef;
    this.elem = undef;
    this.mods = undef;
    this.elemMods = undef;
}

BEMContext.prototype.isArray = isArray;

BEMContext.prototype.isSimple = function isSimple(obj) {
    var t = typeof obj;
    return t === 'string' || t === 'number' || t === 'boolean';
};

BEMContext.prototype.extend = function extend(o1, o2) {
    if(!o1 || !o2) return o1 || o2;
    var res = {}, n;
    for(n in o1) o1.hasOwnProperty(n) && (res[n] = o1[n]);
    for(n in o2) o2.hasOwnProperty(n) && (res[n] = o2[n]);
    return res;
};

BEMContext.prototype.identify = (function() {
    var cnt = 0,
        id = (+new Date()),
        expando = '__' + id,
        get = function() { return 'uniq' + id + (++cnt); };
    return function(obj, onlyGet) {
        if(!obj) return get();
        if(onlyGet || obj[expando]) {
            return obj[expando];
        } else return (obj[expando] = get());
    };
})();

BEMContext.prototype.xmlEscape = buildEscape('[&<>]');
BEMContext.prototype.attrEscape = buildEscape('["&<>]');

BEMContext.prototype.generateId = function generateId() {
    return this.identify(this.ctx);
};

BEMContext.prototype.doAsync = function doAsync(fn) {
    var mode  = this._mode,
        ctx   = this.ctx,
        block = this.block,
        elem  = this.elem,
        mods  = this.mods,
        elemMods = this.elemMods,
        promise = Vow.invoke(fn);

    this.__queue.push(promise);

    promise.always(function() {
        this._mode = mode;
        this.ctx   = ctx;
        this.block = block;
        this.elem  = elem;
        this.mods  = mods;
        this.elemMods = elemMods;
    }.bind(this));

    return promise;
};

// Wrap xjst's apply and export our own
var oldApply = exports.apply;
exports.apply = BEMContext.applyAsync = function BEMContext_applyAsync(context) {
    var ctx = new BEMContext(context || this, oldApply);
    ctx._buf = ctx.apply();
    return Vow
        .allResolved(ctx.__queue)
        .always(function() {
            return ctx._buf;
        });
};

});

match(this._mode === '')(

    match()(function() {
        this.ctx || (this.ctx = {});

        var vBlock = this.ctx.block,
            vElem = this.ctx.elem,
            block = this._currBlock || this.block;

        return apply('default', {
            block : vBlock || (vElem ? block : undefined),
            _currBlock : (vBlock || vElem) ? undefined : block,
            elem  : vElem,
            mods : vBlock? this.ctx.mods || (this.ctx.mods = {}) : this.mods,
            elemMods : this.ctx.elemMods || {}
        });
    }),

    match(function() { return this.isArray(this.ctx); })(function() {
        var ctx = this.ctx,
            len = ctx.length,
            i = 0,
            buf = [];

        while(i < len)
            buf.push(apply({ ctx : ctx[i++] }));

        return buf;
    }),

    match(function() { return !this.ctx; })(),

    match(function() { return this.isSimple(this.ctx); })(function() {
        var ctx = this.ctx;
        if(ctx && ctx !== true || ctx === 0) {
            return ctx;
        }
    })

);

def()(function() {
    var content = apply('content');
    if(content || content === 0) {
        this.ctx.content = Vow.isPromise(content) ?
            this.doAsync(function() {
                console.log('here');
                return content.then(function(res) {
                    console.log('RES', res);
                    return apply('', { ctx : res });
                    // return applyCtx(res);
                });
            }) :
            apply('', { ctx : content });
    }
    return this.ctx;
});

content()(function() {
    return this.ctx.content;
});

}.toString().replace(/^function\s*\(\)\s*{|}$/g, ''); // module.exports
