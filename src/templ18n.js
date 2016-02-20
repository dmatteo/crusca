'use strict';

const acorn = require('acorn-jsx/inject')(require('acorn'));
import { traverse } from 'estraverse';

const TRANSLATION_FUNC_NAME = 't';

export const extract = (srcCode, calleeName = TRANSLATION_FUNC_NAME) => {

  const AST = acorn.parse(srcCode, {
    sourceType: 'module',
    plugins: { jsx: true }
  });

  const strings = [];

  traverse(AST, {
    enter: (node, parent) => {
      if (node.type === 'TemplateLiteral' || node.type === 'Literal') {

        let isTarget;
        switch(parent.type) {
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

const getString = (node) => {
  if (node.type === 'Literal') {
    return node.value;
  }

  return node.quasis.reduce((prev, curr, idx) => {
    const exprId = idx < node.quasis.length - 1 ? `{${idx}}` : '';
    return `${prev}${curr.value.raw}${exprId}`;
  }, '');
};

const prettyPrintNode = (node) => {
  console.log(JSON.stringify(node, null, 4));
};
