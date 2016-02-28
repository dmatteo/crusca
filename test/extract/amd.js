define(['jquery'] , function ($) {
  'use strict';

  return () => {
    const one = '',
      two = '',
      member = { prop: 'bananas' },
      noop = () => '';

    this.expr = 'strawberries';

    // Plain TemplateLiteral
    const plain = t(`Template Literal`);

    // { Identifier }
    const oneVariable = t(`Template Literal with ${one} variable`);

    // 2 { Identifier }
    const twoVariables = t(`Template Literal with ${one} and ${two} variables`);

    // { TaggedTemplateExpression }
    const tagged = t`Tagged Template Expression`;

    // { TaggedTemplateExpression } using 2 { Expression }
    const taggedWithExpr = t`Tagged Template ${member.prop} with ${two} Expr`;

    // { BinaryExpression }
    const binaryExpr = t(`Template Literal with ${3-2} Binary Expression`);

    // { CallExpression }
    const callExpr = t(`Template Literal with ${noop()} Call Expression`);

    // { MemberExpression }
    const memberExpression = t(`Template Literal with ${member.prop} Member Expression`);

    // { MemberExpression } using { ThisExpression }
    const thisExpression = t(`Template Literal with ${this.expr} Member Expression`);

    // Dear 'ol StringLiteral
    const plain = t('String Literal');

    /************************************************************************************
     * Nested translation functions are not yet supported
     ***********************************************************************************/
    // { CallExpression } using { TemplateLiteral }
    // const callExprAndTplLiterals = t(`Template Literal with ${t(`moar`)} Call Expression`);

    // { CallExpression } using { TemplateLiteral } using { Identifier }
    // const callExprAndComplexLiterals = t(`Template Literal with ${t(`moar ${one}`)} Call Expression`);

    const t = (string) => string;
  };

});
