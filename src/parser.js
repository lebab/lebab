import espree from 'esprima';

/**
 * An Esprima-compatible parser with JSX parsing enabled.
 */
export default {
  parse(js, opts) {
    return espree.parse(js, Object.assign({ecmaFeatures: {jsx: true}}, opts));
  }
};
