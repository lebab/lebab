import _ from 'lodash';
import traverser from '../traverser';
import * as functionType from '../utils/function-type';
import * as destructuring from '../utils/destructuring.js';
import Variable from '../scope/variable';
import VariableGroup from '../scope/variable-group';

/**
 * Registers all variables defined inside a function.
 * Emulating ECMAScript variable hoisting.
 */
export default
class FunctionHoister {
  /**
   * Instantiates hoister with a function scope where to
   * register the variables that are found.
   * @param  {FunctionScope} functionScope
   */
  constructor(functionScope) {
    this.functionScope = functionScope;
  }

  /**
   * Performs the hoisting of a function name, params and variables.
   *
   * @param {Object} cfg
   *   @param {Identifier} cfg.id Optional function name
   *   @param {Identifier[]} cfg.params Optional function parameters
   *   @param {Object} cfg.body Function body node or Program node to search variables from.
   */
  hoist({id, params, body}) {
    if (id) {
      this.hoistFunctionId(id);
    }
    if (params) {
      this.hoistFunctionParams(params);
    }
    this.hoistVariables(body);
  }

  hoistFunctionId(id) {
    this.functionScope.register(id.name, new Variable(id));
  }

  hoistFunctionParams(params) {
    _(params).map(destructuring.extractVariables).flatten().forEach(p => {
      this.functionScope.register(p.name, new Variable(p));
    });
  }

  hoistVariables(ast) {
    traverser.traverse(ast, {
      // Use arrow-function here, so we can access outer `this`.
      enter: (node, parent) => {
        if (node.type === 'VariableDeclaration') {
          this.hoistVariableDeclaration(node, parent);
        }
        else if (functionType.isFunctionDeclaration(node)) {
          this.functionScope.register(node.id.name, new Variable(node));
          // Skip anything inside the nested function
          return traverser.VisitorOption.Skip;
        }
        else if (functionType.isFunctionExpression(node)) {
          // Skip anything inside the nested function
          return traverser.VisitorOption.Skip;
        }
      }
    });
  }

  hoistVariableDeclaration(node, parent) {
    const group = new VariableGroup(node, parent);
    node.declarations.forEach(declaratorNode => {
      const variable = new Variable(declaratorNode, group);
      group.add(variable);
      this.functionScope.register(declaratorNode.id.name, variable);
    });
  }
}
