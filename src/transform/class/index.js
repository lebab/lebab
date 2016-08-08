import _ from 'lodash';
import traverser from '../../traverser';
import PotentialClass from './potential-class';
import PotentialMethod from './potential-method';
import matchFunctionDeclaration from './match-function-declaration';
import matchFunctionVar from './match-function-var';
import matchFunctionAssignment from './match-function-assignment';
import matchPrototypeFunctionAssignment from './match-prototype-function-assignment';
import matchPrototypeObjectAssignment from './match-prototype-object-assignment';
import matchObjectDefinePropertyCall from './match-object-define-property-call';
import multiReplaceStatement from '../../utils/multi-replace-statement';
import Inheritance from './inheritance';

export default function(ast, logger) {
  const potentialClasses = {};
  const inheritance = new Inheritance(potentialClasses);

  traverser.traverse(ast, {
    enter(node, parent) {
      let m;

      if ((m = matchFunctionDeclaration(node))) {
        potentialClasses[m.className] = new PotentialClass({
          name: m.className,
          constructor: new PotentialMethod({
            name: 'constructor',
            methodNode: m.constructorNode,
          }),
          fullNode: node,
          commentNodes: [node],
          parent,
        });
      }
      else if ((m = matchFunctionVar(node))) {
        potentialClasses[m.className] = new PotentialClass({
          name: m.className,
          constructor: new PotentialMethod({
            name: 'constructor',
            methodNode: m.constructorNode,
          }),
          fullNode: node,
          commentNodes: [node],
          parent,
        });
      }
      else if ((m = matchFunctionAssignment(node))) {
        if (potentialClasses[m.className]) {
          potentialClasses[m.className].addMethod(new PotentialMethod({
            name: m.methodName,
            methodNode: m.methodNode,
            fullNode: node,
            commentNodes: [node],
            parent,
            static: true,
          }));
        }
      }
      else if ((m = matchPrototypeFunctionAssignment(node))) {
        if (potentialClasses[m.className]) {
          potentialClasses[m.className].addMethod(new PotentialMethod({
            name: m.methodName,
            methodNode: m.methodNode,
            fullNode: node,
            commentNodes: [node],
            parent,
          }));
        }
      }
      else if ((m = matchPrototypeObjectAssignment(node))) {
        if (potentialClasses[m.className]) {
          m.methods.forEach((method, i) => {
            const assignmentComments = (i === 0) ? [node] : [];

            potentialClasses[m.className].addMethod(new PotentialMethod({
              name: method.methodName,
              methodNode: method.methodNode,
              fullNode: node,
              commentNodes: assignmentComments.concat([method.propertyNode]),
              parent,
            }));
          });
        }
      }
      else if ((m = matchObjectDefinePropertyCall(node))) {
        if (potentialClasses[m.className]) {
          m.descriptors.forEach((desc, i) => {
            const parentComments = (i === 0) ? [node] : [];

            potentialClasses[m.className].addMethod(new PotentialMethod({
              name: m.methodName,
              methodNode: desc.methodNode,
              fullNode: node,
              commentNodes: parentComments.concat([desc.propertyNode]),
              parent,
              kind: desc.kind,
            }));
          });
        }
      }
      else if ((m = inheritance.process(node, parent))) {
        if (potentialClasses[m.className]) {
          potentialClasses[m.className].superClass = m.superClass;
          m.erasures.forEach(erasure => {
            multiReplaceStatement({
              node: erasure.node,
              parent: erasure.parent,
              replacements: []});
          });
        }
      }
    },
    leave(node) {
      if (node.type === 'Program') {
        _(potentialClasses)
          .filter(cls => cls.isTransformable() ? true : logWarning(cls))
          .forEach(cls => cls.transform());
      }
    }
  });

  function logWarning(cls) {
    if (/^[A-Z]/.test(cls.getName())) {
      logger.warn(
        cls.getFullNode(),
        `Function ${cls.getName()} looks like class, but has no prototype`,
        'class'
      );
    }
  }
}
