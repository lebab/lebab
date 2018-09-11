import traverser from '../../traverser';
import isEqualAst from './../../utils/isEqualAst';
import {matches} from 'f-matches';
import PotentialMethod from './PotentialMethod';

/**
 * Represents a potential constructor method to be created.
 */
export default
class PotentialConstructor extends PotentialMethod {
  constructor(cfg) {
    cfg.name = 'constructor';
    super(cfg);
  }

  // Override superclass method
  getBody() {
    if (this.superClass) {
      return this.transformSuperCalls(this.getBodyBlock());
    }
    else {
      return this.getBodyBlock();
    }
  }

  // Transforms constructor body by replacing
  // SuperClass.call(this, ...args) --> super(...args)
  transformSuperCalls(body) {
    return traverser.replace(body, {
      enter: (node) => {
        if (this.isSuperConstructorCall(node)) {
          node.expression.callee = {
            type: 'Super'
          };
          node.expression.arguments = node.expression.arguments.slice(1);
        }
      }
    });
  }

  isSuperConstructorCall(node) {
    return matches({
      type: 'ExpressionStatement',
      expression: {
        type: 'CallExpression',
        callee: {
          type: 'MemberExpression',
          object: obj => isEqualAst(obj, this.superClass),
          property: {
            type: 'Identifier',
            name: 'call'
          }
        },
        arguments: [
          {
            type: 'ThisExpression'
          }
        ]
      }
    }, node);
  }
}
