/**
 * Container for function-scoped variables.
 */
export default class FunctionScope extends Scope {
    /**
     * Registers a variable in function scope.
     *
     * All variables (including function name and params) are first
     * registered as function scoped, during hoisting phase.
     * Later thay can also be registered in block scope.
     *
     * Ignores attempts to register the same variable twice.
     *
     * @param  {String} name Variable name
     * @param  {Variable} variable Variable object
     */
    register(name: string, variable: any): void;
    /**
     * Looks up variable from function scope.
     * (Either from this function scope or from any parent function scope.)
     *
     * @param  {String} name Variable name
     * @return {Variable} The found variable or false
     */
    findFunctionScoped(name: string): any;
    /**
     * Looks up variable from block scope.
     * (i.e. the parent block scope of the function scope.)
     *
     * When variable found from function scope instead,
     * returns false to signify it's not properly block-scoped.
     *
     * @param  {String} name Variable name
     * @return {Variable} The found variable or false
     */
    findBlockScoped(name: string): any;
}
import Scope from "./Scope";
