'use strict';

import { extract } from '../src/templ18n';

import Promise from 'bluebird';
import expect from 'unexpected';

const readFile = Promise.promisify(require("fs").readFile);

describe('templ18n', () => {

  describe('should extract strings', () => {

    const fixturesDir = './test/modules';

    const extractedStrings = [
      'Template Literal',
      'Template Literal with {0} variable',
      'Template Literal with {0} and {1} variables',
      'Tagged Template Expression',
      'Tagged Template {0} with {1} Expr',
      'Template Literal with {0} Binary Expression',
      'Template Literal with {0} Call Expression',
      'Template Literal with {0} Member Expression',
      'Template Literal with {0} Member Expression'
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