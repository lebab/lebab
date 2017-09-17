import {values} from 'lodash/fp';

/**
 * Base class for Function- and BlockScope.
 *
 * Subclasses implement:
 *
 * - register() for adding variables to scope
 * - findFunctionScoped() for finding function-scoped vars
 * - findBlockScoped() for finding block-scoped vars
 */
export default
class Scope {
  /**
   * @param  {Scope} parent Parent scope (if any).
   */
  constructor(parent) {
    this.parent = parent;
    this.vars = Object.create(null); // eslint-disable-line no-null/no-null
  }

  /**
   * Returns parent scope (possibly undefined).
   * @return {Scope}
   */
  getParent() {
    return this.parent;
  }

  /**
   * Returns all variables registered in this scope.
   * @return {Variable[]}
   */
  getVariables() {
    return values(this.vars);
  }
}
