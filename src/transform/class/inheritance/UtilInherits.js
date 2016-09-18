import {isAstMatch, extract} from '../../../utils/matchesAst';
import isEqualAst from '../../../utils/isEqualAst';
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
    this.utilNode = undefined;
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
      this.utilNode = m;
    }
    else if ((m = this.detector.detectUtilInherits(node)) && parent.type === 'Program') {
      this.inheritsNode = m;
    }
    else if ((m = this.matchUtilInherits(node))) {
      return {
        className: m.className,
        superClass: m.superClass,
        relatedExpressions: [{node, parent}]
      };
    }
  }

  // Discover usage of this.utilNode or this.inheritsNode
  //
  // Matches: util.inherits(<className>, <superClass>);
  // Matches: inherits(<className>, <superClass>);
  matchUtilInherits(node) {
    return isAstMatch(node, {
      type: 'ExpressionStatement',
      expression: {
        type: 'CallExpression',
        callee: (callee) => this.isUtilInherits(callee) || this.isInherits(callee),
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

  // Matches: inherits
  isInherits(callee) {
    return this.inheritsNode && isEqualAst(callee, this.inheritsNode);
  }

  // Matches: util.inherits
  isUtilInherits(callee) {
    return this.utilNode && isAstMatch(callee, {
      type: 'MemberExpression',
      object: (obj) => isEqualAst(obj, this.utilNode),
      property: {
        type: 'Identifier',
        name: 'inherits'
      }
    });
  }
}
