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
    inheritsNode: any;
    detectors: (RequireUtilDetector | RequireUtilInheritsDetector | ImportUtilDetector)[];
    /**
     * Process a node and return inheritance details if found.
     * @param {Object} node
     * @param {Object} parent
     * @returns {Object/undefined} m
     *                    {String}   m.className
     *                    {Node}     m.superClass
     *                    {Object[]} m.relatedExpressions
     */
    process(node: any, parent: any): any;
    detectInheritsNode(node: any): any;
    matchUtilInherits(node: any, ...args: any[]): any;
}
import RequireUtilDetector from "./RequireUtilDetector";
import RequireUtilInheritsDetector from "./RequireUtilInheritsDetector";
import ImportUtilDetector from "./ImportUtilDetector";
