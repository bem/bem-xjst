'use strict';
/**
 * @typedef BucketsConf
 * @property {Number} left Left boundary of buckets definition, inclusive
 * @property {Number} right Right boundary of buckets definition, exclusive
 * @property {Number} precision Buckets precision
 */

class BucketsDef {
    constructor(conf) {
        this._left = conf.left;
        this._right = conf.right;
        this._precision = conf.precision;
    }

    includes(value) {
        return this._left <= value && this._right > value;
    }

    getRightBoundFor(value) {
        //return Math.ceil(value / this._precision) * this._precision;
        return value + (this._precision - value % this._precision);
    }
}

class Histogram {
    /**
     * @param {BucketsConf[]} conf
     */
    constructor(conf) {
        this._buckets = new Map();
        this._bdefs = conf.map(c => new BucketsDef(c));
    }

    update(value) {
        // find buckets interval definition
        const bucketsDef = this._bdefs.find(bd => bd.includes(value));
        if (!bucketsDef) return;
        // calc right boundary of bucket corresponding to the value
        const bucketRight = bucketsDef.getRightBoundFor(value);
        // upsert bucket hits count
        let hits = this._buckets.get(bucketRight) || 0;
        this._buckets.set(bucketRight, ++hits);
    }

    snapshot() {
        const snapshot = Array.from(this._buckets.entries());
        snapshot.sort((l, r)=> l[0] - r[0]);
        return snapshot;
    }
}

class Counter {
    constructor(value) {
        this._value = value || 0;
    }

    incr(value) {
        this._value += value;
    }

    snapshot() {
        return this._value;
    }
}

class Gauge {
    constructor(value) {
        this._value = value || 0;
    }

    update(value) {
        this._value = value;
    }

    snapshot() {
        return this._value;
    }
}

const has = (obj, prop)=> Object.prototype.hasOwnProperty.call(obj, prop);

class Registry {
    /**
     * @param {Object<string,BucketsConf[]>} histogramConfs
     */
    constructor(histogramConfs) {
        this._metrics = new Map();
        this._histogramConfs = histogramConfs;
    }

    _getHistogramConf(name) {
        return has(this._histogramConfs, name)
            ? this._histogramConfs[name]
            : this._histogramConfs.$default;
    }

    /**
     * @param {String} name
     * @param {Number} value
     * @throws Error If mertic `name` exists, but is not a histogram.
     */
    updateHistogram(name, value) {
        const m = this._metrics.get(name);
        if (m instanceof Histogram) {
            m.update(value);
        } else if (m === undefined) {
            const h = new Histogram(this._getHistogramConf(name));
            h.update(value);
            this._metrics.set(name, h);
        } else {
            throw new Error(`Metric "${name}" is exist, but is not a histogram`);
        }
    }

    /**
     * @param {String} name
     * @throws Error If mertic `name` exists, but is not a counter.
     */
    incrCounter(name, value) {
        const m = this._metrics.get(name);
        if (m instanceof Counter) {
            m.incr(value);
        } else if (m === undefined) {
            this._metrics.set(name, new Counter(value));
        } else {
            throw new Error(`Metric "${name}" is exist, but is not a counter`);
        }
    }

    /**
     * @param {String} name
     * @param {Number} value
     * @throws Error If mertic `name` exists, but is not a gauge.
     */
    updateGauge(name, value) {
        const m = this._metrics.get(name);
        if (m instanceof Gauge) {
            m.update(value);
        } else if (m === undefined) {
            this._metrics.set(name, new Gauge(value));
        } else {
            throw new Error(`Metric "${name}" is exist, but is not a gauge`);
        }
    }

    /**
     * @see {@link https://wiki.yandex-team.ru/jandekspoisk/sepe/monitoring/stat-handle/#json} for output format description
     */
    snapshot() {
        const snapshot = [];
        // m[0] => key, m[1] => value
        for (const m of this._metrics) {
            snapshot.push([m[0], m[1].snapshot()]);
        }
        return snapshot;
    }
}

module.exports = {
    Registry,
};
