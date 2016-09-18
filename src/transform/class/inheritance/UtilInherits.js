import {isAstMatch, extract} from '../../../utils/matchesAst';
import RequireDetector from './RequireDetector';

/**
 * Processes nodes to detect super classes and return information for later
 * transformation.
 *
 * Detects:
 *
 *   var util = require('util');
 *   ...
 *   util.inherits(Class1, Class2);
 */
export default class UtilInherits {
  constructor() {
    this.detector = new RequireDetector();
    this.inheritsNode = undefined;
  }

  /**
   * Process a node and return inheritance details if found.
   * @param {Object} node
   * @param {Object} parent
   * @returns {Object/undefined} m
   *                    {String}   m.className
   *                    {Node}     m.superClass
   *                    {Object[]} m.relatedExpressions
   */
  process(node, parent) {
    let m;
    if ((m = this.detector.detectUtil(node)) && parent.type === 'Program') {
      this.inheritsNode = m;
    }
    else if ((m = this.detector.detectUtilInherits(node)) && parent.type === 'Program') {
      this.inheritsNode = m;
    }
    else if (this.inheritsNode && (m = this.matchUtilInherits(node))) {
      return {
        className: m.className,
        superClass: m.superClass,
        relatedExpressions: [{node, parent}]
      };
    }
  }

  // Discover usage of this.inheritsNode
  //
  // Matches: <this.utilInherits>(<className>, <superClass>);
  matchUtilInherits(node) {
    return isAstMatch(node, {
      type: 'ExpressionStatement',
      expression: {
        type: 'CallExpression',
        callee: this.inheritsNode,
        arguments: [
          {
            type: 'Identifier',
            name: extract('className')
          },
          extract('superClass')
        ]
      }
    });
  }
}
