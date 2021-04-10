/**
 * Labels variables in relation to their use in block scope.
 *
 * When variable is declared/modified/referenced not according to
 * block scoping rules, it'll be marked hoisted.
 */
export default class VariableMarker {
    /**
     * @param  {ScopeManager} scopeManager
     */
    constructor(scopeManager: any);
    scopeManager: any;
    /**
     * Marks set of variables declared in current block scope.
     *
     * Takes an array of variable names to support the case of declaring
     * multiple variables at once with a destructuring operation.
     *
     * - Not valid block var when already declared before.
     *
     * @param  {String[]} varNames
     */
    markDeclared(varNames: string[]): void;
    /**
     * Marks variable modified in current block scope.
     *
     * - Not valid block var when not declared in current block scope.
     *
     * @param  {String} varName
     */
    markModified(varName: string): void;
    /**
     * Marks variable referenced in current block scope.
     *
     * - Not valid block var when not declared in current block scope.
     *
     * @param  {String} varName
     */
    markReferenced(varName: string): void;
    getScope(): any;
}
