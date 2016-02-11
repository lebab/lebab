/**
 * Labels variables in relation to their use in block scope.
 *
 * When variable is declared/modified/referenced not according to
 * block scoping rules, it'll be marked hoisted.
 */
export default
class VariableMarker {
  /**
   * @param  {ScopeManager} scopeManager
   */
  constructor(scopeManager) {
    this.scopeManager = scopeManager;
  }

  /**
   * Marks variable declared in current block scope.
   *
   * - Not valid block var when already declared before.
   *
   * @param  {String} varName
   */
  markDeclared(varName) {
    const blockVar = this.getScope().findFunctionScoped(varName);

    // Ignore repeated var declarations
    if (blockVar.isDeclared()) {
      blockVar.markHoisted();
      return;
    }

    // Remember that it's declared and register in current block scope
    blockVar.markDeclared();
    this.getScope().register(varName, blockVar);
  }

  /**
   * Marks variable modified in current block scope.
   *
   * - Not valid block var when not declared in current block scope.
   *
   * @param  {String} varName
   */
  markModified(varName) {
    const blockVar = this.getScope().findBlockScoped(varName);
    if (blockVar) {
      blockVar.markModified();
      return;
    }

    const funcVar = this.getScope().findFunctionScoped(varName);
    if (funcVar) {
      funcVar.markHoisted();
      funcVar.markModified();
    }
  }

  /**
   * Marks variable referenced in current block scope.
   *
   * - Not valid block var when not declared in current block scope.
   *
   * @param  {String} varName
   */
  markReferenced(varName) {
    const blockVar = this.getScope().findBlockScoped(varName);
    if (blockVar) {
      return;
    }

    const funcVar = this.getScope().findFunctionScoped(varName);
    if (funcVar) {
      funcVar.markHoisted();
    }
  }

  getScope() {
    return this.scopeManager.getScope();
  }
}
