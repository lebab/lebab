import {min} from 'lodash/fp';

/**
 * Encapsulates a VariableDeclaration node
 * and a list of Variable objects declared by it.
 *
 * PS. Named VariableGroup not VariableDeclaration to avoid confusion with syntax class.
 */
export default
class VariableGroup {
  /**
   * @param  {VariableDeclaration} node AST node
   * @param  {Object} parentNode Parent AST node (pretty much any node)
   */
  constructor(node, parentNode) {
    this.node = node;
    this.parentNode = parentNode;
    this.variables = [];
  }

  /**
   * Adds a variable to this group.
   * @param {Variable} variable
   */
  add(variable) {
    this.variables.push(variable);
  }

  /**
   * Returns all variables declared in this group.
   * @return {Variable[]}
   */
  getVariables() {
    return this.variables;
  }

  /**
   * Returns the `kind` value of variable defined in this group.
   *
   * When not all variables are of the same kind, returns undefined.
   *
   * @param {Scope} The current scope.
   * @return {String} Either "var", "let", "const" or undefined.
   */
  getCommonKind(scope) {
    function get(variable) {
      const otherVar = scope.findFunctionScoped(variable.getName());
      return otherVar && otherVar.getKind() === 'var' ? 'var' : variable.getKind();
    }
    const firstKind = get(this.variables[0]);
    if (this.variables.every(v => get(v) === firstKind)) {
      return firstKind;
    }
    else {
      return undefined;
    }
  }

  /**
   * Returns the most restrictive possible common `kind` value
   * for variables defined in this group.
   *
   * - When all vars are const, return "const".
   * - When some vars are "let" and some "const", returns "let".
   * - When some vars are "var", return "var".
   * - When any var was already declared before, return "var"
   *
   * @param {Variable[]} currentStatementVariables Variables declared in the currently processed statement
   * @return {String} Either "var", "let" or "const".
   */
  getMostRestrictiveKind(currentStatementVariables) {
    // If any variable has the var type, that means it was declared before and
    // is also redeclared now. That must mean that the previous declaration
    // was with var and the current declaration is with var
    // (it would be a javascript runtime error otherwise)
    // In that case, we cannot change the type to anything other than var.
    if (currentStatementVariables.some(v => v.getKind() === 'var')) {
      return 'var';
    }

    const kindToVal = {
      'var': 1,
      'let': 2,
      'const': 3,
    };
    const valToKind = {
      1: 'var',
      2: 'let',
      3: 'const',
    };

    const minVal = min(this.variables.map(v => kindToVal[v.getKind()]));
    return valToKind[minVal];
  }

  /**
   * Returns the AST node
   * @return {VariableDeclaration}
   */
  getNode() {
    return this.node;
  }

  /**
   * Returns the parent AST node (which can be pretty much anything)
   * @return {Object}
   */
  getParentNode() {
    return this.parentNode;
  }
}
