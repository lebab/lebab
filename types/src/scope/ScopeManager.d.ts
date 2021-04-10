/**
 * Keeps track of the current function/block scope.
 */
export default class ScopeManager {
    scope: any;
    /**
     * Enters new function scope
     */
    enterFunction(): void;
    /**
     * Enters new block scope
     */
    enterBlock(): void;
    /**
     * Leaves the current scope.
     */
    leaveScope(): void;
    /**
     * Returns the current scope.
     * @return {FunctionScope|BlockScope}
     */
    getScope(): FunctionScope | BlockScope;
}
import FunctionScope from "../scope/FunctionScope";
import BlockScope from "../scope/BlockScope";
