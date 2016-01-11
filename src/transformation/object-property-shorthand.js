import estraverse from 'estraverse';

export default
  function (ast) {
    estraverse.replace(ast, {
      enter: objectPropertyShorthand
    });
  }

function  objectPropertyShorthand(node) {

  if (node.type === 'ObjectExpression' && typeof node.properties === 'object') {
    for (let i = 0; i < node.properties.length; i++) {
      let property = node.properties[i];

      if (property.value.type === 'Identifier' && property.key.name === property.value.name) {
        property.shorthand = true;
      }
    }

    this.skip();
  }

}