'use strict';

const acorn = require('acorn-jsx/inject')(require('acorn'));
import { traverse } from 'estraverse';

const TRANSLATION_FUNC_NAME = 't';

export const extract = (srcCode, calleeName = TRANSLATION_FUNC_NAME) => {

  const AST = acorn.parse(srcCode, {
    sourceType: 'module',
    locations: true,
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
          strings.push({
            line: node.loc.start.line,
            value: getString(node)
          });
        }

      }
    },
    fallback: 'iteration'
  });

  return strings;

};

/**
 *
 * @param { {line: Number, value: String}[] } tStrings, the output of `extract` (an array of objects
 *    containing translation key and line number in the relative file
 *
 * @param { String } filePath
 *
 * @param { Object.<Array> } existingStrings, same as result of this method
 *
 * @returns { Object.<Array>} } An object containing the translation keys and an array of location where
 *    those strings have been found
 */
export const tagKeys = (tStrings, filePath, existingStrings = {}) => {

  return tStrings.reduce((result, key) => {

    // #: path/to/file:lineNumber
    const line = `#: ${filePath}:${key.line}`;

    if (Array.isArray(result[key.value])) {

      // avoid duplicates when, for example, scanning the same file twice
      if (result[key.value].indexOf(line) === -1) {
        result[key.value].push(line);
      }

      return result;
    } else {
      return Object.assign(result, {[key.value]: [line]});
    }
  }, existingStrings);

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
