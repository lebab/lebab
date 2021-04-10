/**
 * Encapsulates a VariableDeclaration node
 * and a list of Variable objects declared by it.
 *
 * PS. Named VariableGroup not VariableDeclaration to avoid confusion with syntax class.
 */
export default class VariableGroup {
    /**
     * @param  {VariableDeclaration} node AST node
     * @param  {Object} parentNode Parent AST node (pretty much any node)
     */
    constructor(node: any, parentNode: any);
    node: any;
    parentNode: any;
    variables: any[];
    /**
     * Adds a variable to this group.
     * @param {Variable} variable
     */
    add(variable: any): void;
    /**
     * Returns all variables declared in this group.
     * @return {Variable[]}
     */
    getVariables(): any[];
    /**
     * Returns the `kind` value of variable defined in this group.
     *
     * When not all variables are of the same kind, returns undefined.
     *
     * @return {String} Either "var", "let", "const" or undefined.
     */
    getCommonKind(): string;
    /**
     * Returns the most restrictive possible common `kind` value
     * for variables defined in this group.
     *
     * - When all vars are const, return "const".
     * - When some vars are "let" and some "const", returns "let".
     * - When some vars are "var", return "var".
     *
     * @return {String} Either "var", "let" or "const".
     */
    getMostRestrictiveKind(): string;
    /**
     * Returns the AST node
     * @return {VariableDeclaration}
     */
    getNode(): any;
    /**
     * Returns the parent AST node (which can be pretty much anything)
     * @return {Object}
     */
    getParentNode(): any;
}
