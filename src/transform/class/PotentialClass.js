import _ from 'lodash';
import extractComments from './extractComments';
import {matchesAst} from './../../utils/matches-ast';
import stripLocationInfo from './../../utils/stripLocationInfo';
import multiReplaceStatement from './../../utils/multiReplaceStatement';

/**
 * Represents a potential class to be created.
 */
export default
class PotentialClass {
  /**
   * @param {Object} cfg
   *   @param {String} cfg.name Class name
   *   @param {PotentialMethod} cfg.constructor
   *   @param {String} cfg.superClass Super Class name
   *   @param {Object} cfg.fullNode Node to remove after converting to class
   *   @param {Object[]} cfg.commentNodes Nodes to extract comments from
   *   @param {Object} cfg.parent
   */
  constructor({name, constructor, superClass, fullNode, commentNodes, parent}) {
    this.name = name;
    this.constructor = constructor;
    this.superClass = superClass;
    this.fullNode = fullNode;
    this.commentNodes = commentNodes;
    this.parent = parent;
    this.methods = [];
    this.replacements = [];
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
    return this.methods.length > 0 || this.superClass !== undefined;
  }

  /**
   * Replaces original constructor function and manual prototype assignments
   * with ClassDeclaration.
   */
  transform() {
    multiReplaceStatement({
      parent: this.parent,
      node: this.fullNode,
      replacements: [this.toClassDeclaration()],
    });
    this.replacements.forEach(multiReplaceStatement);

    this.methods.forEach(method => method.remove());
  }

  toClassDeclaration() {
    return {
      type: 'ClassDeclaration',
      superClass: this.superClass,
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
    if (this.constructor.isEmpty()) {
      return undefined;
    }
    else {
      this.modifySuperCalls();
      return this.constructor.toMethodDefinition();
    }
  }

  modifySuperCalls() {
    this.constructor.methodNode.body.body.forEach(body => {
      if (matchesAst({
        type: 'ExpressionStatement',
        expression: {
          type: 'CallExpression',
          callee: {
            type: 'MemberExpression',
            object: stripLocationInfo(this.superClass),
            property: {
              type: 'Identifier',
              name: 'call'
            }
          },
          arguments: (args) => args[0].type === 'ThisExpression'
        }
      })(body)) {
        body.expression.callee = {
          type: 'Super'
        };
        body.expression.arguments = body.expression.arguments.slice(1);
      }
    });
  }
}

