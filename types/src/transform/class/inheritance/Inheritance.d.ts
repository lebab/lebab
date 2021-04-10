/**
 * Processes nodes to detect super classes and return information for later
 * transformation.
 */
export default class Inheritance {
    utilInherits: UtilInherits;
    prototypal: Prototypal;
    /**
     * Process a node and return inheritance details if found.
     * @param {Object} node
     * @param {Object} parent
     * @returns {Object}
     *            {String}   className
     *            {Node}     superClass
     *            {Object[]} relatedExpressions
     */
    process(node: any, parent: any): any;
}
import UtilInherits from "./UtilInherits";
import Prototypal from "./Prototypal";
