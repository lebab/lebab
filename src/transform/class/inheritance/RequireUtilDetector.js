import {find} from 'lodash/fp';
import {matches, matchesLength} from 'f-matches';

/**
 * Detects variable name imported from require("util")
 */
export default class RequireUtilDetector {
  /**
   * Detects: var <identifier> = require("util")
   *
   * @param {Object} node
   * @return {Object} MemberExpression of <identifier>.inherits
   */
  detect(node) {
    if (node.type !== 'VariableDeclaration') {
      return;
    }

    const declaration = find(dec => this.isRequireUtil(dec), node.declarations);
    if (declaration) {
      return {
        type: 'MemberExpression',
        computed: false,
        object: {
          type: 'Identifier',
          name: declaration.id.name,
        },
        property: {
          type: 'Identifier',
          name: 'inherits'
        }
      };
    }
  }

  // Matches: <id> = require("util")
  isRequireUtil(dec) {
    return matches({
      type: 'VariableDeclarator',
      id: {
        type: 'Identifier',
      },
      init: {
        type: 'CallExpression',
        callee: {
          type: 'Identifier',
          name: 'require'
        },
        arguments: matchesLength([{
          type: 'Literal',
          value: 'util'
        }])
      }
    }, dec);
  }
}
