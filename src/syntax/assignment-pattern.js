import BaseSyntax from './base.js';
import Identifier from './identifier.js';

/**
 * The class to define the AssignmentPattern syntax
 *
 * @class AssignmentPattern
 */
export default
class AssignmentPattern extends BaseSyntax {

  /**
   * The constructor of AssignmentPattern
   *
   * @constructor
   */
  constructor() {
    super('AssignmentPattern');

    this.operator = '=';
    this.left = new Identifier();
    this.right = new Identifier();
  }
}