import espree from 'espree';

const ESPREE_OPTS = {
  ecmaVersion: 8,
  ecmaFeatures: {jsx: true, experimentalObjectRestSpread: true}
};

/**
 * An Esprima-compatible parser with JSX and object rest/spread parsing enabled.
 */
export default {
  parse(js, opts) {
    return espree.parse(js, Object.assign({}, opts, ESPREE_OPTS));
  },
  tokenize(js, opts) {
    return espree.tokenize(js, Object.assign({}, opts, ESPREE_OPTS));
  },
};
