/**
 * Container for block-scoped variables.
 */
export default class BlockScope extends Scope {
    /**
     * Registers variable in block scope.
     *
     * (All variables are first registered in function scope.)
     *
     * @param  {String} name Variable name
     * @param  {Variable} variable Variable object
     */
    register(name: string, variable: any): void;
    /**
     * Looks up variable from function scope.
     *
     * Traveling up the scope chain until reaching a function scope.
     *
     * @param  {String} name Variable name
     * @return {Variable} The found variable or false
     */
    findFunctionScoped(name: string): any;
    /**
     * Looks up variable from block scope.
     *
     * Either from the current block, or any parent block.
     * When variable found from function scope instead,
     * returns false to signify it's not properly block-scoped.
     *
     * @param  {String} name Variable name
     * @return {Variable} The found variable or false
     */
    findBlockScoped(name: string): any;
}
import Scope from "./Scope";
