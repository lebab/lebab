import _ from 'lodash';
import espree from 'espree';

/**
 * An Esprima-compatible parser with JSX and object rest/spread parsing enabled.
 */
export default {
  parse(js, opts) {
    return espree.parse(js, _.assign(opts, {
      ecmaVersion: 8,
      ecmaFeatures: {jsx: true, experimentalObjectRestSpread: true}
    }));
  }
};
