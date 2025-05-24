import {min, flatten} from 'lodash/fp';


/**
 * Returns all variables in the scope that
 * share a name with any of the variables.
 *
 * @param {Variable[]} Variables
 * @param {Scope} Current scope
 * @return {Variable[]} All variables
 */
function getAllScopeVariables(variables, scope) {
  return flatten(variables
    .filter(variable => variable.getNode().type === 'VariableDeclarator' && variable.getNode().id.type === 'Identifier')
    .map(variable => scope.findFunctionScoped(variable.getNode().id.name))
  );
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
 * @param {Variable[]} Variables
 * @param {Scope} Current scope
 * @return {String} Either "var", "let" or "const".
 */
export function getMostRestrictiveKind(variables, scope) {
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

  const allVariables = getAllScopeVariables(variables, scope);
  const minVal = min(allVariables.map(v => kindToVal[v.getKind()]));
  return valToKind[minVal];
}

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
    const allVariables = getAllScopeVariables(this.variables, scope);

    const firstKind = this.variables[0].getKind();
    if (allVariables.every(v => v.getKind() === firstKind)) {
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
   * @param {Scope} Current scope
   * @return {String} Either "var", "let" or "const".
   */
  getMostRestrictiveKind(scope) {
    return getMostRestrictiveKind(this.variables, scope);
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
