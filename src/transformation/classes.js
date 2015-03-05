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

function createClass(_function) {
  if (typeof _function.class === 'undefined') {
    let createdClass = new ClassDeclaration();
    createdClass.name = _function.id.name;

    let constructor = new MethodDefinition();
    constructor.name = 'constructor';
    constructor.body = _function.node.body;

    _function.class = createdClass;
    _function.node._class = createdClass;

    createdClass.body.addMethod(constructor, true);
  }
}

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

    if (node.left.object && node.left.object.property && node.left.object.property.name === 'prototype') {

      var functionName = node.left.object.object.name;

      for (let i = 0; i < functions.length; i++) {
        let _function = functions[i];

        if (_function.id.name === functionName) {
          createClass(_function);

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
  } else if (
    node.type === 'CallExpression' && node.callee && node.callee.type === 'MemberExpression'
    && node.callee.object.name === 'Object'
    && node.callee.property.name === 'defineProperty'
    && node.arguments[0].type === 'MemberExpression'
    && node.arguments[0].property.name === 'prototype'
    && node.arguments[1].type === 'Literal'
    && node.arguments[2].type === 'ObjectExpression'
  ) {
    var functionName = node.arguments[0].object.name;


    for (let i = 0; i < functions.length; i++) {
      let _function = functions[i];

      if (_function.id.name === functionName) {
        createClass(_function);
        let properties = node.arguments[2].properties;

        for (var j = 0; j < properties.length; j++) {
          let property = properties[j];

          if(property.key.name !== 'get' && property.key.name !== 'set') {
            continue;
          }

          let createdMethod = new MethodDefinition();

          createdMethod.body = property.value.body;
          createdMethod.params = property.value.params;
          createdMethod.name = node.arguments[1].value;
          createdMethod.kind = property.key.name;

          _function.class.body.addMethod(createdMethod);
        }

        parent._remove = true;

        this.skip();
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
