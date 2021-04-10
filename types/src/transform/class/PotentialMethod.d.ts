/**
 * Represents a potential class method to be created.
 */
export default class PotentialMethod {
    /**
     * @param {Object} cfg
     *   @param {String} cfg.name Method name
     *   @param {Object} cfg.methodNode
     *   @param {Object} cfg.fullNode Node to remove after converting to class
     *   @param {Object[]} cfg.commentNodes Nodes to extract comments from
     *   @param {Object} cfg.parent
     *   @param {String} cfg.kind Either 'get' or 'set' (optional)
     *   @param {Boolean} cfg.static True to make static method (optional)
     */
    constructor(cfg: {
        name: string;
        methodNode: any;
        fullNode: any;
        commentNodes: any[];
        parent: any;
        kind: string;
        static: boolean;
    });
    name: string;
    methodNode: any;
    fullNode: any;
    commentNodes: any[];
    parent: any;
    kind: string;
    static: boolean;
    /**
     * Sets the superClass node.
     * @param {Node} superClass
     */
    setSuperClass(superClass: Node): void;
    superClass: Node;
    /**
     * True when method body is empty.
     * @return {Boolean}
     */
    isEmpty(): boolean;
    /**
     * Transforms the potential method to actual MethodDefinition node.
     * @return {MethodDefinition}
     */
    toMethodDefinition(): any;
    /**
     * Removes original prototype assignment node from AST.
     */
    remove(): void;
    getBody(): any;
    getBodyBlock(): any;
    transformSuperCalls(body: any): any;
    matchSuperCall(node: any, ...args: any[]): any;
}
