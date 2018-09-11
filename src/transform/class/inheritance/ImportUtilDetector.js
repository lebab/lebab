import {matches, extractAny, matchesLength} from 'f-matches';

/**
 * Detects variable name imported from: import <name> from "util"
 */
export default class ImportUtilDetector {
  /**
   * Detects: import <identifier> from "util"
   *
   * @param {Object} node
   * @return {Object} MemberExpression of <identifier>.inherits
   */
  detect(node) {
    const m = this.matchImportUtil(node);
    if (m) {
      return {
        type: 'MemberExpression',
        computed: false,
        object: {
          type: 'Identifier',
          name: m.name,
        },
        property: {
          type: 'Identifier',
          name: 'inherits'
        }
      };
    }
  }

  // Matches: import <name> from "util"
  matchImportUtil(node) {
    return matches({
      type: 'ImportDeclaration',
      specifiers: matchesLength([
        {
          type: 'ImportDefaultSpecifier',
          local: {
            type: 'Identifier',
            name: extractAny('name')
          }
        }
      ]),
      source: {
        type: 'Literal',
        value: 'util'
      }
    }, node);
  }
}
