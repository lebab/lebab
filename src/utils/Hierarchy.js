import traverser from '../traverser';

/**
 * Provides a way to look up parent nodes.
 */
export default class Hierarchy {
  /**
   * @param {Object} ast Root node
   */
  constructor(ast) {
    this.parents = new Map();

    traverser.traverse(ast, {
      enter: (node, parent) => {
        this.parents.set(node, parent);
      }
    });
  }

  /**
   * Returns parent node of given AST node.
   * @param {Object} node
   * @return {Object}
   */
  getParent(node) {
    return this.parents.get(node);
  }
}
