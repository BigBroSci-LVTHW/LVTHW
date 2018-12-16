/*************************************************************
 *
 *  MathJax/extensions/TeX/siunitx/siunitx-options-definition.js
 *
 *  Defines all options supported by siunitx
 *
 *  ---------------------------------------------------------------------
 *
 *  Copyright (c) 2016 Yves Delley, https://github.com/burnpanck
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

define(['./keyvalue-option-validation'],function(KEYVAL) {
  'use strict';
  
  var ConfigData = KEYVAL.ConfigData;
  var Switch = KEYVAL.Switch;
  var SwitchChoice = KEYVAL.SwitchChoice;
  var Choice = KEYVAL.Choice;
  var Literal = KEYVAL.Literal;
  var Macro = KEYVAL.Macro;
  var Integer = KEYVAL.Integer;
  var Math = KEYVAL.Math;
  var TeXParsedLiteral = KEYVAL.TeXParsedLiteral;


  var SIunitxOptions = ConfigData.Define({
    // Font detection
    //    'detect-all': Meta({'detect-weight':true,'detect-family':true,'detect-shape':true,'detect-mode':true}),
    'detect-display-math': Switch(),
    'detect-family': Switch(),
    'detect-inline-family': Choice('text', 'math'),
    'detect-inline-weight': Choice('text', 'math'),
    'detect-mode': Switch(),
    //    'detect-none': Meta({'detect-weight':false,'detect-family':false,'detect-shape':false,'detect-mode':false}),
    'detect-shape': Switch(),
    'detect-weight': Switch(),

    // Font options
    'color': Literal(''),
    'math-rm': Macro('\\mathrm'),
    'math-sf': Macro('\\mathsf'),
    'math-tt': Macro('\\mathtt'),
    'mode': Choice('math', 'text'),
    'text-rm': Macro('\\rmfamily'),
    'text-sf': Macro('\\sffamily'),
    'text-tt': Macro('\\ttfamily'),

    'unit-color': Literal(''),
    'unit-math-rm': Macro('\\mathrm'),
    'unit-math-sf': Macro('\\mathsf'),
    'unit-math-tt': Macro('\\mathtt'),
    'unit-mode': Choice('math', 'text'),
    'unit-text-rm': Macro('\\rmfamily'),
    'unit-text-sf': Macro('\\sffamily'),
    'unit-text-tt': Macro('\\ttfamily'),

    'number-color': Literal(''),
    'number-math-rm': Macro('\\mathrm'),
    'number-math-sf': Macro('\\mathsf'),
    'number-math-tt': Macro('\\mathtt'),
    'number-mode': Choice('math', 'text'),
    'number-text-rm': Macro('\\rmfamily'),
    'number-text-sf': Macro('\\sffamily'),
    'number-text-tt': Macro('\\ttfamily'),


    // Number parsing
    'input-close-uncertainty': Literal(')'),
    'input-comparators': Literal('<=>\\approx\\ge\\geq\\gg\\le\\leq\\ll\\sim'),
    'input-complex-roots': Literal('ij'),
    'input-decimal-markers': Literal(',.'),
    'input-digits': Literal('0123456789'),
    'input-exponent-markers': Literal('dDeE'),
    'input-ignore': Literal(''),
    'input-open-uncertainty': Literal('('),
    'input-protect-tokens': Literal('\\approx\\dots\\ge\\geq\\gg\\le\\leq\\ll\\mp\\pi\\pm\\sim'),
    'input-signs': Literal('+-\\pm\\mp'),
    'input-uncertainty-signs': Literal('\\pm'),
    'input-symbols': Literal('\\pi\\dots'),
    'parse-numbers': Switch(true),

    // Number post-processing options
    'add-decimal-zero': Switch(true),
    'add-integer-zero': Switch(true),
    'explicit-sign': Literal(''),
    'fixed-exponent': Integer(),
    'minimum-integer-digits': Integer(),
    'omit-uncertainty': Switch(),
    'retain-explicit-plus': Switch(),
    'retain-unity-mantissa': Switch(true),
    'retain-zero-exponent': Switch(),
    'round-half': Choice('up', 'even'),
    'round-integer-to-decimal': Switch(),
    'round-minimum': Literal('0'),  // Should be a Real! (does not exist in LaTeX's siunitx)
    'round-mode': Choice('off', 'figures', 'places'),
    'round-precision': Integer(2),
    'scientific-notation': SwitchChoice('false', 'true', 'fixed', 'engineering'),
    'zero-decimal-to-integer': Switch(),

    // Number output
    'bracket-negative-numbers': Switch(),
    'bracket-numbers': Switch(true),
    'close-bracket': Literal(')'),
    'complex-root-position': Choice('after-number', 'before-number'), // done
    'copy-complex-root': Switch(false),
    'copy-decimal-marker': Switch(false),
    'exponent-base': Literal('10'),				// done
    'exponent-product': Math('\\times'),		// done
    'group-digits': Choice('true', 'false', 'decimal', 'integer'),  // done
    'group-minimum-digits': Integer(5),         // done
    'group-separator': Literal('\\,'),          // done
    'negative-color': Literal(''),
    'open-bracket': Literal('('),
    'output-close-uncertainty': Literal(')'),
    'output-complex-root': Literal('\\mathrm{i}'),	// done
    'output-decimal-marker': Literal('.'),        // done
    'output-exponent-marker': Literal(''),
    'output-open-uncertainty': Literal('('),
    'separate-uncertainty': Switch(false),
    'tight-spacing': Switch(false),
    'uncertainty-separator': Literal(''),

    // Multi-part number options
    'fraction-function': Macro('\\frac'),
    'input-product': Literal('x'),              // done
    'input-quotient': Literal('/'),             // done
    'output-product': Math('\\times'),          // done
    'output-quotient': Literal('/'),            // done
    'quotient-mode': Choice('symbol', 'fraction'),

    // lists and ranges of numbers
    'list-final-separator': Literal(' and '),   // done
    'list-pair-separator': Literal(' and '),    // done
    'list-separator': Literal(', '),            // done
    'range-phrase': Literal(' to '),   // done

    // angle options
    'add-arc-degree-zero': Switch(false),
    'add-arc-minute-zero': Switch(false),
    'add-arc-second-zero': Switch(false),
    'angle-symbol-over-decimal': Switch(false),
    'arc-separator': Literal(false),
    'number-angle-product': Literal(''),

    // unit creation
    'free-standing-units': Switch(false),
    'overwrite-functions': Switch(false),
    'space-before-unit': Switch(false),
    'unit-optional-argument': Switch(false),
    'use-xspace': Switch(false),

    // additional units
    'abbreviations': Switch(true),
    'binary-units': Switch(),

    // Unit output options
    'bracket-unit-denominator': Switch(true),
    'forbid-literal-units': Switch(false),
    'literal-superscript-as-power': Switch(true),
    'inter-unit-product': Literal('\\,'),
    'parse-units': Switch(true),
    // per-mode: partially done: reciprocal, symbol, fraction
    'per-mode': Choice('reciprocal', 'reciprocal-positive-first', 'symbol', 'repeated-symbol', 'fraction', 'symbol-or-fraction'),
    'per-symbol': Literal('/'),	 // done
    'power-font': Choice('number', 'unit'),
    'prefixes-as-symbols': Switch(true),
    'qualifier-mode': Choice('subscript', 'brackets', 'phrase', 'space', 'text'),
    'sticky-per': Switch(false),

    // numbers with units
    'allow-number-unit-breaks': Switch(false),
    'exponent-to-prefix': Switch(false),
    'list-units': Choice('repeat', 'brackets', 'single'),
    'multi-part-units': Choice('brackets', 'repeat', 'single'),
    'number-unit-product': Literal('\\,'),
    'product-units': Choice('repeat', 'brackets', 'brackets-power', 'power', 'single'),
    'range-units': Choice('repeat', 'brackets', 'single')

    // Tabular material (unlikely will ever be implemented) => not declared

    // symbol options
    /*   'math-angstrom': Literal('\text{\AA}'),
     'math-arcminute': Literal('{}^{\prime}'),
     'math-arcsecond': Literal('{}^{\prime\prime}'),
     'math-celsius': Literal('{}^{\circ})\kern -\scriptspace \mathrm{C}'),
     'math-degree': Literal('{}^{\circ}'),
     'math-micro': Literal(''),
     'math-ohm': Literal('\\Omega'),
     'redefine-symbols': Switch(true),
     'text-angstrom': Literal('\\AA'),
     'text-arcminute': Literal('\ensuremath{{}^{\prime}}'),
     'text-arcsecond': Literal('\ensuremath{{}^{\prime\prime}}'),
     'text-celsius': Literal('\ensuremath{{}^{\circ}\kern -\scriptspace \text{C}}'),
     'text-degree': Literal('\ensuremath{{}^{\circ}}'),
     'text-micro': Literal(''),
     'text-ohm': Literal('\ensuremath{\Omega}')
     */
  });
  return SIunitxOptions;
});