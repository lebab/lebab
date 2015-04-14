import estraverse from 'estraverse';

export default
  function (ast) {
    estraverse.replace(ast, {
      enter: functionToMethod
    });
  }

function functionToMethod(node) {

  if (node.type === 'ObjectExpression' && typeof node.properties === 'object') {
    for (let i = 0; i < node.properties.length; i++) {
      let property = node.properties[i];

      if (property.value.type === 'FunctionExpression') {
        property.method = true;
        property.shorthand = false;
        property.computed = false;
      }
    }

    this.skip();
  }

}