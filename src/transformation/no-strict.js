import estraverse from 'estraverse';
import typeChecker from '../utils/type-checker.js';

export default
  function (ast) {
    estraverse.replace(ast, {
      enter: removeUseStrict
    });
  }

function removeUseStrict(node) {
  if (node.type === 'ExpressionStatement' && isUseStrictString(node.expression)) {
    this.remove();
  }
}

function isUseStrictString(node) {
  return typeChecker.isString(node) && node.value === 'use strict';
}
