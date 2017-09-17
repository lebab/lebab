import {flow, map, flatten, forEach} from 'lodash/fp';
import traverser from '../traverser';
import * as functionType from '../utils/functionType';
import * as destructuring from '../utils/destructuring.js';
import Variable from '../scope/Variable';
import VariableGroup from '../scope/VariableGroup';

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
    return flow(
      map(destructuring.extractVariables),
      flatten,
      forEach(this.registerParam.bind(this))
    )(params);
  }

  registerParam(p) {
    this.functionScope.register(p.name, new Variable(p));
  }

  hoistVariables(ast) {
    traverser.traverse(ast, {
      // Use arrow-function here, so we can access outer `this`.
      enter: (node, parent) => {
        if (node.type === 'VariableDeclaration') {
          this.hoistVariableDeclaration(node, parent);
        }
        else if (functionType.isFunctionDeclaration(node)) {
          // Register variable for the function if it has a name
          if (node.id) {
            this.functionScope.register(node.id.name, new Variable(node));
          }
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
      // All destructured variable names point to the same Variable instance,
      // as we want to treat the destructured variables as one un-breakable
      // unit - if one of them is modified and other one not, we cannot break
      // them apart into const and let, but instead need to use let for both.
      destructuring.extractVariableNames(declaratorNode.id).forEach(name => {
        this.functionScope.register(name, variable);
      });
    });
  }
}
