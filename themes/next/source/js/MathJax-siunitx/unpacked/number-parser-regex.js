/*************************************************************
 *
 *  MathJax/extensions/TeX/siunitx/number-parser-regex.js
 *
 *  Parses numbers approximating LaTeX's siunitx number parser
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

define(['./siunitx-options-definition'],function(SIunitxOptions) {
  'use strict';
  
  var exports = {};

  var TEX = MathJax.InputJax.TeX;

  var SINumberParser = exports.SINumberParser = MathJax.Object.Subclass({
    Init: function (string, options, env) {
      this.string = string;
      this.i = 0;
      if (options === undefined)
        options = SIunitxOptions();
      else if (!(options instanceof SIunitxOptions)) {
        console.log(options,SIunitxOptions);
        throw "SINumberParser expects an options object";
      }
      this.options = options;

      this.regex = this.GenerateRegex(options);

      this.Parse();
    },
    GenerateRegex: function (options) {
      function reescape(s) {
        return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      };
      var decimal_sep = '(?:\\.|,)';
      var sign = '(\\+|-|\\\\pm|\\\\mp|\\\\le|\\\\leq|\\\\ll|\\\\ge|\\\\geq|\\\\gg|\\\\sim)';
      var digit = '[0-9]';
      var complex_root = '(?:i|j)';
      var exponent = '(?:[eEdD](-?\\d+))';
      var product = reescape(this.options['input-product']);
      var quotient = reescape(this.options['input-quotient']);

      var decimal_number = '(' + digit + '*)(?:' + decimal_sep + '(' + digit + '*))?'; // 2 grps
      var imaginary_number = '(?:' + decimal_number + complex_root + '|' + complex_root + decimal_number + ')'; // 2 + 2 = 4 grps
      var complex_number = sign + '?' + decimal_number + '(?:' + sign + imaginary_number + ')?'; // 1 + 2 + 1 + 4 = 8 grps
      var full_number = complex_number + exponent + '?'; // 8+1= 9 grps
      var multipart = '(' + product + '|' + quotient + ')'; // 1 grp
      var multi_part_number = full_number + '(?:' + multipart + '(' + full_number + '(?:' + multipart + full_number + ')*))?'; // 9+1+1+9+1+9 = 30 grps

//	  console.log(full_number);

      var ret = new RegExp('^' + multi_part_number + '$');
      return ret
    },
    Parse: function () {
      var str = this.string.replace(/\s+/gi, '');
      var replacements = {
        '+-': '\\pm',
        '-+': '\\mp',
        '<=': '\\leq',
        '>=': '\\geq',
        '<<': '\\ll',
        '>>': '\\gg',
      };
      for (key in replacements) {
        str = str.replace(key, replacements[key]);
      }
      this.parsed = this._parse_multi_part_number(str);
    },
    _parse_multi_part_number: function (str) {
      var m = this.regex.exec(str);
      if (!m) {
        return str;
      }
      var ret = this._parse_full_number(m);
      while (m[10]) {
        // an additional part is available:
        var bracket = false;
        if (m[10] == this.options['input-quotient']) {
          ret += this.options['output-quotient'];
          bracket = true;
        } else {
          ret += this.options['output-product'];
        }
        m = this.regex.exec(m[11]);
        ret += this._parse_full_number(m, bracket);
      }
      return ret;
    },
    _parse_full_number: function (m, bracket_exponent) {
      var opts = this.options;

      function PSign(sign) {
        return sign;
      }

      function PNumber(integer, decimal) {
        var gd = opts['group-digits'];
        var md = opts['group-minimum-digits'];
        var gs = '{' + opts['group-separator'] + '}';

        integer = integer || '0';
        var l = integer.length;
        if (l >= md && (gd == 'true' || gd == 'integer')) {
          l -= 3;
          for (; l > 0; l -= 3) {
            integer = integer.slice(0, l) + gs + integer.slice(l);
          }
        }

        if (!decimal)
          return integer;

        l = decimal.length;
        if (l >= md && (gd == 'true' || gd == 'decimal')) {
          l -= 1 + (l - 1) % 3;
          for (; l > 0; l -= 3) {
            decimal = decimal.slice(0, l) + gs + decimal.slice(l);
          }
        }

        return integer + '{' + opts['output-decimal-marker'] + '}' + decimal;
      }

      var exp = !!m[9];
      if (!(m[2] || m[3] || m[4]) && exp) {
        // non-complex number without mantissa
        return (m[1] ? PSign(m[1]) : '') + '10^{' + m[9] + '}';
      }
      var ret = (m[1] ? PSign(m[1]) : '') + PNumber(m[2], m[3]);
      var cplx = !!m[4];
      if (cplx) {
        // have a complex number:
        ret += PSign(m[4]);
        if (opts['complex-root-position'] === 'before-number')
          ret += opts['output-complex-root'] + PNumber(m[5] || m[7], m[6] || m[8]);
        else
          ret += PNumber(m[5] || m[7], m[6] || m[8]) + opts['output-complex-root'];
      }
      if (exp) {
        if (cplx) {
          ret = '\\left(' + ret + '\\right)';
        }
        ret += opts['exponent-product'] + ' ' + opts['exponent-base'] + '^{' + m[9] + '}';
        if (bracket_exponent)
          ret = '\\left(' + ret + '\\right)';
      }
      return ret;
    },
    mml: function () {
      return TEX.Parse(this.parsed).mml();
    }
  });

  var SINumberListParser = exports.SINumberListParser = SINumberParser.Subclass({
    Parse: function () {
      // TODO: do not process list separators via TeX parsing
      var str = this.string.replace(/\s+/gi, '');
      var numbers = str.split(';');
      var parsed = [];
      for (var idx = 0; idx < numbers.length; ++idx) {
        if (idx == numbers.length - 1) {
          if (idx == 1) {
            parsed.push('\\text{' + this.options['list-pair-separator'] + '}');
          } else if (idx) {
            parsed.push('\\text{' + this.options['list-final-separator'] + '}');
          }
        } else if (idx) {
          parsed.push('\\text{' + this.options['list-separator'] + '}');
        }
        parsed.push(this._parse_multi_part_number(numbers[idx]));
      }
      this.parsed = parsed;
    },
    mml: function () {
      return TEX.Parse(this.parsed.join('')).mml();
    }
  });

  return exports;
});