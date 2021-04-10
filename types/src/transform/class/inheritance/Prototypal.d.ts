/**
 * Processes nodes to detect super classes and return information for later
 * transformation.
 *
 * Detects:
 *
 *   Class1.prototype = Object.create(Class2.prototype);
 *
 * or:
 *
 *   Class1.prototype = new Class2();
 *
 * optionally followed by:
 *
 *   Class1.prototype.constructor = Class1;
 */
export default class Prototypal {
    foundSuperclasses: {};
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
    matchNewAssignment(node: any): any;
    matchObjectCreateAssignment(node: any, ...args: any[]): any;
    matchConstructorAssignment(node: any): any;
}
