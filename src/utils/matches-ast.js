import _ from 'lodash';

/**
 * Creates a function that matches AST against the given pattern,
 *
 * Similar to LoDash.matches(), but with the addition that a Function
 * can be provided to assert various conditions e.g. checking
 * that an array must be of a specific length.
 *
 * Additionally the utility extract() can be used to give names to
 * the parts of AST - these are then returned as a map of key-value
 * pairs.
 *
 * @param  {Object}  pattern
 * @return {Function} Function that returns an object with
 * extracted fields or false when no match found.
 */
export function matchesAst(pattern) {
  return (ast) => {
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
  };
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
    let extractedFields = {[fieldName]: ast};

    if (typeof matcher === 'object') {
      matcher = matchesAst(matcher);
    }

    if (typeof matcher === 'function') {
      let result = matcher(ast);
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

export default matchesAst;
