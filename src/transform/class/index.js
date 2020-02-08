import {values} from 'lodash/fp';
import traverser from '../../traverser';
import PotentialClass from './PotentialClass';
import PotentialMethod from './PotentialMethod';
import PotentialConstructor from './PotentialConstructor';
import matchFunctionDeclaration from './matchFunctionDeclaration';
import matchFunctionVar from './matchFunctionVar';
import matchFunctionAssignment from './matchFunctionAssignment';
import matchPrototypeFunctionAssignment from './matchPrototypeFunctionAssignment';
import matchPrototypeObjectAssignment from './matchPrototypeObjectAssignment';
import matchObjectDefinePropertyCall from './matchObjectDefinePropertyCall';
import Inheritance from './inheritance/Inheritance';
import PotentialProperties from './PotentialProperties';

export default function(ast, logger) {
  const potentialClasses = {};
  const inheritance = new Inheritance();

  traverser.traverse(ast, {
    enter(node, parent) {
      let m;

      if ((m = matchFunctionDeclaration(node) || matchFunctionVar(node))) {
        potentialClasses[m.className] = new PotentialClass({
          name: m.className,
          fullNode: node,
          commentNodes: [node],
          parent,
        });
        potentialClasses[m.className].setConstructor(
          new PotentialConstructor({
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
      else if ((m = matchPrototypeObjectAssignment(node, logger))) {
        if (potentialClasses[m.className]) {
          let assignmentComments = node;

          if (m.properties.length > 0) {
            potentialClasses[m.className].addProperties(new PotentialProperties({
              properties: m.properties,
              className: m.className,
              fullNode: node,
              commentNodes: [assignmentComments],
              parent,
            }));
            assignmentComments = false;
          }

          m.methods.forEach((method) => {
            potentialClasses[m.className].addMethod(new PotentialMethod({
              name: method.methodName,
              methodNode: method.methodNode,
              fullNode: node,
              commentNodes: assignmentComments ? [assignmentComments, method.propertyNode] : [method.propertyNode],
              parent,
              kind: classMethodKind(method.kind),
            }));
            assignmentComments = false;
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
        values(potentialClasses)
          .filter(cls => cls.isTransformable() ? true : logWarning(cls))
          .forEach(cls => cls.transform());
      }
    }
  });

  // Ordinary methods inside class use kind=method,
  // unlike methods inside object literal, which use kind=init.
  function classMethodKind(kind) {
    return kind === 'init' ? 'method' : kind;
  }

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
