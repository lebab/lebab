/**
 * Provides a way to look up parent nodes.
 */
export default class Hierarchy {
    /**
     * @param {Object} ast Root node
     */
    constructor(ast: any);
    parents: any;
    /**
     * Returns parent node of given AST node.
     * @param {Object} node
     * @return {Object}
     */
    getParent(node: any): any;
}
