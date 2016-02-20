'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.extract = undefined;

var _estraverse = require('estraverse');

var acorn = require('acorn-jsx/inject')(require('acorn'));


var TRANSLATION_FUNC_NAME = 't';

var extract = exports.extract = function extract(srcCode) {
  var calleeName = arguments.length <= 1 || arguments[1] === undefined ? TRANSLATION_FUNC_NAME : arguments[1];


  var AST = acorn.parse(srcCode, {
    sourceType: 'module',
    plugins: { jsx: true }
  });

  var strings = [];

  (0, _estraverse.traverse)(AST, {
    enter: function enter(node, parent) {
      if (node.type === 'TemplateLiteral' || node.type === 'Literal') {

        var isTarget = undefined;
        switch (parent.type) {
          case 'CallExpression':
            isTarget = parent.callee.name === calleeName;
            break;
          case 'TaggedTemplateExpression':
            isTarget = parent.tag.name === calleeName;
            break;
          default:
            isTarget = false;
        }

        if (isTarget) {
          strings.push(getString(node));
        }
      }
    },
    fallback: 'iteration'
  });

  return strings;
};

var getString = function getString(node) {
  if (node.type === 'Literal') {
    return node.value;
  }

  return node.quasis.reduce(function (prev, curr, idx) {
    var exprId = idx < node.quasis.length - 1 ? '{' + idx + '}' : '';
    return '' + prev + curr.value.raw + exprId;
  }, '');
};

var prettyPrintNode = function prettyPrintNode(node) {
  console.log(JSON.stringify(node, null, 4));
};