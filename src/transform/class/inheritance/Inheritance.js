import UtilInherits from './UtilInherits';
import Prototypal from './Prototypal';

/**
 * Processes nodes to detect super classes and return information for later
 * transformation.
 */
export default class Inheritance {
  /**
   * @param {Object} cfg
   *   @param {PotentialClass[]} cfg.potentialClasses Class name
   */
  constructor() {
    this.utilInherits = new UtilInherits();
    this.prototypal = new Prototypal();
  }

  /**
   * Process a node and return inheritance details if found.
   * @param {Object} node
   * @param {Object} parent
   * @returns {Object}
   *            {String}   className
   *            {Node}     superClass
   *            {Object[]} relatedExpressions
   */
  process(node, parent) {
    return (
      this.utilInherits.process(node, parent) ||
      this.prototypal.process(node, parent)
    );
  }
}
