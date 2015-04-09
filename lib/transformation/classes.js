'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _estraverse = require('estraverse');

var _estraverse2 = _interopRequireWildcard(_estraverse);

var _utils = require('util');

var _utils2 = _interopRequireWildcard(_utils);

var _MethodDefinition = require('./../syntax/method-definition.js');

var _MethodDefinition2 = _interopRequireWildcard(_MethodDefinition);

var _ClassBody = require('./../syntax/class-body.js');

var _ClassBody2 = _interopRequireWildcard(_ClassBody);

var _ClassDeclaration = require('./../syntax/class-declaration.js');

var _ClassDeclaration2 = _interopRequireWildcard(_ClassDeclaration);

var _FunctionExpression = require('./../syntax/function-expression.js');

var _FunctionExpression2 = _interopRequireWildcard(_FunctionExpression);

var _Identifier = require('./../syntax/identifier.js');

var _Identifier2 = _interopRequireWildcard(_Identifier);

var _ThisExpression = require('./../syntax/this-expression.js');

var _ThisExpression2 = _interopRequireWildcard(_ThisExpression);

var _MemberExpression = require('./../syntax/member-expression.js');

var _MemberExpression2 = _interopRequireWildcard(_MemberExpression);

var _CallExpression = require('./../syntax/call-expression.js');

var _CallExpression2 = _interopRequireWildcard(_CallExpression);

var _ReturnStatement = require('./../syntax/return-statement.js');

var _ReturnStatement2 = _interopRequireWildcard(_ReturnStatement);

exports['default'] = function (ast) {
  _estraverse2['default'].traverse(ast, {
    enter: functionDetector
  });

  _estraverse2['default'].traverse(ast, {
    enter: classMaker
  });

  _estraverse2['default'].replace(ast, {
    enter: classReplacement
  });
};

var functions = [];

function createClass(_function) {
  if (typeof _function['class'] === 'undefined') {
    var createdClass = new _ClassDeclaration2['default']();
    createdClass.name = _function.id.name;

    var _constructor = new _MethodDefinition2['default']();
    _constructor.name = 'constructor';
    _constructor.body = _function.node.body;

    _function['class'] = createdClass;
    _function.node._class = createdClass;

    createdClass.body.addMethod(_constructor, true);
  }
}

function functionDetector(node, parent) {

  if (node.type === 'FunctionDeclaration') {
    var id = node.id;
    functions.push({
      id: id,
      parent: parent,
      node: node
    });
  } else if (node.type === 'VariableDeclarator' && node.init && node.init.type === 'FunctionExpression') {
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

  if (node.type === 'AssignmentExpression') {

    if (node.left.object && node.left.object.property && node.left.object.property.name === 'prototype') {

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
            var createdMethod = new _MethodDefinition2['default']();

            if (method.type === 'Identifier') {

              createdMethod.body = new _ReturnStatement2['default'](new _CallExpression2['default'](new _MemberExpression2['default'](node.right, new _Identifier2['default']('apply')), [new _ThisExpression2['default'](), new _Identifier2['default']('arguments')]));
            } else {
              createdMethod.body = method.body;
              createdMethod.params = method.params;
            }

            createdMethod.name = node.left.property.name;

            _function['class'].body.addMethod(createdMethod);

            parent._remove = true;

            this.skip();
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator['return']) {
            _iterator['return']();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }
  } else if (node.type === 'CallExpression' && node.callee && node.callee.type === 'MemberExpression' && node.callee.object.name === 'Object' && node.callee.property.name === 'defineProperty' && node.arguments[0].type === 'MemberExpression' && node.arguments[0].property.name === 'prototype' && node.arguments[1].type === 'Literal' && node.arguments[2].type === 'ObjectExpression') {

    var functionName = node.arguments[0].object.name;

    for (var i = 0; i < functions.length; i++) {
      var _function = functions[i];

      if (_function.id.name === functionName) {
        createClass(_function);
        var properties = node.arguments[2].properties;

        for (var j = 0; j < properties.length; j++) {
          var property = properties[j];

          if (property.key.name !== 'get' && property.key.name !== 'set') {
            continue;
          }

          var createdMethod = new _MethodDefinition2['default']();

          createdMethod.body = property.value.body;
          createdMethod.params = property.value.params;
          createdMethod.name = node.arguments[1].value;
          createdMethod.kind = property.key.name;

          _function['class'].body.addMethod(createdMethod);
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
module.exports = exports['default'];