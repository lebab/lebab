import espree from 'espree';

const ESPREE_OPTS = {
  ecmaVersion: 12,
  ecmaFeatures: {jsx: true},
  comment: true,
  tokens: true
};

/**
 * An Esprima-compatible parser with JSX and object rest/spread parsing enabled.
 */
export default {
  parse(js, opts) {
    return espree.parse(js, {...opts, ...ESPREE_OPTS});
  },
  tokenize(js, opts) {
    return espree.tokenize(js, {...opts, ...ESPREE_OPTS});
  },
};
