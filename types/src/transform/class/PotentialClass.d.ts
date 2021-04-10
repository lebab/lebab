/**
 * Represents a potential class to be created.
 */
export default class PotentialClass {
    /**
     * @param {Object} cfg
     *   @param {String} cfg.name Class name
     *   @param {Object} cfg.fullNode Node to remove after converting to class
     *   @param {Object[]} cfg.commentNodes Nodes to extract comments from
     *   @param {Object} cfg.parent
     */
    constructor({ name, fullNode, commentNodes, parent }: {
        name: string;
        fullNode: any;
        commentNodes: any[];
        parent: any;
    });
    name: string;
    constructor: any;
    fullNode: any;
    superClass: Node;
    commentNodes: any[];
    parent: any;
    methods: any[];
    replacements: any[];
    /**
     * Returns the name of the class.
     * @return {String}
     */
    getName(): string;
    /**
     * Returns the AST node for the original function
     * @return {Object}
     */
    getFullNode(): any;
    /**
     * Set the constructor.
     * @param {PotentialMethod} method.
     */
    setConstructor(method: any): void;
    /**
     * Set the superClass and set up the related assignment expressions to be
     * removed during transformation.
     * @param {Node} superClass           The super class node.
     * @param {Node[]} relatedExpressions The related expressions to be removed
     *                                    during transformation.
     */
    setSuperClass(superClass: Node, relatedExpressions: Node[]): void;
    /**
     * Adds method to class.
     * @param {PotentialMethod} method
     */
    addMethod(method: any): void;
    /**
     * True when class has at least one method (besides constructor).
     * @return {Boolean}
     */
    isTransformable(): boolean;
    /**
     * Replaces original constructor function and manual prototype assignments
     * with ClassDeclaration.
     */
    transform(): void;
    toClassDeclaration(): {
        type: string;
        superClass: Node;
        id: {
            type: string;
            name: string;
        };
        body: {
            type: string;
            body: any;
        };
        comments: any;
    };
    createMethods(): any;
    createConstructor(): any;
}
