import {matchesAst, extract} from '../utils/matches-ast';
import traverser from '../traverser';

const matchTransformableProperty = matchesAst({
  type: 'Property',
  value: {
    type: 'FunctionExpression',
    id: extract('functionName'),
  },
  method: false,
  computed: false,
  shorthand: false
});

export default function(ast, logger) {
  traverser.replace(ast, {
    enter(node) {
      const match = matchTransformableProperty(node);
      if (match) {
        // Do not transform functions with name,
        // as the name might be recursively referenced from inside.
        if (match.functionName) {
          logger.warn({
            line: node.loc.start.line,
            msg: 'Unable to transform named function',
            type: 'obj-method'
          });
          return;
        }

        node.method = true;
      }
    }
  });
}
