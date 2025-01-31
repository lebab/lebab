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
import matchObjectDefinePropertyCall, {isAccessorDescriptor} from './matchObjectDefinePropertyCall';
import Inheritance from './inheritance/Inheritance';
import matchObjectDefinePropertiesCall, {matchDefinedProperties} from './matchObjectDefinePropertiesCall.js';

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
              kind: classMethodKind(method.kind),
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
              static: m.static
            }));
          });
        }
      }
      else if ((m = matchObjectDefinePropertiesCall(node))) {
        // defineProperties allows mixing method definitions we CAN transform
        // with ones we CANT. This check looks for whether every property is
        // one we CAN transform and if they are it removes the whole call
        // to defineProperties
        let removeWholeNode = false;
        if (node.expression.arguments[1].properties.every(propertyNode => {
          const {properties} = matchDefinedProperties(propertyNode);
          return properties.some(isAccessorDescriptor);
        })) {
          removeWholeNode = true;
        }

        m.forEach((method, i) => {
          if (potentialClasses[method.className]) {
            method.descriptors.forEach((desc, j) => {
              const parentComments = (j === 0) ? [method.methodNode] : [];

              // by default remove only the single method property of the object passed to defineProperties
              // otherwise if they should all be remove AND this is the last descriptor set it up
              // to remove the whole node that's calling defineProperties
              const lastDescriptor = i === m.length - 1 && j === method.descriptors.length - 1;
              const fullNode = lastDescriptor && removeWholeNode ? node : method.methodNode;
              const parentNode = lastDescriptor && removeWholeNode ? parent : node.expression.arguments[1];

              potentialClasses[method.className].addMethod(new PotentialMethod({
                name: method.methodName,
                methodNode: desc.methodNode,
                fullNode: fullNode,
                commentNodes: parentComments.concat([desc.propertyNode]),
                parent: parentNode,
                kind: desc.kind,
                static: method.static
              }));
            });
          }
        });
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
