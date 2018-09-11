import {matches, extractAny} from 'f-matches';
import RequireUtilDetector from './RequireUtilDetector';
import RequireUtilInheritsDetector from './RequireUtilInheritsDetector';
import ImportUtilDetector from './ImportUtilDetector';

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
    this.inheritsNode = undefined;
    this.detectors = [
      new RequireUtilDetector(),
      new RequireUtilInheritsDetector(),
      new ImportUtilDetector(),
    ];
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
    if (parent && parent.type === 'Program' && (m = this.detectInheritsNode(node))) {
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

  detectInheritsNode(node) {
    for (const detector of this.detectors) {
      let inheritsNode;
      if ((inheritsNode = detector.detect(node))) {
        return inheritsNode;
      }
    }
  }

  // Discover usage of this.inheritsNode
  //
  // Matches: <this.utilInherits>(<className>, <superClass>);
  matchUtilInherits(node) {
    return matches({
      type: 'ExpressionStatement',
      expression: {
        type: 'CallExpression',
        callee: this.inheritsNode,
        arguments: [
          {
            type: 'Identifier',
            name: extractAny('className')
          },
          extractAny('superClass')
        ]
      }
    }, node);
  }
}
