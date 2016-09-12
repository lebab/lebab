import _ from 'lodash';
import traverser from '../../traverser';
import PotentialClass from './PotentialClass';
import PotentialMethod from './PotentialMethod';
import matchFunctionDeclaration from './matchFunctionDeclaration';
import matchFunctionVar from './matchFunctionVar';
import matchFunctionAssignment from './matchFunctionAssignment';
import matchPrototypeFunctionAssignment from './matchPrototypeFunctionAssignment';
import matchPrototypeObjectAssignment from './matchPrototypeObjectAssignment';
import matchObjectDefinePropertyCall from './matchObjectDefinePropertyCall';
import Inheritance from './inheritance';

export default function(ast, logger) {
  const potentialClasses = {};
  const inheritance = new Inheritance();

  traverser.traverse(ast, {
    enter(node, parent) {
      let m;

      if ((m = matchFunctionDeclaration(node))) {
        potentialClasses[m.className] = new PotentialClass({
          name: m.className,
          fullNode: node,
          commentNodes: [node],
          parent,
        });
        potentialClasses[m.className].setConstructor(
          new PotentialMethod({
            name: 'constructor',
            methodNode: m.constructorNode,
            potentialClass: potentialClasses[m.className]
          })
        );
      }
      else if ((m = matchFunctionVar(node))) {
        potentialClasses[m.className] = new PotentialClass({
          name: m.className,
          fullNode: node,
          commentNodes: [node],
          parent,
        });
        potentialClasses[m.className].setConstructor(
          new PotentialMethod({
            name: 'constructor',
            methodNode: m.constructorNode,
            potentialClass: potentialClasses[m.className]
          })
        );
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
          potentialClasses[m.className].setSuperClass(
            m.superClass,
            m.relatedExpressions
          );
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
