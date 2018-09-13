/**
 * Adapter for handling of parameter together with its default value
 */
export default class Parameter {
  constructor(fn, param) {
    this.fn = fn;
    this.param = param;
    this.index = fn.params.indexOf(param);
  }

  name() {
    return this.param.name;
  }

  isIdentifier() {
    return this.param.type === 'Identifier';
  }

  setDefault(value) {
    this.fn.defaults = this.fn.defaults || [];
    this.fn.defaults[this.index] = value;
  }

  remainingParams() {
    return this.fn.params.slice(this.index);
  }
}
