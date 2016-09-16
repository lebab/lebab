import _ from 'lodash';

/**
 * Creates a function that matches AST against the given pattern,
 *
 * See: isAstMatch()
 *
 * @param  {Object} pattern Pattern to test against
 * @return {Function} Function that returns an object with
 * extracted fields or false when no match found.
 */
export function matchesAst(pattern) {
  return (ast) => isAstMatch(ast, pattern);
}

/**
 * Matches AST against the given pattern,
 *
 * Similar to LoDash.isMatch(), but with the addition that a Function
 * can be provided to assert various conditions e.g. checking that
 * number is within a certain range.
 *
 * Additionally there are utility functions:
 *
 * - extract() can be used to give names to the parts of AST -
 *   these are then returned as a map of key-value pairs.
 *
 * - matchesLength() ensures the exact array length is respected.
 *
 * @param  {Object} ast The AST node to test
 * @param {Object} pattern Pattern to test against
 * @return {Object/Boolean} an object with extracted fields
 * or false when no match found.
 */
export function isAstMatch(ast, pattern) {
  const extractedFields = {};

  const matches = _.isMatchWith(ast, pattern, (value, matcher) => {
    if (typeof matcher === 'function') {
      const result = matcher(value);
      if (typeof result === 'object') {
        _.assign(extractedFields, result);
      }
      return result;
    }
  });

  if (matches) {
    return extractedFields;
  }
  else {
    return false;
  }
}

/**
 * Utility for extracting values during matching with matchesAst()
 *
 * @param {String} fieldName The name to give for the value
 * @param {Function|Object} matcher Optional matching function or pattern for matchesAst()
 * @return {Function}
 */
export function extract(fieldName, matcher) {
  return (ast) => {
    const extractedFields = {[fieldName]: ast};

    if (typeof matcher === 'object') {
      matcher = matchesAst(matcher);
    }

    if (typeof matcher === 'function') {
      const result = matcher(ast);
      if (typeof result === 'object') {
        return _.assign(extractedFields, result);
      }
      if (!result) {
        return false;
      }
    }

    return extractedFields;
  };
}

/**
 * Utility for asserting that AST also matches the exact length
 * of the specified array pattern (in addition to matching
 * the first items in the array).
 *
 * @param {Array} pattern
 * @return {Function}
 */
export function matchesLength(pattern) {
  const matcher = matchesAst(pattern);

  return (ast) => {
    if (ast.length !== pattern.length) {
      return false;
    }
    return matcher(ast);
  };
}

export default matchesAst;
