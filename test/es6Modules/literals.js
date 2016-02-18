'use strict';

export default () => {

  const one = '',
    two = '',
    member = { prop: 'bananas' },
    noop = () => '';

  this.expr = 'strawberries';

  /**********************************************************************************************
   *** HERE STARTS THE CONST WORLD **************************************************************
   *********************************************************************************************/

  // Plain TemplateLiteral
  const plain = t('Template Literal');

  // { Identifier }
  const oneVariable = t('Template Literal with ${one} variable');

  // 2 { Identifier }
  const twoVariables = t('Template Literal with ${one} and ${two} variables');

  // { BinaryExpression }
  const binaryExpr = t('Template Literal with ${3-2} Binary Expression');

  // { CallExpression }
  const callExpr = t('Template Literal with ${noop()} Call Expression');

  // { CallExpression } using { TemplateLiteral }
  const callExprAndTplLiterals = t('Template Literal with ${t(`moar`)} Call Expression');

  // { CallExpression } using { TemplateLiteral } using { Identifier }
  const callExprAndComplexLiterals = t('Template Literal with ${t(`moar ${one}`)} Call Expression');

  // { MemberExpression }
  const memberExpression = t('Template Literal with ${member.prop} Member Expression');

  // { MemberExpression } using { ThisExpression }
  const thisExpression = t('Template Literal with ${this.expr} Member Expression');

  /**********************************************************************************************
   *** HERE STARTS THE LET WORLD ****************************************************************
   *********************************************************************************************/

  // Plain TemplateLiteral
  let plain_let = t('Template Literal');

  // { Identifier }
  let oneVariable_let = t('Template Literal with ${one} variable');

  // 2 { Identifier }
  let twoVariables_let = t('Template Literal with ${one} and ${two} variables');

  // { BinaryExpression }
  let binaryExpr_let = t('Template Literal with ${3-2} Binary Expression');

  // { CallExpression }
  let callExpr_let = t('Template Literal with ${noop()} Call Expression');

  // { CallExpression } using { TemplateLiteral }
  let callExprAndTplLiterals_let = t('Template Literal with ${t(`moar`)} Call Expression');

  // { CallExpression } using { TemplateLiteral } using { Identifier }
  let callExprAndComplexLiterals_let = t('Template Literal with ${t(`moar ${one}`)} Call Expression');

  // { MemberExpression }
  let memberExpression_let = t('Template Literal with ${member.prop} Member Expression');

  // { MemberExpression } using { ThisExpression }
  let thisExpression_let = t('Template Literal with ${this.expr} Member Expression');

  /**********************************************************************************************
   *** HERE STARTS THE VAR WORLD ****************************************************************
   *********************************************************************************************/

  // Plain TemplateLiteral
  var plain_var = t('Template Literal');

  // { Identifier }
  var oneVariable_var = t('Template Literal with ${one} variable');

  // 2 { Identifier }
  var twoVariables_var = t('Template Literal with ${one} and ${two} variables');

  // { BinaryExpression }
  var binaryExpr_var = t('Template Literal with ${3-2} Binary Expression');

  // { CallExpression }
  var callExpr_var = t('Template Literal with ${noop()} Call Expression');

  // { CallExpression } using { TemplateLiteral }
  var callExprAndTplLiterals_var = t('Template Literal with ${t(`moar`)} Call Expression');

  // { CallExpression } using { TemplateLiteral } using { Identifier }
  var callExprAndComplexLiterals_var = t('Template Literal with ${t(`moar ${one}`)} Call Expression');

  // { MemberExpression }
  var memberExpression_var = t('Template Literal with ${member.prop} Member Expression');

  // { MemberExpression } using { ThisExpression }
  var thisExpression_var = t('Template Literal with ${this.expr} Member Expression');

};

const t = (string) => string;