'use strict';

import { extract } from '../src/templ18n';

import Promise from 'bluebird';
import expect from 'unexpected';

const readFile = Promise.promisify(require("fs").readFile);

describe('templ18n', () => {

  describe('[extract] should extract translatable string', () => {

    const fixturesDir = './test/modules';

    const extractedStrings = [
      { line: 13, value: 'Template Literal' },
      { line: 16, value: 'Template Literal with {0} variable' },
      { line: 19, value: 'Template Literal with {0} and {1} variables' },
      { line: 22, value: 'Tagged Template Expression' },
      { line: 25, value: 'Tagged Template {0} with {1} Expr' },
      { line: 28, value: 'Template Literal with {0} Binary Expression' },
      { line: 31, value: 'Template Literal with {0} Call Expression' },
      { line: 34, value: 'Template Literal with {0} Member Expression' },
      { line: 37, value: 'Template Literal with {0} Member Expression' }
    ];

    it('from an ES6 module', () => {

      return readFile(`${fixturesDir}/es6.js`, 'utf8')
        .then((code) => {
          const strings = extract(code);
          return expect(strings, 'to equal', extractedStrings);
        });

    });

    it('from an CommonJS module', () => {

      return readFile(`${fixturesDir}/cjs.js`, 'utf8')
        .then((code) => {
          const strings = extract(code);
          return expect(strings, 'to equal', extractedStrings);
        });

    });

    it('from an AMD module', () => {

      return readFile(`${fixturesDir}/amd.js`, 'utf8')
        .then((code) => {
          const strings = extract(code);
          return expect(strings, 'to equal', extractedStrings);
        });

    });
  });

});