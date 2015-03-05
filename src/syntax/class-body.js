import BaseSyntax from './base.js';
import MethodDefinition from './method-definition.js';

/**
 * The class to define the ClassBody syntax
 *
 * @class ClassBody
 */
export default
class ClassBody extends BaseSyntax {

  /**
   * The constructor of ClassBody
   *
   * @constructor
   */
    constructor() {
    super('ClassBody');
    this.body = [];
  }

  addMethod(method, prepend) {
    if (method instanceof MethodDefinition) {

      if(prepend) {
        this.body.unshift(method);
      } else {
        this.body.push(method);
      }
    }
  }

}