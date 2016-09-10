import {isMinusOne, isZero} from './matchesIndexOf';

/**
 * True when indexOf() comparison can be translated to includes()
 * @param {Object} matches
 * @return {Boolean}
 */
export function isIncludesComparison({operator, index}) {
  switch (operator) {
  case '!==':
  case '!=':
  case '>':
    return isMinusOne(index);
  case '>=':
    return isZero(index);
  default:
    return false;
  }
}

/**
 * True when indexOf() comparison can be translated to !includes()
 * @param {Object} matches
 * @return {Boolean}
 */
export function isNotIncludesComparison({operator, index}) {
  switch (operator) {
  case '===':
  case '==':
    return isMinusOne(index);
  case '<':
    return isZero(index);
  default:
    return false;
  }
}
