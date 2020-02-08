import extractComments from './extractComments';
import multiReplaceStatement from './../../utils/multiReplaceStatement';

/**
 * Represents a potential properties to be created.
 */
export default
class PotentialProperties {
  /**
   * @param {Object} cfg
   *   @param {Object[]} cfg.properties Properties to replace
   *   @param {String} cfg.className Class name
   *   @param {Object} cfg.fullNode Node to remove after converting to class
   *   @param {Object[]} cfg.commentNodes Nodes to extract comments from
   *   @param {Object} cfg.parent
   */
  constructor(cfg) {
    this.node = cfg.fullNode;
    this.className = cfg.className;
    this.commentNodes = cfg.commentNodes || [];
    this.parent = cfg.parent;
    this.properties = cfg.properties.filter(
      ({name, node}) => name !== 'constructor' || !this.commentNodes.push(node)
    );
  }

  get replacements() {
    delete this.replacements;
    Object.defineProperty(this, 'replacements', {
      value: this.properties.map(
        (property, i) => this.toPropertyDefinition(property, i === 0)
      ),
      enumerable: true,
      configurable: true,
      writable: true
    });
    return this.replacements;
  }

  /**
   * Transforms the potential property to actual PropertyDefinition node.
   * @return {PropertyDefinition}
   */
  toPropertyDefinition(property, isFirst) {
    return {
      type: 'ExpressionStatement',
      expression: {
        type: 'AssignmentExpression',
        operator: '=',
        left: {
          type: 'MemberExpression',
          object: {
            type: 'MemberExpression',
            object: {
              type: 'Identifier',
              name: this.className
            },
            property: {
              type: 'Identifier',
              name: 'prototype'
            },
          },
          property: {
            type: 'Identifier',
            name: property.name
          },
          computed: false
        },
        right: property.value
      },
      comments: extractComments(isFirst ? this.commentNodes.concat(property.node) : [property.node])
    };
  }
}
