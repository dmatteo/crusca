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
      if (node.type === 'TemplateLiteral' && parent.type === 'CallExpression') {
        if (parent.callee.name === calleeName) {
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
