/*************************************************************
 *
 *  MathJax/extensions/TeX/siunitx.js
 *
 *  Implements some of the features provided by the siunitx LaTeX package.
 *
 *  ---------------------------------------------------------------------
 *
 *  Copyright (c) 2015 Yves Delley, https://github.com/burnpanck
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

MathJax.Extension["TeX/siunitx"] = {
  version: "0.1.0"
};

MathJax.Hub.Register.StartupHook("TeX Jax Ready", function () {
  // amd-replace-start
;(function() {
/*************************************************************
 *
 *  MathJax/extensions/TeX/siunitx/keyvalue-option-validation.js
 *
 *  Generic validation framework to parse key-value pairs a la LaTeX
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
var keyvalue_option_validation, siunitx_options_definition, unit_definitions, unit_parser, number_parser_peg, number_formatter, number_parser, siunitx_commands;
keyvalue_option_validation = function () {
  var exports = {};
  var TEX = MathJax.InputJax.TeX;
  var ValidationError = exports.ValidationError = MathJax.Object.Subclass({
    Init: function (obj, name, validator, val) {
      this._errormsg = 'ValidationError: Error validating "' + name + '" of "' + obj.constructor + '" (a "' + validator + '") to "' + val + '": ';
      for (var idx = 4; idx < arguments.length; ++idx)
        this._errormsg += arguments[idx].toString();
      console.log(this._errormsg);
    },
    toString: function () {
      return this._errormsg;
    }
  });
  var ValidationBase = exports.ValidationBase = MathJax.Object.Subclass({
    PropertyDescriptor: function (cls, propname) {
      var descriptor = this;
      return {
        get: function () {
          return descriptor.Get(this, propname);
        },
        set: function (val) {
          descriptor.Set(this, propname, val);
        }
      };
    },
    Get: function (obj, propname) {
      var ret = obj._values[propname];
      if (ret !== undefined)
        return ret;
      return this._default;
    },
    Set: function (obj, propname, val) {
      obj._values[propname] = this.Validate(obj, propname, val);
    },
    Validate: function (obj, propname, val) {
      return val;
    }
  });
  var Choice = exports.Choice = ValidationBase.Subclass({
    Init: function () {
      this._default = arguments[0];
      var choices = {};
      for (var idx = 0; idx < arguments.length; idx++)
        choices[arguments[idx]] = true;
      this._choices = choices;
    },
    Validate: function (obj, name, val) {
      if (!this._choices.hasOwnProperty(val))
        throw ValidationError(obj, name, this, val, 'must be one of ["' + Object.getOwnPropertyNames(this._choices).join('", "') + '"]');
      return val;
    }
  });
  // SwitchChoice is similar to choice, but can be used as switch;
  // undefined is interpreted as selecting the second option
  var SwitchChoice = exports.SwitchChoice = Choice.Subclass({
    Init: function () {
      this._switchchoice = arguments[1];
      Choice.prototype.Init.apply(this, arguments);
    },
    Validate: function (obj, name, val) {
      if (val === undefined)
        val = this._switchchoice;
      return Choice.prototype.Validate.call(this, obj, name, val);
    }
  });
  var Integer = exports.Integer = ValidationBase.Subclass({
    Init: function (def) {
      if (def === undefined)
        def = 0;
      this._default = def;
    },
    Validate: function (obj, name, val) {
      val = parseInt(val);
      if (!Number.isInteger(val))
        throw ValidationError(obj, name, this, val, 'must be an integer');
      return val;
    }
  });
  var Literal = exports.Literal = ValidationBase.Subclass({
    Init: function (def) {
      this._default = def;
    },
    Validate: function (obj, name, val) {
      return val;
    }
  });
  // This-literal is interpreted as text-mode TeX and the corresponding mml is stored
  var TeXParsedLiteral = exports.TeXParsedLiteral = Literal.Subclass({
    Init: function (def) {
      this._default = def;
    },
    Get: function (obj, name) {
      // TODO: find out how to clone Jax-MML, such that we can store the parsed MML instead
      val = arguments.callee.SUPER.Get.call(this, obj, name);
      return TEX.Parse('\\text{' + val + '}').mml();
    }
  });
  var Math = exports.Math = Literal.Subclass({});
  var Length = exports.Length = ValidationBase.Subclass({
    Init: function (def) {
      this._default = def;
    },
    Validate: function (obj, name, val) {
      return val;  // TODO: proper validation
    }
  });
  var Macro = exports.Macro = ValidationBase.Subclass({
    Init: function (def) {
      this._default = def;
    },
    Validate: function (obj, name, val) {
      return val;  // TODO: proper validation
    }
  });
  var Switch = exports.Switch = ValidationBase.Subclass({
    Init: function (def) {
      if (def === undefined)
        def = false;
      this._default = def;
    },
    Validate: function (obj, name, val) {
      if (val === undefined)
        val = true;
      if (typeof val == 'string' || val instanceof String) {
        val = val.toLowerCase();
        if (val == 'true')
          val = true;
        else if (val == 'false')
          val = false;
      }
      if (val !== true && val !== false)
        throw ValidationError(obj, name, this, val, 'must be a boolean');
      return val;
    }
  });
  var ConfigData = exports.ConfigData = MathJax.Object.Subclass({
    Init: function (values) {
      this._values = {};
      if (values != undefined)
        this.SetMany(values);
    },
    Set: function (prop, value) {
      if (this._options[prop] === undefined) {
        throw TypeError(this.constructor + ' has no attribute named "' + prop + '"');
      } else {
        this[prop] = value;
      }
    },
    SetMany: function (values) {
      for (var prop in values)
        this.Set(prop, values[prop]);
    },
    Derived: function (values) {
      var ret = this.constructor();
      ret._values.__proto__ = this._values.__proto__;
      if (values != undefined) {
        ret.SetMany(values);
      }
      return ret;
    },
    listSettings: function (skip_initial, sep) {
      if (sep === undefined)
        sep = ',\n';
      var ret = [];
      for (var prop in this._options) {
        if (skip_initial && !this._values.hasOwnProperty(prop))
          continue;
        ret.push(prop + ' = ' + this[prop]);
      }
      return ret.join(sep);
    }
  }, {
    Define: function (definition) {
      var ret = this.Subclass({ _options: definition });
      ret.ParseOptions = this.ParseOptions;
      for (var prop in definition) {
        Object.defineProperty(ret.prototype, prop, definition[prop].PropertyDescriptor(ret, prop));
      }
      return ret;
    },
    ParseOptions: function (str) {
      var ret = {};
      str = str.trim();
      if (!str)
        return this(ret);
      var opts = str.split(',');
      for (var i = 0, l = opts.length; i < l; ++i) {
        var parts = opts[i].split('=');
        var key = parts[0].trim();
        if (!key)
          TEX.Error('Empty key in "' + str + '"');
        if (parts.length < 2) {
          ret[key] = undefined;
          continue;
        }
        var val = parts.slice(1).join('=');
        var count = 0;
        var pos = -1;
        while (true) {
          while (true) {
            var start = pos + 1;
            var open = val.indexOf('{', start);
            var close = val.indexOf('}', start);
            if (close >= 0 && (close < open || open == -1))
              pos = close;
            else
              pos = open;
            if (pos < 0)
              break;
            if (pos > 0 && val[pos - 1] == '\\') {
              continue;
            }
            if (val[pos] == '}') {
              count--;
              if (count < 0)
                TEX.Error('Too many closing braces in "' + str + '"');
            } else {
              count++;
            }
          }
          if (!count)
            break;
          pos = val.length;
          i++;
          if (i >= l)
            TEX.Error('Not enough closing braces in "' + str + '"');
          val += ',' + opts[i];
        }
        val = val.trim();
        if (val[0] == '{' && val[val.length - 1] == '}')
          val = val.slice(1, -1);
        ret[key] = val;
      }
      return this(ret);
    }
  });
  return exports;
}();
siunitx_options_definition = function (KEYVAL) {
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
    'round-minimum': Literal('0'),
    // Should be a Real! (does not exist in LaTeX's siunitx)
    'round-mode': Choice('off', 'figures', 'places'),
    'round-precision': Integer(2),
    'scientific-notation': SwitchChoice('false', 'true', 'fixed', 'engineering'),
    'zero-decimal-to-integer': Switch(),
    // Number output
    'bracket-negative-numbers': Switch(),
    'bracket-numbers': Switch(true),
    'close-bracket': Literal(')'),
    'complex-root-position': Choice('after-number', 'before-number'),
    // done
    'copy-complex-root': Switch(false),
    'copy-decimal-marker': Switch(false),
    'exponent-base': Literal('10'),
    // done
    'exponent-product': Math('\\times'),
    // done
    'group-digits': Choice('true', 'false', 'decimal', 'integer'),
    // done
    'group-minimum-digits': Integer(5),
    // done
    'group-separator': Literal('\\,'),
    // done
    'negative-color': Literal(''),
    'open-bracket': Literal('('),
    'output-close-uncertainty': Literal(')'),
    'output-complex-root': Literal('\\mathrm{i}'),
    // done
    'output-decimal-marker': Literal('.'),
    // done
    'output-exponent-marker': Literal(''),
    'output-open-uncertainty': Literal('('),
    'separate-uncertainty': Switch(false),
    'tight-spacing': Switch(false),
    'uncertainty-separator': Literal(''),
    // Multi-part number options
    'fraction-function': Macro('\\frac'),
    'input-product': Literal('x'),
    // done
    'input-quotient': Literal('/'),
    // done
    'output-product': Math('\\times'),
    // done
    'output-quotient': Literal('/'),
    // done
    'quotient-mode': Choice('symbol', 'fraction'),
    // lists and ranges of numbers
    'list-final-separator': Literal(' and '),
    // done
    'list-pair-separator': Literal(' and '),
    // done
    'list-separator': Literal(', '),
    // done
    'range-phrase': TeXParsedLiteral(' to '),
    // done
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
    'per-symbol': Literal('/'),
    // done
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
    'range-units': Choice('repeat', 'brackets', 'single')  // Tabular material (unlikely will ever be implemented) => not declared
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
}(keyvalue_option_validation);
unit_definitions = function () {
  var exports = {};
  var MML = MathJax.ElementJax.mml;
  var UNITSMACROS = exports.UNITSMACROS = {
    // powers
    per: [
      'Per',
      -1
    ],
    square: [
      'PowerPfx',
      2
    ],
    cubic: [
      'PowerPfx',
      3
    ],
    raiseto: [
      'PowerPfx',
      undefined
    ],
    squared: [
      'PowerSfx',
      2
    ],
    cubed: [
      'PowerSfx',
      3
    ],
    tothe: [
      'PowerSfx',
      undefined
    ],
    // aliases
    meter: [
      'Macro',
      '\\metre'
    ],
    deka: [
      'Macro',
      '\\deca'
    ],
    // abbreviations
    celsius: [
      'Macro',
      '\\degreeCelsius'
    ],
    kg: [
      'Macro',
      '\\kilogram'
    ],
    amu: [
      'Macro',
      '\\atomicmassunit'
    ],
    kWh: [
      'Macro',
      '\\kilo\\watt\\hour'
    ],
    // not yet supported:
    of: 'Of',
    cancel: 'Unsupported',
    highlight: 'Highlight'
  };
  // ******* SI prefixes *******************
  var SIPrefixes = MathJax.Extension['TeX/siunitx'].SIPrefixes = exports.SIPrefixes = function (def) {
    var ret = {};
    for (var pfx in def) {
      var data = def[pfx];
      ret[pfx] = {
        name: pfx,
        power: data[0],
        abbrev: data[1],
        pfx: data.length >= 3 ? data[2] : data[1]
      };
    }
    return ret;
  }({
    yocto: [
      -24,
      'y'
    ],
    zepto: [
      -21,
      'z'
    ],
    atto: [
      -18,
      'a'
    ],
    femto: [
      -15,
      'f'
    ],
    pico: [
      -12,
      'p'
    ],
    nano: [
      -9,
      'n'
    ],
    micro: [
      -6,
      'u',
      MML.entity('#x03bc')
    ],
    milli: [
      -3,
      'm'
    ],
    centi: [
      -2,
      'c'
    ],
    deci: [
      -1,
      'd'
    ],
    deca: [
      1,
      'da'
    ],
    hecto: [
      2,
      'h'
    ],
    kilo: [
      3,
      'k'
    ],
    mega: [
      6,
      'M'
    ],
    giga: [
      9,
      'G'
    ],
    tera: [
      12,
      'T'
    ],
    peta: [
      15,
      'P'
    ],
    exa: [
      18,
      'E'
    ],
    zetta: [
      21,
      'Z'
    ],
    yotta: [
      24,
      'Y'
    ]
  });
  for (var pfx in SIPrefixes) {
    pfx = SIPrefixes[pfx];
    UNITSMACROS[pfx.name] = [
      'SIPrefix',
      pfx
    ];
  }
  // ******* SI units *******************
  function _BuildUnits(category, defs) {
    var units = [];
    for (var unit in defs) {
      var def = defs[unit];
      units.push({
        name: unit,
        category: category,
        symbol: def[0],
        abbrev: def[1]
      });
    }
    return units;
  }
  var SIUnits = MathJax.Extension['TeX/siunitx'].SIUnits = exports.SIUnits = function (arr) {
    var ret = {};
    arr.forEach(function (unit) {
      ret[unit.name] = unit;
    });
    return ret;
  }([].concat(_BuildUnits('SI base', {
    ampere: [
      'A',
      'A'
    ],
    candela: ['cd'],
    kelvin: [
      'K',
      'K'
    ],
    kilogram: ['kg'],
    gram: [
      'g',
      'g'
    ],
    metre: [
      'm',
      'm'
    ],
    mole: [
      'mol',
      'mol'
    ],
    second: [
      's',
      's'
    ]
  }), _BuildUnits('coherent derived', {
    becquerel: ['Bq'],
    degreeCelsius: [MML.entity('#x2103')],
    coulomb: ['C'],
    farad: [
      'F',
      'F'
    ],
    gray: ['Gy'],
    hertz: [
      'Hz',
      'Hz'
    ],
    henry: ['H'],
    joule: [
      'J',
      'J'
    ],
    katal: ['kat'],
    lumen: ['lm'],
    lux: ['lx'],
    newton: [
      'N',
      'N'
    ],
    ohm: [
      MML.entity('#x03a9'),
      'ohm'
    ],
    pascal: [
      'Pa',
      'Pa'
    ],
    radian: ['rad'],
    siemens: ['S'],
    sievert: ['Sv'],
    steradian: ['sr'],
    tesla: ['T'],
    volt: [
      'V',
      'V'
    ],
    watt: [
      'W',
      'W'
    ],
    weber: ['Wb']
  }), _BuildUnits('accepted non-SI', {
    day: ['d'],
    degree: [MML.entity('#x00b0')],
    hectare: ['ha'],
    hour: ['h'],
    litre: [
      'l',
      'l'
    ],
    liter: [
      'L',
      'L'
    ],
    arcminute: [MML.entity('#x2032')],
    // plane angle;
    minute: ['min'],
    arcsecond: [MML.entity('#x2033')],
    // plane angle;
    tonne: ['t']
  }), _BuildUnits('experimental non-SI', {
    astronomicalunit: ['ua'],
    atomicmassunit: ['u'],
    bohr: [MML.msub(MML.mi(MML.chars('a')).With({ mathvariant: MML.VARIANT.NORMAL }), MML.mn(0))],
    // TODO: fix this
    clight: ['c0'],
    // TODO: proper subscript
    dalton: ['Da'],
    electronmass: ['me'],
    // TODO: proper subscript
    electronvolt: [
      'eV',
      'eV'
    ],
    elementarycharge: ['e'],
    hartree: ['Eh'],
    // TODO: proper subscript
    planckbar: [MML.entity('#x0127')]
  }), _BuildUnits('other non-SI', {
    angstrom: [MML.entity('#x212b')],
    bar: ['bar'],
    barn: ['b'],
    bel: ['B'],
    decibel: [
      'dB',
      'dB'
    ],
    knot: ['kn'],
    mmHg: ['mmHg'],
    nauticmile: [';'],
    neper: ['Np']
  })));
  // special units
  SIUnits.percent = {
    name: 'percent',
    symbol: '%',
    category: 'non-unit',
    abbrev: undefined
  };
  for (var unit in SIUnits) {
    unit = SIUnits[unit];
    UNITSMACROS[unit.name] = [
      'SIUnit',
      unit
    ];
  }
  // ******* unit abbreviations *******************
  /*
   * I'm too lazy to write all of the abbreviations by hand now, so here it is
   * programmatically.
   */
  var AbbrevPfx = {};
  for (var pfx in SIPrefixes) {
    pfx = SIPrefixes[pfx];
    if (pfx.abbrev) {
      AbbrevPfx[pfx.abbrev] = pfx.name;
    }
  }
  var AbbrevUnits = {};
  for (var unit in SIUnits) {
    unit = SIUnits[unit];
    if (unit.abbrev) {
      AbbrevUnits[unit.abbrev] = unit.name;
    }
  }
  function _ParseAbbrev(abbrev) {
    var unit = AbbrevUnits[abbrev];
    var repl = '';
    if (unit === undefined) {
      unit = AbbrevUnits[abbrev.slice(1)];
      if (unit === undefined) {
        // should never happen!
        console.log('cannot parse abbreviation', abbrev);
        return;
      }
      repl = AbbrevPfx[abbrev[0]];
      if (repl === undefined) {
        // should never happen!
        console.log('cannot parse prefix ', abbrev[0], ' on unit ', unit, ' (', abbrev, ')');
        return;
      }
      repl = '\\' + repl;
    }
    repl += '\\' + unit;
    return repl;
  }
  // install a number of abbrevs as macros, the same as siunitx does.
  [
    'fg pg ng ug mg g',
    'pm nm um mm cm dm m km',
    'as fs ps ns us ms s',
    'fmol pmol nmol umol mmol mol kmol',
    'pA nA uA mA A kA',
    'ul ml l hl uL mL L hL',
    'mHz Hz kHz MHz GHz THz',
    'mN N kN MN',
    'Pa kPa MPa GPa',
    'mohm kohm Mohm',
    'pV nV uV mV V kV',
    'uW mW W kW MW GW',
    'J kJ',
    'meV eV keV MeV GeV TeV',
    'fF pF F',
    'K',
    'dB'
  ].forEach(function (abbrset) {
    abbrset.split(' ').forEach(function (abbrev) {
      UNITSMACROS[abbrev] = [
        'Macro',
        _ParseAbbrev(abbrev)
      ];
    });
  });
  return exports;
}();
unit_parser = function (UNITDEFS) {
  var TEX = MathJax.InputJax.TeX;
  var STACK = TEX.Stack;
  var STACKITEM = STACK.Item;
  var MML = MathJax.ElementJax.mml;
  var UNITSMACROS = UNITDEFS.UNITSMACROS;
  var SIUnitParser = MathJax.Extension['TeX/siunitx'].SIUnitParser = TEX.Parse.Subclass({
    Init: function (string, options, env) {
      this.cur_prefix = undefined;
      this.cur_pfxpow = undefined;
      this.per_active = false;
      this.has_literal = false;
      // Set to true if non-siunitx LaTeX is encountered in input
      this.literal_chars = '';
      // building unit char by char
      this.units = [];
      this.options = options;
      arguments.callee.SUPER.Init.call(this, string, env);  /*	  if(this.has_literal){
                                                            console.log('Unit "',string,'" was parsed literally ',this.units);
                                                            } else {
                                                            console.log('Unit "',string,'" was parsed as these units: ',this.units);
                                                            }*/
    },
    mml: function () {
      if (!this.has_literal) {
        // no literal, all information in this.units
        // => generate fresh MML here
        var stack = TEX.Stack({}, true);
        var permode = this.options['per-mode'];
        var mythis = this;
        var all = [];
        var norm = [];
        var recip = [];
        this.units.forEach(function (unit) {
          var power = unit.power === undefined ? 1 : unit.power;
          if (unit.inverse)
            power = -power;
          if (power > 0) {
            norm.push(unit);
          } else {
            recip.push(unit);
          }
          all.push(unit);
        });
        if (permode === 'reciprocal' || !recip.length) {
          all.forEach(function (u) {
            stack.Push(mythis.UnitMML(u));
          });
        } else if (permode === 'symbol') {
          norm.forEach(function (u) {
            stack.Push(mythis.UnitMML(u));
          });
          stack.Push(this.mmlToken(MML.mo(MML.chars(this.options['per-symbol']).With({
            fence: false,
            stretchy: false
          }))));
          if (recip.length === 1) {
            var u = recip[0];
            u.inverse = false;
            stack.Push(this.UnitMML(u));
          } else {
            stack.Push(this.mmlToken(MML.mo(MML.chars('(').With({
              fence: false,
              stretchy: false
            }))));
            recip.forEach(function (u) {
              u.inverse = false;
              stack.Push(mythis.UnitMML(u));
            });
            stack.Push(this.mmlToken(MML.mo(MML.chars(')').With({
              fence: false,
              stretchy: false
            }))));
          }
        } else if (permode === 'fraction') {
          var num = TEX.Stack({}, true);
          var den = TEX.Stack({}, true);
          norm.forEach(function (u) {
            num.Push(mythis.UnitMML(u));
          });
          recip.forEach(function (u) {
            u.inverse = false;
            den.Push(mythis.UnitMML(u));
          });
          num.Push(STACKITEM.stop());
          den.Push(STACKITEM.stop());
          stack.Push(MML.mfrac(num.Top().data[0], den.Top().data[0]));
        } else {
          TEX.Error('Unimplemented per-mode ' + permode);
        }
        stack.Push(STACKITEM.stop());
        if (stack.Top().type !== 'mml') {
          return null;
        }
        return stack.Top().data[0];
      }
      if (this.stack.Top().type !== 'mml') {
        return null;
      }
      return this.stack.Top().data[0];
    },
    // This is used to identify non-siunitx LaTeX in the input
    Push: function () {
      this.finishLiteralUnit();
      // in case we're still caching some chars
      for (var idx = 0; idx < arguments.length; idx++) {
        var arg = arguments[idx];
        if (!(arg instanceof STACKITEM.stop)) {
          //                console.log('litera linput ',arg);
          this.has_literal = true;
        }
        this.stack.Push.call(this.stack, arg);
      }
    },
    // While literal fall-back output from proper unit macros use this path
    PushUnitFallBack: function () {
      this.stack.Push.apply(this.stack, arguments);
    },
    csFindMacro: function (name) {
      this.finishLiteralUnit();
      // any macro should finish previous units
      var macro = UNITSMACROS[name];
      if (macro)
        return macro;
      return arguments.callee.SUPER.csFindMacro.call(this, name);
    },
    /*
     *  Handle a single letter
     */
    Variable: function (c) {
      this.literal_chars += c;
    },
    // the dot ('.') is considered a number!
    Number: function (c) {
      if (c == '.')
        return this.finishLiteralUnit();
      arguments.callee.SUPER.Number.call(this, c);
    },
    // here, it's a unit separator
    Tilde: function (c) {
      this.finishLiteralUnit();
    },
    /*
     *  Handle ^, _, and '
     */
    Superscript: function (c) {
      this.finishLiteralUnit();
      arguments.callee.SUPER.Superscript.call(this, c);
    },
    Subscript: function (c) {
      this.finishLiteralUnit();
      arguments.callee.SUPER.Subscript.call(this, c);
    },
    Unsupported: function () {
    },
    // ignore this macro
    Of: function (name) {
      var what = this.GetArgument(name);
      if (this.has_literal) {
        // unit is already gone, best we can do is add a superscript
        TEX.Error([
          'SIunitx',
          'NotImplementedYet'
        ]);
      }
      if (!this.units.length) {
        TEX.Error([
          'SIunitx',
          'Qualification suffix with no unit'
        ]);
      }
      var unit = this.units[this.units.length - 1];
      if (unit.power !== undefined) {
        TEX.Error([
          'SIunitx',
          'double qualification',
          unit.qual,
          what
        ]);
      }
      unit.qual = what;
    },
    Highlight: function (name) {
      var color = this.GetArgument(name);
      this.cur_highlight = color;
    },
    Per: function (name) {
      if (this.per_active) {
        TEX.Error([
          'SIunitx',
          'double \\per'
        ]);
        return;
      }
      this.per_active = true;
    },
    PowerPfx: function (name, pow) {
      if (pow === undefined) {
        pow = this.GetArgument(name);
      }
      if (this.cur_pfxpow) {
        TEX.Error([
          'SIunitx',
          'double power prefix',
          this.cur_pfxpow,
          pow
        ]);
      }
      this.cur_pfxpow = pow;
    },
    PowerSfx: function (name, pow) {
      if (pow === undefined) {
        pow = this.GetArgument(name);
      }
      if (this.has_literal) {
        // unit is already gone, best we can do is add a superscript
        TEX.Error([
          'SIunitx',
          'NotImplementedYet'
        ]);
      }
      if (!this.units.length) {
        TEX.Error([
          'SIunitx',
          'Power suffix with no unit'
        ]);
      }
      var unit = this.units[this.units.length - 1];
      if (unit.power !== undefined) {
        TEX.Error([
          'SIunitx',
          'double power',
          unit.power,
          pow
        ]);
      }
      unit.power = pow;
    },
    SIPrefix: function (name, pfx) {
      if (this.cur_prefix) {
        TEX.Error([
          'SIunitx',
          'double SI prefix',
          this.cur_prefix,
          pfx
        ]);
      }
      this.cur_prefix = pfx;
    },
    UnitMML: function (unit) {
      var parts = [];
      if (unit.prefix)
        parts = parts.concat(unit.prefix.pfx);
      parts = parts.concat(unit.unit.symbol);
      var curstring = '';
      var content = [];
      parts.forEach(function (p) {
        if (typeof p == 'string' || p instanceof String) {
          curstring += p;
        } else {
          if (curstring) {
            content.push(MML.chars(curstring));
            curstring = '';
          }
          content.push(p);
        }
      });
      if (curstring)
        content.push(MML.chars(curstring));
      var def = { mathvariant: MML.VARIANT.NORMAL };
      var mml = MML.mi.apply(MML.mi, content).With(def);
      var power = unit.power === undefined ? 1 : unit.power;
      if (unit.inverse)
        power = -power;
      if (power != 1) {
        if (unit.qual === undefined)
          mml = MML.msup(mml, MML.mn(power));
        else
          mml = MML.msubsup(mml, MML.mtext(unit.qual), MML.mn(power));
      } else if (unit.qual !== undefined) {
        mml = MML.msub(mml, MML.mtext(unit.qual));
      }
      return this.mmlToken(mml);
    },
    SIUnit: function (name, unit) {
      this.pushUnit(unit);
    },
    finishLiteralUnit: function () {
      if (!this.literal_chars)
        return;
      this.pushUnit({
        symbol: this.literal_chars,
        name: undefined,
        category: 'literal',
        abbrev: this.literal_chars
      });
      this.literal_chars = '';
    },
    pushUnit: function (unit) {
      // Add to units
      this.units.push({
        unit: unit,
        prefix: this.cur_prefix,
        power: this.cur_pfxpow,
        inverse: this.per_active,
        qual: undefined  // qualification
      });
      // And process fall-back
      var parts = [];
      if (this.cur_prefix)
        parts = parts.concat(this.cur_prefix.pfx);
      parts = parts.concat(unit.symbol);
      var curstring = '';
      var content = [];
      parts.forEach(function (p) {
        if (typeof p == 'string' || p instanceof String) {
          curstring += p;
        } else {
          if (curstring) {
            content.push(MML.chars(curstring));
            curstring = '';
          }
          content.push(p);
        }
      });
      if (curstring)
        content.push(MML.chars(curstring));
      var def = { mathvariant: MML.VARIANT.NORMAL };
      this.PushUnitFallBack(this.mmlToken(MML.mi.apply(MML.mi, content).With(def)));
      this.cur_prefix = undefined;
      this.cur_pfxpow = undefined;
      if (!this.options['sticky-per'])
        this.per_active = false;
    }
  });
  return SIUnitParser;
}(unit_definitions);
number_parser_peg = function () {
  'use strict';
  /*
   * Generated by PEG.js 0.9.0.
   *
   * http://pegjs.org/
   */
  function peg$subclass(child, parent) {
    function ctor() {
      this.constructor = child;
    }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor();
  }
  function peg$SyntaxError(message, expected, found, location) {
    this.message = message;
    this.expected = expected;
    this.found = found;
    this.location = location;
    this.name = 'SyntaxError';
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, peg$SyntaxError);
    }
  }
  peg$subclass(peg$SyntaxError, Error);
  function peg$parse(input) {
    var options = arguments.length > 1 ? arguments[1] : {}, parser = this, peg$FAILED = {}, peg$startRuleIndices = { start: 0 }, peg$startRuleIndex = 0, peg$consts = [
        function (prod) {
          return prod;
        },
        {
          type: 'other',
          description: 'complex root'
        },
        function (s) {
          return options['input-complex-roots'].indexOf(s) >= 0;
        },
        function (s) {
          return s;
        },
        {
          type: 'other',
          description: 'decimal marker'
        },
        function (s) {
          return options['input-decimal-markers'].indexOf(s) >= 0;
        },
        {
          type: 'other',
          description: 'exponent marker'
        },
        function (s) {
          return options['input-exponent-markers'].indexOf(s) >= 0;
        },
        {
          type: 'any',
          description: 'any character'
        },
        function (head, tail) {
          var ret = [head];
          tail.forEach(function (f) {
            ret.push(f[1]);
          });
          return ret;
        },
        'x',
        {
          type: 'literal',
          value: 'x',
          description: '"x"'
        },
        function (num) {
          return num;
        },
        '/',
        {
          type: 'literal',
          value: '/',
          description: '"/"'
        },
        function (num, denom) {
          return {
            num: num,
            denom: denom && denom[3]
          };
        },
        function (rel, mantissa, exp) {
          mantissa.exp = exp && exp[1];
          mantissa.rel = rel && rel[0];
          return mantissa;
        },
        function (rel, sign, exp) {
          var ret = {
            sign: sign && sign[0],
            exp: exp,
            rel: rel && rel[0]
          };
          return ret;
        },
        function (re, im) {
          var res = re[0] && re[0][0];
          re = re[1];
          re.sign = res;
          var ims = im && im[1];
          im = im && im[3];
          if (im)
            im.sign = ims;
          return {
            re: re,
            im: im
          };
        },
        function (sign, num) {
          num.sign = sign && sign[0];
          return { re: num };
        },
        function (sign, num, uncert) {
          var n = num.frac.length;
          var m = uncert.frac.length;
          num.frac = num.frac + repeat('0', Math.max(0, m - n));
          uncert.frac = uncert.frac + repeat('0', Math.max(0, n - m));
          num.uncert = uncert.int + uncert.frac;
          num.sign = sign && sign[0];
          return { re: num };
        },
        function (num, root) {
          num.root = root;
          return num;
        },
        function (root, num) {
          num.root = root;
          return num;
        },
        function (sign, exponent) {
          exponent.sign = sign && sign[0];
          return exponent;
        },
        /^[+\-]/,
        {
          type: 'class',
          value: '[+-]',
          description: '[+-]'
        },
        function () {
          return text();
        },
        '+-',
        {
          type: 'literal',
          value: '+-',
          description: '"+-"'
        },
        '\\pm',
        {
          type: 'literal',
          value: '\\pm',
          description: '"\\\\pm"'
        },
        function () {
          return '\\pm';
        },
        '-+',
        {
          type: 'literal',
          value: '-+',
          description: '"-+"'
        },
        '\\mp',
        {
          type: 'literal',
          value: '\\mp',
          description: '"\\\\mp"'
        },
        function () {
          return '\\mp';
        },
        '<<',
        {
          type: 'literal',
          value: '<<',
          description: '"<<"'
        },
        '\\ll',
        {
          type: 'literal',
          value: '\\ll',
          description: '"\\\\ll"'
        },
        function () {
          return '\\ll';
        },
        '<',
        {
          type: 'literal',
          value: '<',
          description: '"<"'
        },
        function () {
          return '<';
        },
        '<=',
        {
          type: 'literal',
          value: '<=',
          description: '"<="'
        },
        '\\le',
        {
          type: 'literal',
          value: '\\le',
          description: '"\\\\le"'
        },
        'q',
        {
          type: 'literal',
          value: 'q',
          description: '"q"'
        },
        function () {
          return '\\le';
        },
        '>>',
        {
          type: 'literal',
          value: '>>',
          description: '">>"'
        },
        '\\gg',
        {
          type: 'literal',
          value: '\\gg',
          description: '"\\\\gg"'
        },
        function () {
          return '\\gg';
        },
        '>',
        {
          type: 'literal',
          value: '>',
          description: '">"'
        },
        function () {
          return '>';
        },
        '>=',
        {
          type: 'literal',
          value: '>=',
          description: '">="'
        },
        '\\ge',
        {
          type: 'literal',
          value: '\\ge',
          description: '"\\\\ge"'
        },
        function () {
          return '\\ge';
        },
        '(',
        {
          type: 'literal',
          value: '(',
          description: '"("'
        },
        ')',
        {
          type: 'literal',
          value: ')',
          description: '")"'
        },
        function (num, uncert) {
          uncert = uncert && uncert[3];
          num.uncert = uncert;
          return num;
        },
        {
          type: 'other',
          description: 'decimal'
        },
        function (int, rest) {
          var sep = rest && rest[1];
          var frac = rest && rest[2] && rest[2][1];
          return {
            int: int,
            sep: sep,
            frac: frac || ''
          };
        },
        function (sep, frac) {
          return {
            int: '',
            sep: sep,
            frac: frac
          };
        },
        {
          type: 'other',
          description: 'integer'
        },
        function () {
          return parseInt(text(), 10);
        },
        /^[0-9]/,
        {
          type: 'class',
          value: '[0-9]',
          description: '[0-9]'
        },
        function () {
          return text();
        },
        {
          type: 'other',
          description: 'whitespace'
        },
        /^[ \t\n\r]/,
        {
          type: 'class',
          value: '[ \\t\\n\\r]',
          description: '[ \\t\\n\\r]'
        }
      ], peg$bytecode = [
        peg$decode('%;D/:#;%/1$;D/($8#: #!!)(#\'#("\'#&\'#'),
        peg$decode('<%;$/<#9:" ! -""&!&#/($8":#"!!)("\'#&\'#=." 7!'),
        peg$decode('<%;$/<#9:% ! -""&!&#/($8":#"!!)("\'#&\'#=." 7$'),
        peg$decode('<%;$/<#9:\' ! -""&!&#/($8":#"!!)("\'#&\'#=." 7&'),
        peg$decode('1""5!7('),
        peg$decode('%;\'/_#$%;D/,#;&/#$+")("\'#&\'#06*%;D/,#;&/#$+")("\'#&\'#&/)$8":)""! )("\'#&\'#'),
        peg$decode('%2*""6*7+/:#;D/1$;\'/($8#:,#! )(#\'#("\'#&\'#'),
        peg$decode('%;(/b#%;D/D#2-""6-7./5$;D/,$;(/#$+$)($\'#(#\'#("\'#&\'#." &"/)$8":/""! )("\'#&\'#'),
        peg$decode(';*.# &;)'),
        peg$decode('%%;=/,#;D/#$+")("\'#&\'#." &"/T#;+/K$%;D/,#;2/#$+")("\'#&\'#." &"/*$8#:0##"! )(#\'#("\'#&\'#'),
        peg$decode('%%;=/,#;D/#$+")("\'#&\'#." &"/T#%;6/,#;D/#$+")("\'#&\'#." &"/3$;2/*$8#:1##"! )(#\'#("\'#&\'#'),
        peg$decode(';,.) &;..# &;-'),
        peg$decode('%%%;6/,#;D/#$+")("\'#&\'#." &"/,#;>/#$+")("\'#&\'#/W#%;D/>#;6/5$;D/,$;//#$+$)($\'#(#\'#("\'#&\'#/)$8":2""! )("\'#&\'#'),
        peg$decode('%%;6/,#;D/#$+")("\'#&\'#." &"/2#;>/)$8":3""! )("\'#&\'#'),
        peg$decode('%%;6/,#;D/#$+")("\'#&\'#." &"/W#;?/N$;D/E$;4/<$;D/3$;?/*$8&:4&#%$ )(&\'#(%\'#($\'#(#\'#("\'#&\'#'),
        peg$decode(';0.# &;1'),
        peg$decode('%;>/;#;D/2$;!/)$8#:5#"" )(#\'#("\'#&\'#'),
        peg$decode('%;!/;#;D/2$;>/)$8#:6#"" )(#\'#("\'#&\'#'),
        peg$decode('%;#/\\#;D/S$%;3/,#;D/#$+")("\'#&\'#." &"/2$;?/)$8$:7$"! )($\'#(#\'#("\'#&\'#'),
        peg$decode('%48""5!79/& 8!::! )'),
        peg$decode('%2;""6;7<.) &2=""6=7>/& 8!:?! )'),
        peg$decode('%2@""6@7A.) &2B""6B7C/& 8!:D! )'),
        peg$decode(';4.) &;5.# &;3'),
        peg$decode('%2E""6E7F.) &2G""6G7H/& 8!:I! )'),
        peg$decode('%2J""6J7K/& 8!:L! )'),
        peg$decode('%2M""6M7N.G &%2O""6O7P/7#2Q""6Q7R." &"/#$+")("\'#&\'#/& 8!:S! )'),
        peg$decode('%2T""6T7U.) &2V""6V7W/& 8!:X! )'),
        peg$decode('%2Y""6Y7Z/& 8!:[! )'),
        peg$decode('%2\\""6\\7].G &%2^""6^7_/7#2Q""6Q7R." &"/#$+")("\'#&\'#/& 8!:`! )'),
        peg$decode(';7.; &;9.5 &;8./ &;:.) &;<.# &;;'),
        peg$decode('%;?/z#%;D/\\#2a""6a7b/M$;D/D$;C/;$;D/2$2c""6c7d/#$+&)(&\'#(%\'#($\'#(#\'#("\'#&\'#." &"/)$8":e""! )("\'#&\'#'),
        peg$decode('<;@.# &;A=." 7f'),
        peg$decode('%;C/k#%;D/M#;"/D$%;D/,#;C/#$+")("\'#&\'#." &"/#$+#)(#\'#("\'#&\'#." &"/)$8":g""! )("\'#&\'#'),
        peg$decode('%;"/;#;D/2$;C/)$8#:h#"" )(#\'#("\'#&\'#'),
        peg$decode('<%;C/& 8!:j! )=." 7i'),
        peg$decode('%$4k""5!7l/,#0)*4k""5!7l&&&#/& 8!:m! )'),
        peg$decode('<$4o""5!7p0)*4o""5!7p&=." 7n')
      ], peg$currPos = 0, peg$savedPos = 0, peg$posDetailsCache = [{
          line: 1,
          column: 1,
          seenCR: false
        }], peg$maxFailPos = 0, peg$maxFailExpected = [], peg$silentFails = 0, peg$result;
    if ('startRule' in options) {
      if (!(options.startRule in peg$startRuleIndices)) {
        throw new Error('Can\'t start parsing from rule "' + options.startRule + '".');
      }
      peg$startRuleIndex = peg$startRuleIndices[options.startRule];
    }
    function text() {
      return input.substring(peg$savedPos, peg$currPos);
    }
    function location() {
      return peg$computeLocation(peg$savedPos, peg$currPos);
    }
    function expected(description) {
      throw peg$buildException(null, [{
          type: 'other',
          description: description
        }], input.substring(peg$savedPos, peg$currPos), peg$computeLocation(peg$savedPos, peg$currPos));
    }
    function error(message) {
      throw peg$buildException(message, null, input.substring(peg$savedPos, peg$currPos), peg$computeLocation(peg$savedPos, peg$currPos));
    }
    function peg$computePosDetails(pos) {
      var details = peg$posDetailsCache[pos], p, ch;
      if (details) {
        return details;
      } else {
        p = pos - 1;
        while (!peg$posDetailsCache[p]) {
          p--;
        }
        details = peg$posDetailsCache[p];
        details = {
          line: details.line,
          column: details.column,
          seenCR: details.seenCR
        };
        while (p < pos) {
          ch = input.charAt(p);
          if (ch === '\n') {
            if (!details.seenCR) {
              details.line++;
            }
            details.column = 1;
            details.seenCR = false;
          } else if (ch === '\r' || ch === '\u2028' || ch === '\u2029') {
            details.line++;
            details.column = 1;
            details.seenCR = true;
          } else {
            details.column++;
            details.seenCR = false;
          }
          p++;
        }
        peg$posDetailsCache[pos] = details;
        return details;
      }
    }
    function peg$computeLocation(startPos, endPos) {
      var startPosDetails = peg$computePosDetails(startPos), endPosDetails = peg$computePosDetails(endPos);
      return {
        start: {
          offset: startPos,
          line: startPosDetails.line,
          column: startPosDetails.column
        },
        end: {
          offset: endPos,
          line: endPosDetails.line,
          column: endPosDetails.column
        }
      };
    }
    function peg$fail(expected) {
      if (peg$currPos < peg$maxFailPos) {
        return;
      }
      if (peg$currPos > peg$maxFailPos) {
        peg$maxFailPos = peg$currPos;
        peg$maxFailExpected = [];
      }
      peg$maxFailExpected.push(expected);
    }
    function peg$buildException(message, expected, found, location) {
      function cleanupExpected(expected) {
        var i = 1;
        expected.sort(function (a, b) {
          if (a.description < b.description) {
            return -1;
          } else if (a.description > b.description) {
            return 1;
          } else {
            return 0;
          }
        });
        while (i < expected.length) {
          if (expected[i - 1] === expected[i]) {
            expected.splice(i, 1);
          } else {
            i++;
          }
        }
      }
      function buildMessage(expected, found) {
        function stringEscape(s) {
          function hex(ch) {
            return ch.charCodeAt(0).toString(16).toUpperCase();
          }
          return s.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\x08/g, '\\b').replace(/\t/g, '\\t').replace(/\n/g, '\\n').replace(/\f/g, '\\f').replace(/\r/g, '\\r').replace(/[\x00-\x07\x0B\x0E\x0F]/g, function (ch) {
            return '\\x0' + hex(ch);
          }).replace(/[\x10-\x1F\x80-\xFF]/g, function (ch) {
            return '\\x' + hex(ch);
          }).replace(/[\u0100-\u0FFF]/g, function (ch) {
            return '\\u0' + hex(ch);
          }).replace(/[\u1000-\uFFFF]/g, function (ch) {
            return '\\u' + hex(ch);
          });
        }
        var expectedDescs = new Array(expected.length), expectedDesc, foundDesc, i;
        for (i = 0; i < expected.length; i++) {
          expectedDescs[i] = expected[i].description;
        }
        expectedDesc = expected.length > 1 ? expectedDescs.slice(0, -1).join(', ') + ' or ' + expectedDescs[expected.length - 1] : expectedDescs[0];
        foundDesc = found ? '"' + stringEscape(found) + '"' : 'end of input';
        return 'Expected ' + expectedDesc + ' but ' + foundDesc + ' found.';
      }
      if (expected !== null) {
        cleanupExpected(expected);
      }
      return new peg$SyntaxError(message !== null ? message : buildMessage(expected, found), expected, found, location);
    }
    function peg$decode(s) {
      var bc = new Array(s.length), i;
      for (i = 0; i < s.length; i++) {
        bc[i] = s.charCodeAt(i) - 32;
      }
      return bc;
    }
    function peg$parseRule(index) {
      var bc = peg$bytecode[index], ip = 0, ips = [], end = bc.length, ends = [], stack = [], params, i;
      while (true) {
        while (ip < end) {
          switch (bc[ip]) {
          case 0:
            stack.push(peg$consts[bc[ip + 1]]);
            ip += 2;
            break;
          case 1:
            stack.push(void 0);
            ip++;
            break;
          case 2:
            stack.push(null);
            ip++;
            break;
          case 3:
            stack.push(peg$FAILED);
            ip++;
            break;
          case 4:
            stack.push([]);
            ip++;
            break;
          case 5:
            stack.push(peg$currPos);
            ip++;
            break;
          case 6:
            stack.pop();
            ip++;
            break;
          case 7:
            peg$currPos = stack.pop();
            ip++;
            break;
          case 8:
            stack.length -= bc[ip + 1];
            ip += 2;
            break;
          case 9:
            stack.splice(-2, 1);
            ip++;
            break;
          case 10:
            stack[stack.length - 2].push(stack.pop());
            ip++;
            break;
          case 11:
            stack.push(stack.splice(stack.length - bc[ip + 1], bc[ip + 1]));
            ip += 2;
            break;
          case 12:
            stack.push(input.substring(stack.pop(), peg$currPos));
            ip++;
            break;
          case 13:
            ends.push(end);
            ips.push(ip + 3 + bc[ip + 1] + bc[ip + 2]);
            if (stack[stack.length - 1]) {
              end = ip + 3 + bc[ip + 1];
              ip += 3;
            } else {
              end = ip + 3 + bc[ip + 1] + bc[ip + 2];
              ip += 3 + bc[ip + 1];
            }
            break;
          case 14:
            ends.push(end);
            ips.push(ip + 3 + bc[ip + 1] + bc[ip + 2]);
            if (stack[stack.length - 1] === peg$FAILED) {
              end = ip + 3 + bc[ip + 1];
              ip += 3;
            } else {
              end = ip + 3 + bc[ip + 1] + bc[ip + 2];
              ip += 3 + bc[ip + 1];
            }
            break;
          case 15:
            ends.push(end);
            ips.push(ip + 3 + bc[ip + 1] + bc[ip + 2]);
            if (stack[stack.length - 1] !== peg$FAILED) {
              end = ip + 3 + bc[ip + 1];
              ip += 3;
            } else {
              end = ip + 3 + bc[ip + 1] + bc[ip + 2];
              ip += 3 + bc[ip + 1];
            }
            break;
          case 16:
            if (stack[stack.length - 1] !== peg$FAILED) {
              ends.push(end);
              ips.push(ip);
              end = ip + 2 + bc[ip + 1];
              ip += 2;
            } else {
              ip += 2 + bc[ip + 1];
            }
            break;
          case 17:
            ends.push(end);
            ips.push(ip + 3 + bc[ip + 1] + bc[ip + 2]);
            if (input.length > peg$currPos) {
              end = ip + 3 + bc[ip + 1];
              ip += 3;
            } else {
              end = ip + 3 + bc[ip + 1] + bc[ip + 2];
              ip += 3 + bc[ip + 1];
            }
            break;
          case 18:
            ends.push(end);
            ips.push(ip + 4 + bc[ip + 2] + bc[ip + 3]);
            if (input.substr(peg$currPos, peg$consts[bc[ip + 1]].length) === peg$consts[bc[ip + 1]]) {
              end = ip + 4 + bc[ip + 2];
              ip += 4;
            } else {
              end = ip + 4 + bc[ip + 2] + bc[ip + 3];
              ip += 4 + bc[ip + 2];
            }
            break;
          case 19:
            ends.push(end);
            ips.push(ip + 4 + bc[ip + 2] + bc[ip + 3]);
            if (input.substr(peg$currPos, peg$consts[bc[ip + 1]].length).toLowerCase() === peg$consts[bc[ip + 1]]) {
              end = ip + 4 + bc[ip + 2];
              ip += 4;
            } else {
              end = ip + 4 + bc[ip + 2] + bc[ip + 3];
              ip += 4 + bc[ip + 2];
            }
            break;
          case 20:
            ends.push(end);
            ips.push(ip + 4 + bc[ip + 2] + bc[ip + 3]);
            if (peg$consts[bc[ip + 1]].test(input.charAt(peg$currPos))) {
              end = ip + 4 + bc[ip + 2];
              ip += 4;
            } else {
              end = ip + 4 + bc[ip + 2] + bc[ip + 3];
              ip += 4 + bc[ip + 2];
            }
            break;
          case 21:
            stack.push(input.substr(peg$currPos, bc[ip + 1]));
            peg$currPos += bc[ip + 1];
            ip += 2;
            break;
          case 22:
            stack.push(peg$consts[bc[ip + 1]]);
            peg$currPos += peg$consts[bc[ip + 1]].length;
            ip += 2;
            break;
          case 23:
            stack.push(peg$FAILED);
            if (peg$silentFails === 0) {
              peg$fail(peg$consts[bc[ip + 1]]);
            }
            ip += 2;
            break;
          case 24:
            peg$savedPos = stack[stack.length - 1 - bc[ip + 1]];
            ip += 2;
            break;
          case 25:
            peg$savedPos = peg$currPos;
            ip++;
            break;
          case 26:
            params = bc.slice(ip + 4, ip + 4 + bc[ip + 3]);
            for (i = 0; i < bc[ip + 3]; i++) {
              params[i] = stack[stack.length - 1 - params[i]];
            }
            stack.splice(stack.length - bc[ip + 2], bc[ip + 2], peg$consts[bc[ip + 1]].apply(null, params));
            ip += 4 + bc[ip + 3];
            break;
          case 27:
            stack.push(peg$parseRule(bc[ip + 1]));
            ip += 2;
            break;
          case 28:
            peg$silentFails++;
            ip++;
            break;
          case 29:
            peg$silentFails--;
            ip++;
            break;
          default:
            throw new Error('Invalid opcode: ' + bc[ip] + '.');
          }
        }
        if (ends.length > 0) {
          end = ends.pop();
          ip = ips.pop();
        } else {
          break;
        }
      }
      return stack[0];
    }
    // These are mainly here to experiment with the parser in peg's online playground
    var default_options = {
      'input-complex-roots': 'ij',
      'input-decimal-markers': '.,',
      'input-exponent-markers': 'eEdD'
    };
    // var options = default_options;
    function repeat(pattern, count) {
      if (count < 1)
        return '';
      var result = '';
      while (count > 1) {
        if (count & 1)
          result += pattern;
        count >>= 1, pattern += pattern;
      }
      return result + pattern;
    }
    peg$result = peg$parseRule(peg$startRuleIndex);
    if (peg$result !== peg$FAILED && peg$currPos === input.length) {
      return peg$result;
    } else {
      if (peg$result !== peg$FAILED && peg$currPos < input.length) {
        peg$fail({
          type: 'end',
          description: 'end of input'
        });
      }
      throw peg$buildException(null, peg$maxFailExpected, peg$maxFailPos < input.length ? input.charAt(peg$maxFailPos) : null, peg$maxFailPos < input.length ? peg$computeLocation(peg$maxFailPos, peg$maxFailPos + 1) : peg$computeLocation(peg$maxFailPos, peg$maxFailPos));
    }
  }
  return {
    SyntaxError: peg$SyntaxError,
    parse: peg$parse
  };
}();
number_formatter = function () {
  // this is mainly here for documentation purposes
  var default_options = {
    'explicit-sign': null,
    // which sign to place explicitly if one is missing
    'retain-explicit-plus': false,
    'add-integer-zero': false,
    'add-decimal-zero': false,
    'minimum-integer-digits': 0,
    'round-mode': 'off',
    // or 'figures', 'places'
    'round-precision': 3,
    'round-half': 'even',
    // or 'up',
    'round-integer-to-decimal': false,
    'zero-decimal-to-integer': false,
    'group-digits': null,
    // or 'true','integer','decimal'
    'group-minimum-digits': 3,
    'group-separator': '\\,',
    'copy-decimal-marker': true,
    'output-decimal-marker': '.',
    'bracket-numbers': true,
    'open-bracket': '(',
    'close-bracket': ')',
    'copy-complex-root': true,
    'output-complex-root': 'i',
    'complex-root-position': 'before-number',
    'output-exponent-marker': false,
    // or an explicit marker, e.g. 'e'
    'exponent-product': '\\times',
    'exponent-base': '10'
  };
  function incIntStr(str) {
    var m = str.length;
    var k = m - 1;
    while (k >= 0 && str[k] === '9')
      k--;
    if (k >= 0) {
      str = str.slice(0, k) + '123456789'[parseInt(str[k])] + '0'.repeat(m - k - 1);
    } else
      str = '1' + '0'.repeat(m);
    return str;
  }
  function postprocDecimal(options, num, no_rounding, retain_plus) {
    console.log(num);
    if (!num)
      return;
    var n;
    // -- explicit signs
    if (num.sign === null)
      num.sign = options['explicit-sign'];
    else if (!retain_plus && num.sign === '+' && !options['retain-explicit-plus'])
      num.sign = null;
    // -- remove leading zeros
    num.int = num.int.replace(/^00*/, '');
    // -- missing zeros
    if (!num.int && options['add-integer-zero'])
      num.int = '0';
    if (num.sep && !num.frac && options['add-decimal-zero'])
      num.frac = '0';
    // -- minimum integer digits
    n = options['minimum-integer-digits'] - num.int.length;
    if (n > 0)
      num.int = '0'.repeat(n) + num.int;
    // -- rounding
    // TODO: disable rounding when non-digits present in number
    if (!no_rounding && num.uncert === null && options['round-mode'] !== 'off') {
      if (options['round-mode'] === 'figures') {
        n = num.int.replace(/^00*/, '').length;
        if (n)
          n += num.frac.length;
        else
          n = num.frac.replace(/^00*/, '').length;
      } else
        n = num.frac.length;
      // round-mode = places
      n -= options['round-precision'];
      switch (Math.sign(n)) {
      case 1:
        // Too many digits
        var comb = num.int + num.frac;
        var dir = Math.sign(parseInt(comb[comb.length - n]) - 5);
        if (!dir && n > 1 && parseInt(comb.slice(1 - n)))
          dir = 1;
        comb = comb.slice(0, -n);
        if (!dir) {
          // exactly half
          switch (options['round-half']) {
          case 'up':
            // actually: up in magnitude
            dir = 1;
            break;
          default:
          case 'even':
            dir = parseInt(comb[comb.length - 1]) & 1 ? 1 : -1;
            break;
          }
        }
        if (dir === 1)
          comb = incIntStr(comb);
        if (n < num.frac.length) {
          // decimal result
          num.int = comb.slice(0, n - num.frac.length);
          num.frac = comb.slice(n - num.frac.length);
        } else {
          // integer result
          num.int = comb + '0'.repeat(n - num.frac.length);
          num.sep = null;
          num.frac = '';
        }
        break;
      case -1:
        // Too few digits
        if (num.sep || options['round-integer-to-decimal']) {
          num.sep = num.sep || options['output-decimal-marker'];
          num.frac += '0'.repeat(-n);
        }
        break;
      }
    }
    if (options['zero-decimal-to-integer'] && !(num.frac && parseInt(num.frac))) {
      num.frac = null;
      num.sep = null;
    }
  }
  function postprocComplExp(options, num) {
    postprocDecimal(options, num.re);
    postprocDecimal(options, num.im, false, true);
    postprocDecimal(options, num.exp, true);
  }
  function postprocAll(options, nums) {
    nums.forEach(function (quot) {
      [
        quot.num,
        quot.denom
      ].forEach(function (num) {
        if (!num)
          return;
        postprocComplExp(options, num);
      });
    });
  }
  function fmtDecimal(options, num) {
    var integer = num.int;
    var fractional = num.frac;
    var gd = options['group-digits'];
    var md = options['group-minimum-digits'];
    var gs = '{' + options['group-separator'] + '}';
    var dm = '{' + (options['copy-decimal-marker'] ? num.sep : options['output-decimal-marker']) + '}';
    var sign = num.sign || '';
    //  integer = integer || '0';
    var l = integer.length;
    if (l >= md && (gd === 'true' || gd === 'integer')) {
      l -= 3;
      for (; l > 0; l -= 3) {
        integer = integer.slice(0, l) + gs + integer.slice(l);
      }
    }
    if (!num.sep)
      return sign + integer;
    l = fractional.length;
    if (l >= md && (gd === 'true' || gd === 'decimal')) {
      l -= 1 + (l - 1) % 3;
      for (; l > 0; l -= 3) {
        fractional = fractional.slice(0, l) + gs + fractional.slice(l);
      }
    }
    return sign + integer + dm + fractional;
  }
  function fmtComplExp(options, num) {
    var ob = '', cb = '';
    if (num.exp && options['bracket-numbers']) {
      ob = (options['open-bracket'] || '(') + ' ';
      cb = ' ' + (options['close-bracket'] || ')');
    }
    var re = num.re && fmtDecimal(options, num.re);
    var im = null;
    if (num.im) {
      var cr = options['copy-complex-root'] ? num.im.root : options['output-complex-root'];
      im = fmtDecimal(options, num.im);
      if (options['complex-root-position'] === 'before-number')
        im = cr + im;
      else
        im = im + cr;
    }
    var ret = num.rel ? num.rel + ' ' : '';
    if (re) {
      if (!im)
        ret += re;
      else
        ret += ob + re + ' ' + im + cb;
    } else if (im)
      ret += im;
    if (num.sign) {
      // num.sign only for lone signs without any number
      if (num.re || num.im)
        error('sign but also re or im given');
      // should never happen
      ret += ' ' + num.sign;
    }
    if (num.exp) {
      var exp = fmtDecimal(options, num.exp);
      var oem = options['output-exponent-marker'];
      if (oem)
        ret += ' ' + oem + ' ' + exp;
      else
        ret += ' ' + (re || im ? options['exponent-product'] || '\\times' : '') + ' ' + (options['exponent-base'] || '10') + '^{' + exp + '}';
    }
    return ret;
  }
  function processAll(options, nums) {
    return nums.map(function (quot) {
      var formatted = [
        quot.num,
        quot.denom
      ].map(function (num) {
        if (!num)
          return num;
        var numcopy = {};
        for (var k in num)
          if (num.hasOwnProperty(k))
            numcopy[k] = num;
        postprocComplExp(options, num);
        return fmtComplExp(options, num);
      });
      return {
        num: formatted[0],
        denom: formatted[1]
      };
    });
  }
  return {
    postprocDecimal: postprocDecimal,
    postprocComplExp: postprocComplExp,
    postprocAll: postprocAll,
    fmtDecimal: fmtDecimal,
    fmtComplExp: fmtComplExp,
    processAll: processAll
  };
}();
number_parser = function (SIunitxOptions, PARSER, FORMATTER) {
  var exports = {};
  var TEX = MathJax.InputJax.TeX;
  var SINumberParser = exports.SINumberParser = MathJax.Object.Subclass({
    Init: function (string, options) {
      this.string = string;
      this.i = 0;
      if (options === undefined)
        options = SIunitxOptions();
      else if (!(options instanceof SIunitxOptions)) {
        console.log(options, SIunitxOptions);
        throw 'SINumberParser expects an options object';
      }
      this.options = options;
      this.Parse();
    },
    Parse: function () {
      var str = this.string.replace(/\s+/gi, '');
      var replacements = {
        '+-': '\\pm',
        '-+': '\\mp',
        '<=': '\\leq',
        '>=': '\\geq',
        '<<': '\\ll',
        '>>': '\\gg'
      };
      for (var key in replacements)
        if (replacements.hasOwnProperty(key)) {
          str = str.replace(key, replacements[key]);
        }
      this.parsed = PARSER.parse(str, this.options);
      this.preformatted = FORMATTER.processAll(this.options, this.parsed);
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
}(siunitx_options_definition, number_parser_peg, number_formatter);
siunitx_commands = function (SIunitxOptions, UNITDEFS, SIUnitParser, NUMBERPARSER) {
  var TEX = MathJax.InputJax.TeX;
  var MML = MathJax.ElementJax.mml;
  var UNITSMACROS = UNITDEFS.UNITSMACROS;
  var SINumberParser = NUMBERPARSER.SINumberParser;
  var SINumberListParser = NUMBERPARSER.SINumberListParser;
  var SIunitxCommands = MathJax.Extension['TeX/siunitx'].SIunitxCommands = {
    sisetup: function (name) {
      var options = this.GetArgument(name);
    },
    si: function (name) {
      var options = SIunitxOptions.ParseOptions(this.GetBrackets(name, ''));
      var units = this.GetArgument(name);
      //      console.log('>> si(',name,'){',units,'}');
      this.Push(SIUnitParser(units, options, this.stack.env).mml());
    },
    SI: function (name) {
      var options = SIunitxOptions.ParseOptions(this.GetBrackets(name, ''));
      var num = this.GetArgument(name);
      var preunits = this.GetBrackets(name, '');
      var units = this.GetArgument(name);
      //     console.log('>> SI(',name,'){',num,'}{',units,'}');
      if (preunits) {
        this.Push(SIUnitParser(preunits, options, this.stack.env).mml());
        this.Push(MML.mspace().With({
          width: MML.LENGTH.MEDIUMMATHSPACE,
          mathsize: MML.SIZE.NORMAL,
          scriptlevel: 0
        }));
      }
      this.Push(SINumberParser(num, options, this.stack.env).mml()[0].num);
      this.Push(MML.mspace().With({
        width: MML.LENGTH.MEDIUMMATHSPACE,
        mathsize: MML.SIZE.NORMAL,
        scriptlevel: 0
      }));
      this.Push(SIUnitParser(units, options, this.stack.env).mml());
    },
    SIlist: function (name) {
      var options = SIunitxOptions.ParseOptions(this.GetBrackets(name, ''));
      var num = this.GetArgument(name);
      var preunits = this.GetBrackets(name, '');
      var units = this.GetArgument(name);
      if (preunits) {
        preunits = SIUnitParser(preunits, options, this.stack.env);
      }
      num = SINumberListParser(num, options, this.stack.env).parsed;
      units = SIUnitParser(units, options, this.stack.env);
      function medspace() {
        return MML.mspace().With({
          width: MML.LENGTH.MEDIUMMATHSPACE,
          mathsize: MML.SIZE.NORMAL,
          scriptlevel: 0
        });
      }
      for (var idx = 0; idx < num.length; ++idx) {
        var n = num[idx];
        if (idx & 1) {
          // this is a separator
          this.Push(TEX.Parse(n).mml());
        } else {
          // this is a number
          if (preunits) {
            this.Push(preunits.mml());
            this.Push(medspace());
          }
          this.Push(TEX.Parse(n).mml());
          this.Push(medspace());
          this.Push(units.mml());
        }
      }
    },
    SIrange: function (name) {
      var options = SIunitxOptions.ParseOptions(this.GetBrackets(name, ''));
      var num1 = this.GetArgument(name);
      var num2 = this.GetArgument(name);
      var preunits = this.GetBrackets(name, '');
      var units = this.GetArgument(name);
      units = SIUnitParser(units, options, this.stack.env);
      if (preunits)
        preunits = SIUnitParser(preunits, options, this.stack.env);
      if (preunits) {
        this.Push(preunits.mml());
        this.Push(MML.mspace().With({
          width: MML.LENGTH.MEDIUMMATHSPACE,
          mathsize: MML.SIZE.NORMAL,
          scriptlevel: 0
        }));
      }
      this.Push(SINumberParser(num1, options, this.stack.env).mml());
      this.Push(MML.mspace().With({
        width: MML.LENGTH.MEDIUMMATHSPACE,
        mathsize: MML.SIZE.NORMAL,
        scriptlevel: 0
      }));
      this.Push(units.mml());
      this.Push(options['range-phrase']);
      if (preunits) {
        this.Push(preunits.mml());
        this.Push(MML.mspace().With({
          width: MML.LENGTH.MEDIUMMATHSPACE,
          mathsize: MML.SIZE.NORMAL,
          scriptlevel: 0
        }));
      }
      this.Push(SINumberParser(num2, options, this.stack.env).mml());
      this.Push(MML.mspace().With({
        width: MML.LENGTH.MEDIUMMATHSPACE,
        mathsize: MML.SIZE.NORMAL,
        scriptlevel: 0
      }));
      this.Push(units.mml());
    },
    num: function (name) {
      var options = SIunitxOptions.ParseOptions(this.GetBrackets(name, ''));
      var num = this.GetArgument(name);
      var preformatted = SINumberParser(num, options, this.stack.env).preformatted.map(function (f) {
        if (f.denom === null)
          return f.num;
        if (options['quotient-mode'] == 'symbol')
          return f.num + options['output-quotient'] + f.denom;
        return options['fraction-function'] + '{' + f.num + '}{' + f.denom + '}';
      }).join(options['output-product']);
      this.Push(TEX.Parse(preformatted).mml());
    },
    ang: function (name) {
      var options = SIunitxOptions.ParseOptions(this.GetBrackets(name, ''));
      var num = this.GetArgument(name);
      num = SINumberListParser(num, options, this.stack.env).parsed;
      if (num.length > 5)
        TEX.Error('More than three elements in angle specification');
      var units = [
        'degree',
        undefined,
        'arcminute',
        undefined,
        'arcsecond'
      ];
      var def = { mathvariant: MML.VARIANT.NORMAL };
      for (var idx = 0; idx < num.length; ++idx) {
        var n = num[idx];
        if (idx & 1) {
        } else {
          if (!n)
            continue;
          this.Push(TEX.Parse(n).mml());
          var u = UNITSMACROS[units[idx]][1];
          // assumes that all symbol's we encounter are MML.entity
          var mml = MML.mi.apply(MML.mi, [u.symbol]).With(def);
          this.Push(this.mmlToken(mml));
        }
      }
    },
    numlist: function (name) {
      var options = SIunitxOptions.ParseOptions(this.GetBrackets(name, ''));
      var num = this.GetArgument(name);
      this.Push(SINumberListParser(num, options, this.stack.env).mml());
    },
    numrange: function (name) {
      var options = SIunitxOptions.ParseOptions(this.GetBrackets(name, ''));
      var num1 = this.GetArgument(name);
      var num2 = this.GetArgument(name);
      this.Push(SINumberParser(num1, options, this.stack.env).mml());
      this.Push(options['range-phrase']);
      this.Push(SINumberParser(num2, options, this.stack.env).mml());
    }
  };
  // ------ regsiter the commands with MathJax
  TEX.Definitions.Add({
    macros: {
      //
      //  Set up the macros for SI units
      //
      sisetup: 'SIunitx',
      si: 'SIunitx',
      SI: 'SIunitx',
      SIlist: 'SIunitx',
      SIrange: 'SIunitx',
      num: 'SIunitx',
      ang: 'SIunitx',
      numlist: 'SIunitx',
      numrange: 'SIunitx'
    }
  }, null, true);
  TEX.Parse.Augment({
    //
    //  Implements \SI and friends
    //
    SIunitx: function (name) {
      SIunitxCommands[name.slice(1)].call(this, name);
    }
  });
  //
  //  Indicate that the extension is ready
  //
  MathJax.Hub.Startup.signal.Post('TeX siunitx Ready');
  return SIunitxCommands;
}(siunitx_options_definition, unit_definitions, unit_parser, number_parser);
}());
  // amd-replace-stop
});

MathJax.Ajax.loadComplete("[Contrib]/siunitx/unpacked/siunitx.js");
