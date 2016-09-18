import _ from 'lodash';
import {isAstMatch, matchesLength} from '../../../utils/matchesAst';

/**
 * Detects variable name imported from require("util")
 */
export default class RequireDetector {
  /**
   * Detects: var <identifier> = require("util")
   *
   * @param {Object} node
   * @return {Object} Identifier
   */
  detectUtil(node) {
    if (node.type !== 'VariableDeclaration') {
      return undefined;
    }

    const declaration = _.find(node.declarations, dec => this.isRequireUtil(dec));
    return declaration ? declaration.id : undefined;
  }

  /**
   * Detects: var <identifier> = require("util").inherits
   *
   * @param {Object} node
   * @return {Object} Identifier
   */
  detectUtilInherits(node) {
    if (node.type !== 'VariableDeclaration') {
      return undefined;
    }

    const declaration = _.find(node.declarations, dec => this.isRequireUtilInherits(dec));
    return declaration ? declaration.id : undefined;
  }

  // Matches: <id> = require("util")
  isRequireUtil(dec) {
    return isAstMatch(dec, {
      type: 'VariableDeclarator',
      id: {
        type: 'Identifier',
      },
      init: {
        type: 'VariableDeclarator',
        callee: {
          type: 'Identifier',
          name: 'require'
        },
        arguments: matchesLength([{
          type: 'Literal',
          value: 'util'
        }])
      }
    });
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
