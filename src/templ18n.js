'use strict';

const acorn = require('acorn-jsx/inject')(require('acorn'));
import { replace } from 'estraverse';
import { print } from 'recast';

const TRANSLATION_FUNC_NAME = 't';
const CODEGEN_OPTIONS = {
  quote: 'single',
  tabWidth: 2
};

export default (srcCode, calleeName = TRANSLATION_FUNC_NAME, genOptions = CODEGEN_OPTIONS) => {

  const AST = acorn.parse(srcCode, {
    sourceType: 'module',
    plugins: { jsx: true }
  });

  const newTree = replace(AST, {
    enter: (node, parent) => {
      let isTarget;
      if (node.type === 'TemplateLiteral') {

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
          return {
            type: 'Literal',
            value: getString(srcCode, node)
          }
        }
      }
    },
    fallback: 'iteration'
  });

  return print(newTree, genOptions).code;

}

const getString = (code, node) => {
  return code.slice(node.start + 1, node.end - 1);
};
