import BaseSyntax from './base.js';
import ClassBody from './class-body.js';
import Identifier from './identifier.js';

/**
 * The class to define the ClassDeclaration syntax
 *
 * @class ClassDeclaration
 */
export default
class ClassDeclaration extends BaseSyntax {

  /**
   * The constructor of ClassDeclaration
   *
   * @constructor
   */
    constructor() {
    super('ClassDeclaration');

    this.body = new ClassBody();
    this.superClass = null;
    this.id = new Identifier();
  }

  set name(name) {
    this.id.name = name;
  }

  get name() {
    return this.id.name;
  }

}