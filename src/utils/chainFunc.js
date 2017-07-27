import filter from 'lodash/filter';
import forEach from 'lodash/forEach';
/**
 * A simple polyfill of a chained functions
 * based on lodash's chain and methods.
 * The goal of this is to atleast lessen the size
 * of our compiled project by not including the
 * bloated lodash module on each import.
 *
 * We should avoid the use of lodash's _.chain or _()
 * functions to minimize the size of our project.
 * https://medium.com/making-internets/why-using-chain-is-a-mistake-9bc1f80d51ba
 *
 * Also we should always use native js functions
 * as much as possible.
 *
 */
export default function chainFunc(b) {
  const o = {};
  o.base = b;
  const objectOmitProp = (obj, keys) => {
    const target = {};
    for (const i in obj) {
      if (keys.includes(i)) {
        continue; // eslint-disable-line no-continue
      }
      if (!Object.prototype.hasOwnProperty.call(obj, i)) {
        continue; // eslint-disable-line no-continue
      }
      target[i] = obj[i];
    }
    return target;
  };
  o.map = function(fn) {
    this.base = this.base.map(fn);
    return this;
  };
  o.mapValues = function(it) {
    const base = this.base;
    if (typeof it === 'function') {
      this.base = Object.assign(...Object.keys(base).map(k => ({[k]: it(base[k])})));
    }
    else {
      this.base = Object.assign(...Object.keys(base).map(k => ({[k]: base[k][it]})));
    }
    return this;
  };
  o.forEach = function(fn) {
    this.base = forEach(this.base,fn);
    return this;
  };
  o.filter = function(predicate) {
    this.base = filter(this.base, predicate);
    return this;
  };
  o.flatten = function() {
    this.base = this.base.reduce(
      (x, y) => x.concat(y), []
    );
    return this;
  };
  o.uniq = function() {
    this.base = [...new Set(this.base)];
    return this;
  };
  o.omit = function(...theArgs) {
    this.base = objectOmitProp(this.base, theArgs);
    return this;
  };
  o.compact = function() {
    this.base = this.base.filter(Boolean);
    return this;
  };
  o.value = function() {
    return this.base;
  };
  return o;
}
