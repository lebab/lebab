import Transformer from './Transformer';

import classTransform from './transform/class';
import templateTransform from './transform/template';
import arrowTransform from './transform/arrow';
import letTransform from './transform/let';
import defaultParamTransform from './transform/defaultParam';
import argSpreadTransform from './transform/argSpread';
import argRestTransform from './transform/argRest';
import objMethodTransform from './transform/objMethod';
import objShorthandTransform from './transform/objShorthand';
import noStrictTransform from './transform/noStrict';
import commonjsTransform from './transform/commonjs';
import exponentTransform from './transform/exponent';
import multiVarTransform from './transform/multiVar';
import forOfTransform from './transform/forOf';
import forEachTransform from './transform/forEach';
import includesTransform from './transform/includes';

const transformsMap = {
  'class': classTransform,
  'template': templateTransform,
  'arrow': arrowTransform,
  'let': letTransform,
  'default-param': defaultParamTransform,
  'arg-spread': argSpreadTransform,
  'arg-rest': argRestTransform,
  'obj-method': objMethodTransform,
  'obj-shorthand': objShorthandTransform,
  'no-strict': noStrictTransform,
  'commonjs': commonjsTransform,
  'exponent': exponentTransform,
  'multi-var': multiVarTransform,
  'for-of': forOfTransform,
  'for-each': forEachTransform,
  'includes': includesTransform,
};

/**
 * Central place for accessing all the builtin transforms
 */
export default {
  /**
   * Factori method for creating a Transformer
   * by just specifying the names of the transforms.
   * @param  {String[]} transformNames
   * @return {Transformer}
   */
  createTransformer(transformNames) {
    return new Transformer(transformNames.map(name => this.get(name)));
  },

  /**
   * Maps transform name to the actual transform function
   * @param  {String} name
   * @return {Function} the transform or undefined when no such transform
   */
  get(name) {
    return transformsMap[name];
  }
};
