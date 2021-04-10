declare namespace _default {
    /**
     * Traverses AST like ESTraverse.traverse()
     * @param  {Object} tree
     * @param  {Object} cfg Object with optional enter() and leave() methods.
     * @return {Object} The transformed tree
     */
    function traverse(tree: any, cfg: any): any;
    /**
     * Traverses AST like ESTraverse.traverse()
     * @param  {Object} tree
     * @param  {Object} cfg Object with optional enter() and leave() methods.
     * @return {Object} The transformed tree
     */
    function traverse(tree: any, cfg: any): any;
    /**
     * Traverses AST like ESTraverse.replace()
     * @param  {Object} tree
     * @param  {Object} cfg Object with optional enter() and leave() methods.
     * @return {Object} The transformed tree
     */
    function replace(tree: any, cfg: any): any;
    /**
     * Traverses AST like ESTraverse.replace()
     * @param  {Object} tree
     * @param  {Object} cfg Object with optional enter() and leave() methods.
     * @return {Object} The transformed tree
     */
    function replace(tree: any, cfg: any): any;
    const VisitorOption: any;
    /**
     * Searches in AST tree for node which satisfies the predicate.
     * @param  {Object} tree
     * @param  {Function|String} query Search function called with `node` and `parent`
     *   Alternatively it can be string: the node type to search for.
     * @param  {String[]} opts.skipTypes List of node types to skip (not traversing into these nodes)
     * @return {Object} The found node or undefined when not found
     */
    function find(tree: any, query: string | Function, { skipTypes }?: string[]): any;
    /**
     * Searches in AST tree for node which satisfies the predicate.
     * @param  {Object} tree
     * @param  {Function|String} query Search function called with `node` and `parent`
     *   Alternatively it can be string: the node type to search for.
     * @param  {String[]} opts.skipTypes List of node types to skip (not traversing into these nodes)
     * @return {Object} The found node or undefined when not found
     */
    function find(tree: any, query: string | Function, { skipTypes }?: string[]): any;
    function createFindPredicate(query: any): any;
    function createFindPredicate(query: any): any;
}
export default _default;
