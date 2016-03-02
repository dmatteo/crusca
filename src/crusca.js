'use strict';

const babylon = require('babylon');
import { traverse } from 'estraverse';

const STRING_TYPES = ['TemplateLiteral', 'StringLiteral'];
const TRANSLATION_FUNC_NAME = 't';
const DEFAULT_HEADER = `# SOME DESCRIPTIVE TITLE.
    # Copyright (C) YEAR THE PACKAGE'S COPYRIGHT HOLDER
    # This file is distributed under the same license as the PACKAGE package.
    # FIRST AUTHOR <EMAIL@ADDRESS>, YEAR.
    #
    #, fuzzy
    msgid ""
    msgstr ""
    "Project-Id-Version: PACKAGE VERSION\\n"
    "Report-Msgid-Bugs-To: \\n"
    "POT-Creation-Date: 2016-02-09 06:18+0000\\n"
    "PO-Revision-Date: YEAR-MO-DA HO:MI+ZONE\\n"
    "Last-Translator: FULL NAME <EMAIL@ADDRESS>\\n"
    "Language-Team: LANGUAGE <LL@li.org>\\n"
    "Language: \\n"
    "MIME-Version: 1.0\\n"
    "Content-Type: text/plain; charset=UTF-8\\n"
    "Content-Transfer-Encoding: 8bit\\n"
    `;

export const extract = (srcCode, calleeName = TRANSLATION_FUNC_NAME) => {

  const AST = babylon.parse(srcCode, {
    sourceType: 'module',
    locations: true,
    plugins: [
      'jsx',
      'objectRestSpread'
    ]
  });

  const strings = [];

  traverse(AST, {
    enter: (node, parent) => {
      if (STRING_TYPES.indexOf(node.type) !== -1) {

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

export const generatePot = (taggedKeys, header = DEFAULT_HEADER) => {
  const keyRecords = Object.keys(taggedKeys).map((key) => {
    const fileLines = taggedKeys[key].reduce((result, line) => {
      return `${result}
              ${line}`;
    }, '');

    const escapedKey = key.replace(/"/g, '\\"');
    return `${fileLines}
      msgid "${escapedKey}"
      msgstr ""
      `;
  }).join('');

  const spaces = /\n */g;
  return (header + keyRecords).replace(spaces, '\n');
};

const getString = (node) => {
  if (node.type === 'StringLiteral') {
    return node.value;
  }

  return node.quasis.reduce((prev, curr, idx) => {
    const exprId = idx < node.quasis.length - 1 ? `{${idx}}` : '';
    return `${prev}${curr.value.raw}${exprId}`;
  }, '');
};

const prettyPrintNode = (...nodes) => {
  nodes.map((n) => {
    console.log(JSON.stringify(n, null, 2));
  });
};
