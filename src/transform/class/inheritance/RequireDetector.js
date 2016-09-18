import _ from 'lodash';
import {isAstMatch, matchesLength} from '../../../utils/matchesAst';
import isVarWithRequireCalls from '../../../utils/isVarWithRequireCalls';

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
    if (!isVarWithRequireCalls(node)) {
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
    if (!isVarWithRequireCalls(node)) {
      return undefined;
    }

    const declaration = _.find(node.declarations, dec => this.isRequireUtilInherits(dec));
    return declaration ? declaration.id : undefined;
  }

  // Matches: <id> = require("util")
  isRequireUtil(dec) {
    return isAstMatch(dec, {
      init: {
        callee: {
          name: 'require'
        },
        arguments: matchesLength([{
          value: 'util'
        }])
      }
    });
  }

  // Matches: <id> = require("util").inherits
  isRequireUtilInherits(dec) {
    return isAstMatch(dec, {
      init: {
        object: {
          callee: {
            name: 'require'
          },
          arguments: matchesLength([{
            value: 'util'
          }])
        },
        property: {
          name: 'inherits'
        }
      }
    });
  }
}
