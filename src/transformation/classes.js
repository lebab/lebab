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
  var lastIdentifier;

  if (node.type === 'VariableDeclarator' && node.init && node.init.type === 'FunctionExpression') {

    lastIdentifier = node.id;

  } else if (node.type === 'FunctionDeclaration') {

    var id;

    if (node.id) {
      id = node.id;
    } else if (lastIdentifier) {
      id = lastIdentifier;
    }

    if (id !== null) {
      functions.push({
        id: id,
        parent: parent,
        node: node
      });
    }

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
            createdClass.name = functionName;

            _function.class = createdClass;
            _function.node._class = createdClass;
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
  if (typeof node._class !== 'undefined') {
    let constructor = new MethodDefinition();
    constructor.name = 'constructor';
    constructor.body = node.body;

    node._class.body.addMethod(constructor, true);

    return node._class;
  } else if (node._remove) {
    this.remove();
  }
}