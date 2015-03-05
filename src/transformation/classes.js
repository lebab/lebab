import estraverse from 'estraverse';
import utils from 'util';
import MethodDefinition from './../syntax/method-definition';
import ClassBody from './../syntax/class-body';
import ClassDeclaration from './../syntax/class-declaration.js';

export default
  function (ast) {
    estraverse.traverse(ast, {
      enter: functionDetector
    });

    estraverse.traverse(ast, {
      enter: classMaker
    });

    estraverse.replace(ast, {
      enter: classReplacement
    });
  }

var functions = [];


function functionDetector(node, parent) {
  var lastIdentifier, id;

  if (node.type === 'FunctionDeclaration') {
    id = node.id;
    functions.push({
      id: id,
      parent: parent,
      node: node
    });
  } else if (node.type === 'VariableDeclarator' && node.init.type === 'FunctionExpression') {
    parent._replace = node.init;
    id = node.id;
    functions.push({
      id: id,
      parent: parent,
      node: node.init
    });
  }

}

function classMaker(node, parent) {
  if (node.type === 'AssignmentExpression') {

    if (node.left.object.property.name === 'prototype') {

      var functionName = node.left.object.object.name;

      for (var i = 0; i < functions.length; i++) {
        let _function = functions[i];

        if (_function.id.name === functionName) {
          if (typeof _function.class === 'undefined') {
            let createdClass = new ClassDeclaration();
            let constructor = new MethodDefinition();
            constructor.name = 'constructor';
            constructor.body = _function.node.body;

            createdClass.name = functionName;

            _function.class = createdClass;
            _function.node._class = createdClass;

            createdClass.body.addMethod(constructor, true);
          }

          let method = node.right;
          let createdMethod = new MethodDefinition();

          createdMethod.body = method.body;
          createdMethod.params = method.params;
          createdMethod.name = node.left.property.name;

          _function.class.body.addMethod(createdMethod);

          parent._remove = true;

          this.skip();
        }

      }

    }

  }
}

function classReplacement(node, parent) {
  if (node._class) {
    return node._class;
  } else if (node._remove) {
    this.remove();
  } else if (node._replace) {
    return node._replace._class;
  }
}