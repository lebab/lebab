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
   * @return {String} Either "var", "let", "const" or undefined.
   */
  getCommonKind() {
    const firstKind = this.variables[0].getKind();
    if (this.variables.every(v => v.getKind() === firstKind)) {
      return firstKind;
    }
    else {
      return undefined;
    }
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
