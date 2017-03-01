import {isMinusOne, isZero} from './matchesIndexOf';

/**
 * True when indexOf() comparison can be translated to includes()
 * @param {Object} matches
 * @return {Boolean}
 */
export function isIncludesIndexOfComparison({operator, index}) {
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
export function isNotIncludesIndexOfComparison({operator, index}) {
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

/**
 * True when filter().length comparison can be translated to includes()
 * @param {Object} matches
 * @return {Boolean}
 */
export function isIncludesFilterLengthComparison({operator, index}) {
  switch (operator) {
  case '!==':
  case '!=':
  case '>':
    return isZero(index);
  default:
    return false;
  }
}

/**
 * True when filter().length comparison can be translated to !includes()
 * @param {Object} matches
 * @return {Boolean}
 */
export function isNotIncludesFilterLengthComparison({operator, index}) {
  switch (operator) {
  case '===':
  case '==':
    return isZero(index);
  default:
    return false;
  }
}
