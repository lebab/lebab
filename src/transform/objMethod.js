import {matches, extractAny} from 'f-matches';
import traverser from '../traverser';

const matchTransformableProperty = matches({
  type: 'Property',
  key: {
    type: 'Identifier',
  },
  value: {
    type: 'FunctionExpression',
    id: extractAny('functionName'),
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
          logger.warn(node, 'Unable to transform named function', 'obj-method');
          return;
        }

        node.method = true;
      }
    }
  });
}
