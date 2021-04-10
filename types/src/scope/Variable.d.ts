/**
 * Encapsulates a single variable declaring AST node.
 *
 * It might be the actual VariableDeclarator node,
 * but it might also be a function parameter or -name.
 */
export default class Variable {
    /**
     * @param  {Object} node AST node declaring the variable.
     * @param  {VariableGroup} group The containing var-statement (if any).
     */
    constructor(node: any, group: any);
    node: any;
    group: any;
    declared: boolean;
    hoisted: boolean;
    modified: boolean;
    markDeclared(): void;
    isDeclared(): boolean;
    /**
     * Marks that the use of the variable is not block-scoped,
     * so it cannot be simply converted to `let` or `const`.
     */
    markHoisted(): void;
    /**
     * Marks that the variable is assigned to,
     * so it cannot be converted to `const`.
     */
    markModified(): void;
    /**
     * Returns the strictest possible kind-attribute value for this variable.
     *
     * @return {String} Either "var", "let" or "const".
     */
    getKind(): string;
    /**
     * Returns the AST node that declares this variable.
     * @return {Object}
     */
    getNode(): any;
    /**
     * Returns the containing var-statement (if any).
     * @return {VariableGroup}
     */
    getGroup(): any;
}
