/*************************************************************
 *
 *  MathJax/extensions/TeX/siunitx/unit-parser.js
 *
 *  Implements the parser parsing siunitx macro fields
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

define(['./unit-definitions'],function(UNITDEFS) {
  var TEX = MathJax.InputJax.TeX;
  var STACK = TEX.Stack;
  var STACKITEM = STACK.Item;
  var MML = MathJax.ElementJax.mml;

  var UNITSMACROS = UNITDEFS.UNITSMACROS;

  var SIUnitParser = MathJax.Extension["TeX/siunitx"].SIUnitParser = TEX.Parse.Subclass({
    Init: function (string, options, env) {
      this.cur_prefix = undefined;
      this.cur_pfxpow = undefined;
      this.per_active = false;
      this.has_literal = false; // Set to true if non-siunitx LaTeX is encountered in input
      this.literal_chars = ''; // building unit char by char
      this.units = [];
      this.options = options;
      arguments.callee.SUPER.Init.call(this, string, env);
      /*	  if(this.has_literal){
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
          if (unit.inverse) power = -power;
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
            stack.Push(this.mmlToken(MML.mo(MML.chars('(').With({fence: false, stretchy: false}))));
            recip.forEach(function (u) {
              u.inverse = false;
              stack.Push(mythis.UnitMML(u));
            });
            stack.Push(this.mmlToken(MML.mo(MML.chars(')').With({fence: false, stretchy: false}))));
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
          TEX.Error("Unimplemented per-mode " + permode);
        }
        stack.Push(STACKITEM.stop());
        if (stack.Top().type !== "mml") {
          return null
        }
        return stack.Top().data[0];
      }
      if (this.stack.Top().type !== "mml") {
        return null
      }
      return this.stack.Top().data[0];
    },

    // This is used to identify non-siunitx LaTeX in the input
    Push: function () {
      this.finishLiteralUnit(); // in case we're still caching some chars
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
      this.finishLiteralUnit();      // any macro should finish previous units

      var macro = UNITSMACROS[name];
      if (macro) return macro;

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
    }, // ignore this macro

    Of: function (name) {
      var what = this.GetArgument(name);
      if (this.has_literal) {
        // unit is already gone, best we can do is add a superscript
        TEX.Error(["SIunitx", "NotImplementedYet"]);
      }
      if (!this.units.length) {
        TEX.Error(["SIunitx", "Qualification suffix with no unit"]);
      }
      var unit = this.units[this.units.length - 1];
      if (unit.power !== undefined) {
        TEX.Error(["SIunitx", "double qualification", unit.qual, what]);
      }
      unit.qual = what;
    },

    Highlight: function (name) {
      var color = this.GetArgument(name);
      this.cur_highlight = color;
    },

    Per: function (name) {
      if (this.per_active) {
        TEX.Error(["SIunitx", "double \\per"]);
        return;
      }
      this.per_active = true;
    },

    PowerPfx: function (name, pow) {
      if (pow === undefined) {
        pow = this.GetArgument(name);
      }
      if (this.cur_pfxpow) {
        TEX.Error(["SIunitx", "double power prefix", this.cur_pfxpow, pow]);
      }
      this.cur_pfxpow = pow;
    },

    PowerSfx: function (name, pow) {
      if (pow === undefined) {
        pow = this.GetArgument(name);
      }
      if (this.has_literal) {
        // unit is already gone, best we can do is add a superscript
        TEX.Error(["SIunitx", "NotImplementedYet"]);
      }
      if (!this.units.length) {
        TEX.Error(["SIunitx", "Power suffix with no unit"]);
      }
      var unit = this.units[this.units.length - 1];
      if (unit.power !== undefined) {
        TEX.Error(["SIunitx", "double power", unit.power, pow]);
      }
      unit.power = pow;
    },

    SIPrefix: function (name, pfx) {
      if (this.cur_prefix) {
        TEX.Error(["SIunitx", "double SI prefix", this.cur_prefix, pfx]);
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
      var def = {mathvariant: MML.VARIANT.NORMAL};
      var mml = MML.mi.apply(MML.mi, content).With(def);
      var power = unit.power === undefined ? 1 : unit.power;
      if (unit.inverse) power = -power;
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
        qual: undefined   // qualification
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
      var def = {mathvariant: MML.VARIANT.NORMAL};
      this.PushUnitFallBack(this.mmlToken(MML.mi.apply(MML.mi, content).With(def)));

      this.cur_prefix = undefined;
      this.cur_pfxpow = undefined;
      if (!this.options['sticky-per'])
        this.per_active = false;
    }
  });
  return SIUnitParser;
});