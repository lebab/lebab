import _ from 'lodash';
import estraverse from 'estraverse';

const isTransformableProperty = _.matches({
  type: 'Property',
  value: {
    type: 'FunctionExpression',
    id: null,
  },
  method: false,
  computed: false,
  shorthand: false
});

export default function (ast) {
  estraverse.replace(ast, {
    enter(node) {
      if (isTransformableProperty(node)) {
        node.method = true;
      }
    }
  });
}
