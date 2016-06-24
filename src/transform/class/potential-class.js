import _ from 'lodash';
import extractComments from './extractComments';
import multiReplaceStatement from './../../utils/multi-replace-statement';

/**
 * Represents a potential class to be created.
 */
export default
class PotentialClass {
  /**
   * @param {Object} cfg
   *   @param {String} cfg.name Class name
   *   @param {PotentialMethod} cfg.constructor
   *   @param {Object} cfg.fullNode Node to remove after converting to class
   *   @param {Object[]} cfg.commentNodes Nodes to extract comments from
   *   @param {Object} cfg.parent
   */
  constructor({name, constructor, fullNode, commentNodes, parent}) {
    this.name = name;
    this.constructor = constructor;
    this.fullNode = fullNode;
    this.commentNodes = commentNodes;
    this.parent = parent;
    this.methods = [];
  }

  /**
   * Returns the name of the class.
   * @return {String}
   */
  getName() {
    return this.name;
  }

  /**
   * Returns the AST node for the original function
   * @return {Object}
   */
  getFullNode() {
    return this.fullNode;
  }

  /**
   * Adds method to class.
   * @param {PotentialMethod} method
   */
  addMethod(method) {
    this.methods.push(method);
  }

  /**
   * True when class has at least one method (besides constructor).
   * @return {Boolean}
   */
  isTransformable() {
    return this.methods.length > 0;
  }

  /**
   * Replaces original constructor function and manual prototype assignments
   * with ClassDeclaration.
   */
  transform() {
    multiReplaceStatement(this.parent, this.fullNode, [this.toClassDeclaration()]);

    this.methods.forEach(method => method.remove());
  }

  toClassDeclaration() {
    return {
      type: 'ClassDeclaration',
      id: {
        type: 'Identifier',
        name: this.name,
      },
      body: {
        type: 'ClassBody',
        body: this.createMethods()
      },
      comments: extractComments(this.commentNodes),
    };
  }

  createMethods() {
    return _.compact([
      this.createConstructor(),
      ...this.methods.map(m => m.toMethodDefinition())
    ]);
  }

  createConstructor() {
    return this.constructor.isEmpty() ? undefined : this.constructor.toMethodDefinition();
  }
}
