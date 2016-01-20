/**
 * Encapsulates a single variable declaring AST node.
 *
 * It might be the actual VariableDeclarator node,
 * but it might also be a function parameter or -name.
 */
export default
class Variable {
  /**
   * @param  {Object} node AST node declaring the variable.
   * @param  {VariableGroup} group The containing var-statement (if any).
   */
  constructor(node, group) {
    this.node = node;
    this.group = group;
    this.declared = false;
    this.hoisted = false;
    this.modified = false;
  }

  markDeclared() {
    this.declared = true;
  }

  isDeclared() {
    return this.declared;
  }

  /**
   * Marks that the use of the variable is not block-scoped,
   * so it cannot be simply converted to `let` or `const`.
   */
  markHoisted() {
    this.hoisted = true;
  }

  /**
   * Marks that the variable is assigned to,
   * so it cannot be converted to `const`.
   */
  markModified() {
    this.modified = true;
  }

  /**
   * Returns the strictest possible kind-attribute value for this variable.
   *
   * @return {String} Either "var", "let" or "const".
   */
  getKind() {
    if (this.hoisted) {
      return 'var';
    }
    else if (this.modified) {
      return 'let';
    }
    else {
      return 'const';
    }
  }

  /**
   * Returns the AST node that declares this variable.
   * @return {Object}
   */
  getNode() {
    return this.node;
  }

  /**
   * Returns the containing var-statement (if any).
   * @return {VariableGroup}
   */
  getGroup() {
    return this.group;
  }
}
