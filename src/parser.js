import _ from 'lodash';
import espree from 'espree';

/**
 * An Esprima-compatible parser with JSX parsing enabled.
 */
export default {
  parse(js, opts) {
    return espree.parse(js, _.assign({ecmaFeatures: {jsx: true}}, opts));
  }
};
