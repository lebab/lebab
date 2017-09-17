import {includes} from 'lodash/fp';

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
   * Marks set of variables declared in current block scope.
   *
   * Takes an array of variable names to support the case of declaring
   * multiple variables at once with a destructuring operation.
   *
   * - Not valid block var when already declared before.
   *
   * @param  {String[]} varNames
   */
  markDeclared(varNames) {
    const alreadySeen = [];

    varNames.forEach(varName => {
      const blockVar = this.getScope().findFunctionScoped(varName);

      // all variable names declared with a destructuring operation
      // reference the same Variable object, so when we mark the
      // first variable in destructuring as declared, they all
      // will be marked as declared, but this kind of re-declaring
      // (which isn't actually real re-declaring) should not cause
      // variable to be marked as declared multiple times and
      // therefore marked as hoisted.
      if (!includes(blockVar, alreadySeen)) {
        alreadySeen.push(blockVar);

        // Ignore repeated var declarations
        if (blockVar.isDeclared()) {
          blockVar.markHoisted();
          return;
        }
      }

      // Remember that it's declared and register in current block scope
      blockVar.markDeclared();
      this.getScope().register(varName, blockVar);
    });
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
