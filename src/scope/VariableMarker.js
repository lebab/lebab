import {intersection} from 'lodash/fp';

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

    varNames.forEach((varName) => {
      const blockVars = this.getScope().findFunctionScoped(varName);

      // all variable names declared with a destructuring operation
      // reference the same Variable object, so when we mark the
      // first variable in destructuring as declared, they all
      // will be marked as declared, but this kind of re-declaring
      // (which isn't actually real re-declaring) should not cause
      // variable to be marked as declared multiple times and
      // therefore marked as hoisted.
      if (intersection(blockVars, alreadySeen).length === 0) {
        alreadySeen.push(...blockVars);

        // Ignore repeated var declarations
        if (blockVars.some((variable) => variable.isDeclared())) {
          for (const variable of blockVars) {
            variable.markHoisted();
          }
          return;
        }
      }

      for (const variable of blockVars) {
        // Remember that it's declared and register in current block scope
        variable.markDeclared();
      }

      const scope = this.getScope();
      for (const variable of blockVars) {
        scope.register(varName, variable);
      }
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
    const blockVars = this.getScope().findBlockScoped(varName);
    if (blockVars) {
      for (const variable of blockVars) {
        variable.markModified();
      }
      return;
    }

    const funcVars = this.getScope().findFunctionScoped(varName);
    if (funcVars) {
      for (const variable of funcVars) {
        variable.markHoisted();
        variable.markModified();
      }
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
    const blockVars = this.getScope().findBlockScoped(varName);
    if (blockVars) {
      return;
    }

    const funcVars = this.getScope().findFunctionScoped(varName);
    if (funcVars) {
      for (const variable of funcVars) {
        variable.markHoisted();
      }
    }
  }

  getScope() {
    return this.scopeManager.getScope();
  }
}
