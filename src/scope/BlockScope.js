import Scope from './Scope';

/**
 * Container for block-scoped variables.
 */
export default
class BlockScope extends Scope {
  /**
   * Registers variables in block scope.
   *
   * (All variables are first registered in function scope.)
   *
   * @param  {String} name Variable name
   * @param  {Variable} variable Variable object
   */
  register(name, variable) {
    if (!this.vars[name]) {
      this.vars[name] = [];
    }
    this.vars[name].push(variable);
  }

  /**
   * Looks up variables from function scope.
   *
   * Traveling up the scope chain until reaching a function scope.
   *
   * @param  {String} name Variable name
   * @return {Variable[]} The found variables (empty array if none found)
   */
  findFunctionScoped(name) {
    return this.parent.findFunctionScoped(name);
  }

  /**
   * Looks up variables from block scope.
   *
   * Either from the current block, or any parent block.
   * When variable found from function scope instead,
   * returns empty array to signify it's not properly block-scoped.
   *
   * @param  {String} name Variable name
   * @return {Variable[]} The found variables (empty array if none found)
   */
  findBlockScoped(name) {
    if (this.vars[name]) {
      return this.vars[name];
    }
    return this.parent.findBlockScoped(name);
  }
}
