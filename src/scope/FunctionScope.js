import Scope from './Scope';

/**
 * Container for function-scoped variables.
 */
export default
class FunctionScope extends Scope {
  /**
   * Registers variables in function scope.
   *
   * All variables (including function name and params) are first
   * registered as function scoped, during hoisting phase.
   * Later they can also be registered in block scope.
   *
   * @param  {String} name Variable name
   * @param  {Variable} variable Variable object
   */
  register(name, variable) {
    if (!this.vars[name]) {
      this.vars[name] = [variable];
    }
    this.vars[name].push(variable);
  }

  /**
   * Looks up variables from function scope.
   * (Either from this function scope or from any parent function scope.)
   *
   * @param  {String} name Variable name
   * @return {Variable[]} The found variables (empty array if none found)
   */
  findFunctionScoped(name) {
    if (this.vars[name]) {
      return this.vars[name];
    }
    if (this.parent) {
      return this.parent.findFunctionScoped(name);
    }
    return [];
  }

  /**
   * Looks up variables from block scope.
   * (i.e. the parent block scope of the function scope.)
   *
   * When variable found from function scope instead,
   * returns an empty array to signify it's not properly block-scoped.
   *
   * @param  {String} name Variable name
   * @return {Variable[]} The found variables (empty array if none found)
   */
  findBlockScoped(name) {
    if (this.vars[name]) {
      return [];
    }
    if (this.parent) {
      return this.parent.findBlockScoped(name);
    }
    return [];
  }
}
