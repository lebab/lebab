import matchesAst from '../utils/matches-ast';
import traverser from '../traverser';

const isTransformableProperty = matchesAst({
  type: 'Property',
  value: {
    type: 'FunctionExpression',
    id: null,
  },
  method: false,
  computed: false,
  shorthand: false
});

export default function(ast) {
  traverser.replace(ast, {
    enter(node) {
      if (isTransformableProperty(node)) {
        node.method = true;
      }
    }
  });
}
