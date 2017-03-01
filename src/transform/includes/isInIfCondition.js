import isEqualAst from '../../utils/isEqualAst';
import {matchesAst, extract} from '../../utils/matchesAst';

/**
 * True when node is the test expression of an if statement
 * @param {Object} matches
 * @return {Boolean}
 */
export default function(node, parent) {
  const matches = matchesAst({
    type: 'IfStatement',
    test: extract('test'),
  })(parent);

  return matches && isEqualAst(node, matches.test);
}

