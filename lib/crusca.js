'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generatePot = exports.tagKeys = exports.extract = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _estraverse = require('estraverse');

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var babylon = require('babylon');


var STRING_TYPES = ['TemplateLiteral', 'StringLiteral'];
var TRANSLATION_FUNC_NAME = 't';
var DEFAULT_HEADER = '# SOME DESCRIPTIVE TITLE.\n    # Copyright (C) YEAR THE PACKAGE\'S COPYRIGHT HOLDER\n    # This file is distributed under the same license as the PACKAGE package.\n    # FIRST AUTHOR <EMAIL@ADDRESS>, YEAR.\n    #\n    #, fuzzy\n    msgid ""\n    msgstr ""\n    "Project-Id-Version: PACKAGE VERSION\\n"\n    "Report-Msgid-Bugs-To: \\n"\n    "POT-Creation-Date: 2016-02-09 06:18+0000\\n"\n    "PO-Revision-Date: YEAR-MO-DA HO:MI+ZONE\\n"\n    "Last-Translator: FULL NAME <EMAIL@ADDRESS>\\n"\n    "Language-Team: LANGUAGE <LL@li.org>\\n"\n    "Language: \\n"\n    "MIME-Version: 1.0\\n"\n    "Content-Type: text/plain; charset=UTF-8\\n"\n    "Content-Transfer-Encoding: 8bit\\n"\n    ';

var extract = exports.extract = function extract(srcCode) {
  var calleeName = arguments.length <= 1 || arguments[1] === undefined ? TRANSLATION_FUNC_NAME : arguments[1];


  var AST = babylon.parse(srcCode, {
    sourceType: 'module',
    locations: true,
    plugins: ['jsx', 'objectRestSpread']
  });

  var strings = [];

  (0, _estraverse.traverse)(AST, {
    enter: function enter(node, parent) {
      if (STRING_TYPES.indexOf(node.type) !== -1) {

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
var tagKeys = exports.tagKeys = function tagKeys(tStrings, filePath) {
  var existingStrings = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];


  return tStrings.reduce(function (result, key) {

    // #: path/to/file:lineNumber
    var line = '#: ' + filePath + ':' + key.line;

    if (Array.isArray(result[key.value])) {

      // avoid duplicates when, for example, scanning the same file twice
      if (result[key.value].indexOf(line) === -1) {
        result[key.value].push(line);
      }
      return result;
    } else {
      return _extends(result, _defineProperty({}, key.value, [line]));
    }
  }, existingStrings);
};

var generatePot = exports.generatePot = function generatePot(taggedKeys) {
  var header = arguments.length <= 1 || arguments[1] === undefined ? DEFAULT_HEADER : arguments[1];

  var keyRecords = Object.keys(taggedKeys).map(function (key) {
    var fileLines = taggedKeys[key].reduce(function (result, line) {
      return result + '\n              ' + line;
    }, '');

    var escapedKey = key.replace(/"/g, '\\"');
    return fileLines + '\n      msgid "' + escapedKey + '"\n      msgstr ""\n      ';
  }).join('');

  var spaces = /\n */g;
  return (header + keyRecords).replace(spaces, '\n');
};

var getString = function getString(node) {
  if (node.type === 'StringLiteral') {
    return node.value;
  }

  return node.quasis.reduce(function (prev, curr, idx) {
    var exprId = idx < node.quasis.length - 1 ? '{' + idx + '}' : '';
    return '' + prev + curr.value.raw + exprId;
  }, '');
};

var prettyPrintNode = function prettyPrintNode() {
  for (var _len = arguments.length, nodes = Array(_len), _key = 0; _key < _len; _key++) {
    nodes[_key] = arguments[_key];
  }

  nodes.map(function (n) {
    console.log(JSON.stringify(n, null, 2));
  });
};