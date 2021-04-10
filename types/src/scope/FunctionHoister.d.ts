/**
 * Registers all variables defined inside a function.
 * Emulating ECMAScript variable hoisting.
 */
export default class FunctionHoister {
    /**
     * Instantiates hoister with a function scope where to
     * register the variables that are found.
     * @param  {FunctionScope} functionScope
     */
    constructor(functionScope: any);
    functionScope: any;
    /**
     * Performs the hoisting of a function name, params and variables.
     *
     * @param {Object} cfg
     *   @param {Identifier} cfg.id Optional function name
     *   @param {Identifier[]} cfg.params Optional function parameters
     *   @param {Object} cfg.body Function body node or Program node to search variables from.
     */
    hoist({ id, params, body }: {
        id: any;
        params: any[];
        body: any;
    }): void;
    hoistFunctionId(id: any): void;
    hoistFunctionParams(params: any): any;
    registerParam(p: any): void;
    hoistVariables(ast: any): void;
    hoistVariableDeclaration(node: any, parent: any): void;
}
