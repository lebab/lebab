import classTransform from './transform/class';
import templateTransform from './transform/template';
import arrowTransform from './transform/arrow';
import letTransform from './transform/let';
import defaultParamTransform from './transform/default-param';
import argSpreadTransform from './transform/arg-spread';
import objMethodTransform from './transform/obj-method';
import objShorthandTransform from './transform/obj-shorthand';
import noStrictTransform from './transform/no-strict';
import commonjsTransform from './transform/commonjs';
import exponentTransform from './transform/exponent';
import multiVarTransform from './transform/multi-var';
import forOfTransform from './transform/for-of';

const transformsMap = {
  'class': classTransform,
  'template': templateTransform,
  'arrow': arrowTransform,
  'let': letTransform,
  'default-param': defaultParamTransform,
  'arg-spread': argSpreadTransform,
  'obj-method': objMethodTransform,
  'obj-shorthand': objShorthandTransform,
  'no-strict': noStrictTransform,
  'commonjs': commonjsTransform,
  'exponent': exponentTransform,
  'multi-var': multiVarTransform,
  'for-of': forOfTransform,
};

/**
 * Central place for accessing all the builtin transforms
 */
export default {
  /**
   * Maps transform name to the actual transform function
   * @param  {String} name
   * @return {Function} the transform or undefined when no such transform
   */
  get(name) {
    return transformsMap[name];
  }
};
