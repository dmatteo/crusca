'use strict';

import { extract, tagKeys, generatePot } from '../src/crusca';

import Promise from 'bluebird';
import expect from 'unexpected';

const readFile = Promise.promisify(require("fs").readFile);

describe('crusca.js', () => {

  describe('[extract] should extract translatable string', () => {

    const fixturesDir = './test/extract';
    const extractedStrings = [
      { line: 13, value: 'Template Literal' },
      { line: 16, value: 'Template Literal with {0} variable' },
      { line: 19, value: 'Template Literal with {0} and {1} variables' },
      { line: 22, value: 'Tagged Template Expression' },
      { line: 25, value: 'Tagged Template {0} with {1} Expr' },
      { line: 28, value: 'Template Literal with {0} Binary Expression' },
      { line: 31, value: 'Template Literal with {0} Call Expression' },
      { line: 34, value: 'Template Literal with {0} Member Expression' },
      { line: 37, value: 'Template Literal with {0} Member Expression' },
      { line: 40, value: 'String Literal' }
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

  describe('[tagKeys] should create an object with keys and locations', () => {

    const fixturesDir = './test/tagKeys';

    it('reading from 1 file, starting empty', () => {
      const filePath = `${fixturesDir}/simple.js`;
      return readFile(filePath, 'utf8')
        .then((code) => {
          const keys = extract(code);
          const taggedKeys = tagKeys(keys, filePath);
          return expect(taggedKeys, 'to equal', {
              'Some unique string': ['#: ./test/tagKeys/simple.js:7'],
              'String number 2': ['#: ./test/tagKeys/simple.js:9']
            }
          )

        });
    });

    it('reading from 1 file with no strings, starting empty', () => {
      const filePath = `${fixturesDir}/noStrings.js`;
      return readFile(filePath, 'utf8')
        .then((code) => {
          const keys = extract(code);
          const taggedKeys = tagKeys(keys, filePath);
          return expect(taggedKeys, 'to equal', {})

        });
    });

    it('reading from 1 file, with key reusing', () => {
      const filePath = `${fixturesDir}/withReuse.js`;
      return readFile(filePath, 'utf8')
        .then((code) => {
          const keys = extract(code);
          const taggedKeys = tagKeys(keys, filePath);
          return expect(taggedKeys, 'to equal', {
              'Some not so unique string': [
                '#: ./test/tagKeys/withReuse.js:7',
                '#: ./test/tagKeys/withReuse.js:9'
              ]
            }
          )

        });
    });

    it('reading from 1 file, starting non empty', () => {
      const startingValues = {
        'Some String': ['# ./path/to/file:42']
      };

      const filePath = `${fixturesDir}/simple.js`;
      return readFile(filePath, 'utf8')
        .then((code) => {
          const keys = extract(code);
          const taggedKeys = tagKeys(keys, filePath, startingValues);
          return expect(taggedKeys, 'to equal', {
            'Some String': ['# ./path/to/file:42'],
            'Some unique string': ['#: ./test/tagKeys/simple.js:7'],
            'String number 2': ['#: ./test/tagKeys/simple.js:9']
          })

        });
    });

    it('reading from 1 file with no strings, starting non empty', () => {
      const startingValues = {
        'Some String': ['# ./path/to/file:42']
      };

      const filePath = `${fixturesDir}/noStrings.js`;
      return readFile(filePath, 'utf8')
        .then((code) => {
          const keys = extract(code);
          const taggedKeys = tagKeys(keys, filePath, startingValues);
          return expect(taggedKeys, 'to equal', {
            'Some String': ['# ./path/to/file:42']
          })

        });
    });

    it('reading from 2 files, without key reusing', () => {
      const filePaths = [
        `${fixturesDir}/simple.js`,
        `${fixturesDir}/simple2.js`
      ];

      return Promise.all([readFile(filePaths[0], 'utf8'), readFile(filePaths[1], 'utf8')])
        .then((data) => {
          const taggedKeys = data.reduce((result, code, idx) => {
            const keys = extract(code);
            return tagKeys(keys, filePaths[idx], result)
          }, {});

          return expect(taggedKeys, 'to equal', {
            'Some unique string': ['#: ./test/tagKeys/simple.js:7'],
            'String number 2': ['#: ./test/tagKeys/simple.js:9'],
            'A different string': ['#: ./test/tagKeys/simple2.js:7']
          });
        });
    });

    it('reading from 2 files, with key reusing', () => {
      const filePaths = [
        `${fixturesDir}/simple.js`,
        `${fixturesDir}/reuseFromSimple.js`
      ];

      return Promise.all([readFile(filePaths[0], 'utf8'), readFile(filePaths[1], 'utf8')])
        .then((data) => {
          const taggedKeys = data.reduce((result, code, idx) => {
            const keys = extract(code);
            return tagKeys(keys, filePaths[idx], result)
          }, {});

          return expect(taggedKeys, 'to equal', {
            'Some unique string': ['#: ./test/tagKeys/simple.js:7'],
            'String number 2': [
              '#: ./test/tagKeys/simple.js:9',
              '#: ./test/tagKeys/reuseFromSimple.js:9'
            ],
            'Some other very unique string': ['#: ./test/tagKeys/reuseFromSimple.js:7']
          });
        });
    });

  });

  describe('[generatePot] should generate the data to write in a .pot file', () => {

    const fixturesDir = './test/generatePot';

    it('comparing to file `./test/generatePot/template.pot`', () => {

      const taggedKeys = {
        'Some unique string': ['#: ./test/tagKeys/simple.js:7'],
        'String number 2': [
          '#: ./test/tagKeys/simple.js:9',
          '#: ./test/tagKeys/reuseFromSimple.js:9'
        ],
        'Some other very unique string': ['#: ./test/tagKeys/reuseFromSimple.js:7']
      };

      return readFile(`${fixturesDir}/template.pot`, 'utf8').then((fileData) => {
        return expect(generatePot(taggedKeys), 'to be', fileData);
      });

    });

  });
});
