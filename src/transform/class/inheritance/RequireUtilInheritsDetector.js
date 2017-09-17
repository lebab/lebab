import {find} from 'lodash/fp';
import {isAstMatch, matchesLength} from '../../../utils/matchesAst';

/**
 * Detects variable name imported from require("util").inherits
 */
export default class RequireUtilInheritsDetector {
  /**
   * Detects: var <identifier> = require("util").inherits
   *
   * @param {Object} node
   * @return {Object} Identifier
   */
  detect(node) {
    if (node.type !== 'VariableDeclaration') {
      return;
    }

    const declaration = find(dec => this.isRequireUtilInherits(dec), node.declarations);
    if (declaration) {
      return {
        type: 'Identifier',
        name: declaration.id.name,
      };
    }
  }

  // Matches: <id> = require("util").inherits
  isRequireUtilInherits(dec) {
    return isAstMatch(dec, {
      type: 'VariableDeclarator',
      id: {
        type: 'Identifier',
      },
      init: {
        type: 'MemberExpression',
        computed: false,
        object: {
          type: 'CallExpression',
          callee: {
            type: 'Identifier',
            name: 'require'
          },
          arguments: matchesLength([{
            type: 'Literal',
            value: 'util'
          }])
        },
        property: {
          type: 'Identifier',
          name: 'inherits'
        }
      }
    });
  }
}
