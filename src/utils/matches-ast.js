import _ from 'lodash';

/**
 * Creates a function that matches AST against the given pattern,
 *
 * Just like _.matches(), but with the addition that a Function
 * can be provided to assert various conditions e.g. checking
 * that an array must be of a specific length.
 *
 * @param  {Object}  pattern
 * @return {Function}
 */
export default function(pattern) {
  return (ast) => {
    return _.isMatchWith(ast, pattern, (value, matcher) => {
      if (typeof matcher === 'function') {
        return matcher(value);
      }
    });
  };
}
