export default {
  isDefined(node) {
    return typeof node !== 'undefined';
  },
  isBinaryExpression(node) {
    return this.isDefined(node) && /BinaryExpression/.test(node.type);
  },
  isLiteral(node) {
    return this.isDefined(node) && /Literal/.test(node.type);
  },
  isString(node) {
    return this.isLiteral(node) && typeof node.value === 'string';
  }
};