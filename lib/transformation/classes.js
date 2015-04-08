"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var estraverse = _interopRequire(require("estraverse"));

var utils = _interopRequire(require("util"));

var MethodDefinition = _interopRequire(require("./../syntax/method-definition.js"));

var ClassBody = _interopRequire(require("./../syntax/class-body.js"));

var ClassDeclaration = _interopRequire(require("./../syntax/class-declaration.js"));

var FunctionExpression = _interopRequire(require("./../syntax/function-expression.js"));

var Identifier = _interopRequire(require("./../syntax/identifier.js"));

var ThisExpression = _interopRequire(require("./../syntax/this-expression.js"));

var MemberExpression = _interopRequire(require("./../syntax/member-expression.js"));

var CallExpression = _interopRequire(require("./../syntax/call-expression.js"));

var ReturnStatement = _interopRequire(require("./../syntax/return-statement.js"));

module.exports = function (ast) {
  estraverse.traverse(ast, {
    enter: functionDetector
  });

  estraverse.traverse(ast, {
    enter: classMaker
  });

  estraverse.replace(ast, {
    enter: classReplacement
  });
};

var functions = [];

function createClass(_function) {
  if (typeof _function["class"] === "undefined") {
    var createdClass = new ClassDeclaration();
    createdClass.name = _function.id.name;

    var _constructor = new MethodDefinition();
    _constructor.name = "constructor";
    _constructor.body = _function.node.body;

    _function["class"] = createdClass;
    _function.node._class = createdClass;

    createdClass.body.addMethod(_constructor, true);
  }
}

function functionDetector(node, parent) {

  if (node.type === "FunctionDeclaration") {
    var id = node.id;
    functions.push({
      id: id,
      parent: parent,
      node: node
    });
  } else if (node.type === "VariableDeclarator" && node.init && node.init.type === "FunctionExpression") {
    parent._replace = node.init;
    var id = node.id;
    functions.push({
      id: id,
      parent: parent,
      node: node.init
    });
  }
}

function classMaker(node, parent) {

  if (node.type === "AssignmentExpression") {

    if (node.left.object && node.left.object.property && node.left.object.property.name === "prototype") {

      var functionName = node.left.object.object.name;

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = functions[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _function = _step.value;

          if (_function.id.name === functionName) {
            createClass(_function);

            var method = node.right;
            var createdMethod = new MethodDefinition();

            if (method.type === "Identifier") {

              createdMethod.body = new ReturnStatement(new CallExpression(new MemberExpression(node.right, new Identifier("apply")), [new ThisExpression(), new Identifier("arguments")]));
            } else {
              createdMethod.body = method.body;
              createdMethod.params = method.params;
            }

            createdMethod.name = node.left.property.name;

            _function["class"].body.addMethod(createdMethod);

            parent._remove = true;

            this.skip();
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator["return"]) {
            _iterator["return"]();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }
  } else if (node.type === "CallExpression" && node.callee && node.callee.type === "MemberExpression" && node.callee.object.name === "Object" && node.callee.property.name === "defineProperty" && node.arguments[0].type === "MemberExpression" && node.arguments[0].property.name === "prototype" && node.arguments[1].type === "Literal" && node.arguments[2].type === "ObjectExpression") {

    var functionName = node.arguments[0].object.name;

    for (var i = 0; i < functions.length; i++) {
      var _function = functions[i];

      if (_function.id.name === functionName) {
        createClass(_function);
        var properties = node.arguments[2].properties;

        for (var j = 0; j < properties.length; j++) {
          var property = properties[j];

          if (property.key.name !== "get" && property.key.name !== "set") {
            continue;
          }

          var createdMethod = new MethodDefinition();

          createdMethod.body = property.value.body;
          createdMethod.params = property.value.params;
          createdMethod.name = node.arguments[1].value;
          createdMethod.kind = property.key.name;

          _function["class"].body.addMethod(createdMethod);
        }

        parent._remove = true;

        this.skip();
      }
    }
  }
}

function classReplacement(node) {
  if (node._class) {
    return node._class;
  } else if (node._remove) {
    this.remove();
  } else if (node._replace) {
    return node._replace._class;
  }
}