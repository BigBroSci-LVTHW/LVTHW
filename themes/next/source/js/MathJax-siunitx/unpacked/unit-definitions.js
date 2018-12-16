/*************************************************************
 *
 *  MathJax/extensions/TeX/siunitx/unit-definitions.js
 *
 *  Defines the unit macros available in siunitx
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

define(function() {
  var exports = {};

  var MML = MathJax.ElementJax.mml;

  var UNITSMACROS = exports.UNITSMACROS = {
    // powers
    per: ['Per', -1],
    square: ['PowerPfx', 2],
    cubic: ['PowerPfx', 3],
    raiseto: ['PowerPfx', undefined],
    squared: ['PowerSfx', 2],
    cubed: ['PowerSfx', 3],
    tothe: ['PowerSfx', undefined],

    // aliases
    meter: ['Macro', '\\metre'],
    deka: ['Macro', '\\deca'],

    // abbreviations
    celsius: ['Macro', '\\degreeCelsius'],
    kg: ['Macro', '\\kilogram'],
    amu: ['Macro', '\\atomicmassunit'],
    kWh: ['Macro', '\\kilo\\watt\\hour'],

    // not yet supported:
    of: 'Of',
    cancel: 'Unsupported',
    highlight: 'Highlight'
  };

// ******* SI prefixes *******************

  var SIPrefixes = MathJax.Extension["TeX/siunitx"].SIPrefixes = exports.SIPrefixes = (function (def) {
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
    ;
    return ret;
  })({
    yocto: [-24, 'y'],
    zepto: [-21, 'z'],
    atto: [-18, 'a'],
    femto: [-15, 'f'],
    pico: [-12, 'p'],
    nano: [-9, 'n'],
    micro: [-6, 'u', MML.entity("#x03bc")],
    milli: [-3, 'm'],
    centi: [-2, 'c'],
    deci: [-1, 'd'],

    deca: [1, 'da'],
    hecto: [2, 'h'],
    kilo: [3, 'k'],
    mega: [6, 'M'],
    giga: [9, 'G'],
    tera: [12, 'T'],
    peta: [15, 'P'],
    exa: [18, 'E'],
    zetta: [21, 'Z'],
    yotta: [24, 'Y']
  });

  for (var pfx in SIPrefixes) {
    pfx = SIPrefixes[pfx];
    UNITSMACROS[pfx.name] = ['SIPrefix', pfx];
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

  var SIUnits = MathJax.Extension["TeX/siunitx"].SIUnits = exports.SIUnits = (function (arr) {
    var ret = {};
    arr.forEach(function (unit) {
      ret[unit.name] = unit;
    });
    return ret;
  })([].concat(_BuildUnits('SI base', {
    ampere: ['A', 'A'],
    candela: ['cd'],
    kelvin: ['K', 'K'],
    kilogram: ['kg'],
    gram: ['g', 'g'],
    metre: ['m', 'm'],
    mole: ['mol', 'mol'],
    second: ['s', 's']
  }), _BuildUnits('coherent derived', {
    becquerel: ['Bq'],
    degreeCelsius: [MML.entity("#x2103")],
    coulomb: ['C'],
    farad: ['F', 'F'],
    gray: ['Gy'],
    hertz: ['Hz', 'Hz'],
    henry: ['H'],
    joule: ['J', 'J'],
    katal: ['kat'],
    lumen: ['lm'],
    lux: ['lx'],
    newton: ['N', 'N'],
    ohm: [MML.entity("#x03a9"), 'ohm'],
    pascal: ['Pa', 'Pa'],
    radian: ['rad'],
    siemens: ['S'],
    sievert: ['Sv'],
    steradian: ['sr'],
    tesla: ['T'],
    volt: ['V', 'V'],
    watt: ['W', 'W'],
    weber: ['Wb'],
  }), _BuildUnits('accepted non-SI', {
    day: ['d'],
    degree: [MML.entity("#x00b0")],
    hectare: ['ha'],
    hour: ['h'],
    litre: ['l', 'l'],
    liter: ['L', 'L'],
    arcminute: [MML.entity("#x2032")], // plane angle;
    minute: ['min'],
    arcsecond: [MML.entity("#x2033")], // plane angle;
    tonne: ['t'],
  }), _BuildUnits('experimental non-SI', {
    astronomicalunit: ['ua'],
    atomicmassunit: ['u'],
    bohr: [MML.msub(MML.mi(MML.chars('a')).With({mathvariant: MML.VARIANT.NORMAL}), MML.mn(0))], // TODO: fix this
    clight: ['c0'],  // TODO: proper subscript
    dalton: ['Da'],
    electronmass: ['me'], // TODO: proper subscript
    electronvolt: ['eV', 'eV'],
    elementarycharge: ['e'],
    hartree: ['Eh'], // TODO: proper subscript
    planckbar: [MML.entity("#x0127")],
  }), _BuildUnits('other non-SI', {
    angstrom: [MML.entity("#x212b")],
    bar: ['bar'],
    barn: ['b'],
    bel: ['B'],
    decibel: ['dB', 'dB'],
    knot: ['kn'],
    mmHg: ['mmHg'],
    nauticmile: [';'],
    neper: ['Np'],
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
    UNITSMACROS[unit.name] = ['SIUnit', unit];
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
        return
      }
      repl = AbbrevPfx[abbrev[0]];
      if (repl === undefined) {
        // should never happen!
        console.log('cannot parse prefix ', abbrev[0], ' on unit ', unit, ' (', abbrev, ')');
        return
      }
      repl = '\\' + repl
    }
    repl += '\\' + unit
    return repl;
  }

// install a number of abbrevs as macros, the same as siunitx does.
  [
    "fg pg ng ug mg g",
    "pm nm um mm cm dm m km",
    "as fs ps ns us ms s",
    "fmol pmol nmol umol mmol mol kmol",
    "pA nA uA mA A kA",
    "ul ml l hl uL mL L hL",
    "mHz Hz kHz MHz GHz THz",
    "mN N kN MN",
    "Pa kPa MPa GPa",
    "mohm kohm Mohm",
    "pV nV uV mV V kV",
    "uW mW W kW MW GW",
    "J kJ",
    "meV eV keV MeV GeV TeV",
    "fF pF F",
    "K",
    "dB"
  ].forEach(function (abbrset) {
    abbrset.split(' ').forEach(function (abbrev) {
      UNITSMACROS[abbrev] = ['Macro', _ParseAbbrev(abbrev)];
    })
  });

  return exports;
});