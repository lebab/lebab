import {matches} from 'f-matches';

const isFunctionExpression = matches({
  type: 'FunctionExpression'
});

const isFunctionVariableDeclaration = matches({
  type: 'VariableDeclaration',
  declarations: (decs) => decs.length === 1 && isFunctionExpression(decs[0].init)
});

/**
 * Matches: var <className> = function () { ... }
 *
 * When node matches returns the extracted fields:
 *
 * - className
 * - constructorNode
 *
 * @param  {Object} node
 * @return {Object}
 */
export default function(node) {
  if (isFunctionVariableDeclaration(node)) {
    const {
      declarations: [
        {
          id: {name: className},
          init: constructorNode,
        }
      ]
    } = node;

    return {className, constructorNode};
  }
}
