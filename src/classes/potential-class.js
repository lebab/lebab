import _ from 'lodash';
import multiReplaceStatement from './../utils/multi-replace-statement';

/**
 * Represents a potential class to be created.
 */
export default
class PotentialClass {
  /**
   * @param {Object} cfg
   *   @param {String} cfg.name Class name
   *   @param {PotentialMethod} cfg.constructor
   *   @param {Object} cfg.fullNode
   *   @param {Object} cfg.parent
   */
  constructor({name, constructor, fullNode, parent}) {
    this.name = name;
    this.constructor = constructor;
    this.fullNode = fullNode;
    this.parent = parent;
    this.methods = [];
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
      }
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
