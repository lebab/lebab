/**
 * Base class for Function- and BlockScope.
 *
 * Subclasses implement:
 *
 * - register() for adding variables to scope
 * - findFunctionScoped() for finding function-scoped vars
 * - findBlockScoped() for finding block-scoped vars
 */
export default class Scope {
    /**
     * @param  {Scope} parent Parent scope (if any).
     */
    constructor(parent: Scope);
    parent: Scope;
    vars: any;
    /**
     * Returns parent scope (possibly undefined).
     * @return {Scope}
     */
    getParent(): Scope;
    /**
     * Returns all variables registered in this scope.
     * @return {Variable[]}
     */
    getVariables(): any[];
}
