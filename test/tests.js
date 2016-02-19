'use strict';

import templ18n from '../src/templ18n';

import Promise from 'bluebird';
import expect from 'unexpected';

const readFile = Promise.promisify(require("fs").readFile);
const acorn = require('acorn-jsx/inject')(require('acorn'));

describe('templ18n', () => {

  const astObject = function(code, srcType = 'module') {
    this.ast = {};
    this.code = code || '';

    this.getAST = () => {
      this.ast = acorn.parse(this.code, {
        sourceType: srcType,
        plugins: { jsx: true }
      });

      return this;
    };

    this.astToString = () => {
      this.code = JSON.stringify(this.ast, (key, value) => {
        if (key === "start") return undefined;
        else if (key === "end") return undefined;

        else return value;
      });

      return this;
    };
  };

  expect.addAssertion('<string> to be functionally equivalent <string>', function (expect, subject, value) {
    const subjectAST = new astObject(subject);
    const valueAST = new astObject(value);
    expect(subjectAST.getAST().astToString().code, 'to equal', valueAST.getAST().astToString().code);
  });

  describe('es6-modules', () => {

    const fixturesDir = './test/es6Modules';

    it('should convert TemplateLiteral(s) to Literal(s)', () => {

      Promise.all([
        readFile(`${fixturesDir}/templateLiterals.js`, 'utf8'),
        readFile(`${fixturesDir}/literals.js`, 'utf8')
      ]).then((files) => {
        const code = templ18n(files[0]);
        return expect(code, 'to be functionally equivalent', files[1]);
      });

    });
  });

});