import Transformer from './Transformer';

import classTransform from './transform/class';
import templateTransform from './transform/template';
import arrowTransform from './transform/arrow';
import arrowReturnTransform from './transform/arrowReturn';
import letTransform from './transform/let';
import defaultParamTransform from './transform/defaultParam';
import destructParamTransform from './transform/destructParam';
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
  'arrow-return': arrowReturnTransform,
  'let': letTransform,
  'default-param': defaultParamTransform,
  'destruct-param': destructParamTransform,
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
 * Factory for creating a Transformer
 * by just specifying the names of the transforms.
 * @param  {String[]} transformNames
 * @return {Transformer}
 */
export default function createTransformer(transformNames) {
  validate(transformNames);
  return new Transformer(transformNames.map(name => transformsMap[name]));
}

function validate(transformNames) {
  transformNames.forEach(name => {
    if (!transformsMap[name]) {
      throw `Unknown transform "${name}".`;
    }
  });
}
