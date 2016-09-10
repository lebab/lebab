import BlockScope from '../scope/BlockScope';
import FunctionScope from '../scope/FunctionScope';

/**
 * Keeps track of the current function/block scope.
 */
export default
class ScopeManager {
  constructor() {
    this.scope = undefined;
  }

  /**
   * Enters new function scope
   */
  enterFunction() {
    this.scope = new FunctionScope(this.scope);
  }

  /**
   * Enters new block scope
   */
  enterBlock() {
    this.scope = new BlockScope(this.scope);
  }

  /**
   * Leaves the current scope.
   */
  leaveScope() {
    this.scope = this.scope.getParent();
  }

  /**
   * Returns the current scope.
   * @return {FunctionScope|BlockScope}
   */
  getScope() {
    return this.scope;
  }
}
