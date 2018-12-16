/*************************************************************
 *
 *  MathJax/extensions/TeX/siunitx/siunitx-commands.js
 *
 * This is essentially a namespace for the various functions needed,
 * such that TEX.Parse's namespace is not cluttered too much.
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

define(
  ['./siunitx-options-definition','./unit-definitions','./unit-parser','./number-parser'],
  function(SIunitxOptions, UNITDEFS, SIUnitParser, NUMBERPARSER)
{
  'use strict';

  var TEX = MathJax.InputJax.TeX;
  var MML = MathJax.ElementJax.mml;

  var UNITSMACROS = UNITDEFS.UNITSMACROS;
  var SINumberParser = NUMBERPARSER.SINumberParser;
  var SINumberListParser = NUMBERPARSER.SINumberListParser;

  var SIunitxCommands = MathJax.Extension["TeX/siunitx"].SIunitxCommands = {
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
      var factors = SINumberParser(num, options);
//     console.log('>> SI(',name,'){',num,'}{',units,'}');
      var that = this;
      factors.forEach(function(num,i) {
        if(i) that.Push(TEX.Parse(options['output-product']).mml());
        if (preunits) {
          that.Push(SIUnitParser(preunits, options, that.stack.env).mml());
          that.Push(MML.mspace().With({
            width: MML.LENGTH.MEDIUMMATHSPACE,
            mathsize: MML.SIZE.NORMAL,
            scriptlevel: 0
          }));
        }
        that.Push(TEX.Parse(num).mml());
        that.Push(MML.mspace().With({
          width: MML.LENGTH.MEDIUMMATHSPACE,
          mathsize: MML.SIZE.NORMAL,
          scriptlevel: 0
        }));
        that.Push(SIUnitParser(units, options, that.stack.env).mml());
      });
    },

    SIlist: function (name) {
      var options = SIunitxOptions.ParseOptions(this.GetBrackets(name, ''));
      var num = this.GetArgument(name);
      var preunits = this.GetBrackets(name, '');
      var units = this.GetArgument(name);
      if (preunits) {
        preunits = SIUnitParser(preunits, options, this.stack.env);
      }
      var preformatted = SINumberListParser(num, options).map(function(num) {
        return num.join(options['output-product'])
      });
      units = SIUnitParser(units, options, this.stack.env);
      function medspace() {
        return MML.mspace().With({
          width: MML.LENGTH.MEDIUMMATHSPACE,
          mathsize: MML.SIZE.NORMAL,
          scriptlevel: 0
        });
      };
      var that=this;
      preformatted.forEach(function(num,i){
        if(i){
          if(preformatted.length>2){
            if(i<preformatted.length-1)
              that.Push(TEX.Parse(('\\text{'+options['list-separator']+'}')).mml());
            else
              that.Push(TEX.Parse(('\\text{'+options['list-final-separator']+'}')).mml());
          } else {
            that.Push(TEX.Parse(('\\text{'+options['list-pair-separator']+'}')).mml());
          };
        };
        if (preunits) {
          that.Push(preunits.mml());
          that.Push(medspace());
        }
        that.Push(TEX.Parse(num).mml());
        that.Push(medspace());
        that.Push(units.mml());
      });
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
      this.Push(TEX.Parse(SINumberParser(num1, options).join(options['output-product'])).mml());
      this.Push(MML.mspace().With({
        width: MML.LENGTH.MEDIUMMATHSPACE,
        mathsize: MML.SIZE.NORMAL,
        scriptlevel: 0
      }));
      this.Push(units.mml());
      this.Push(TEX.Parse('\\text{'+options['range-phrase']+'}').mml());
      if (preunits) {
        this.Push(preunits.mml());
        this.Push(MML.mspace().With({
          width: MML.LENGTH.MEDIUMMATHSPACE,
          mathsize: MML.SIZE.NORMAL,
          scriptlevel: 0
        }));
      }
      this.Push(TEX.Parse(SINumberParser(num2, options).join(options['output-product'])).mml());
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
      var preformatted = SINumberParser(num, options).join(options['output-product']);
      this.Push(TEX.Parse(preformatted).mml());
    },

    ang: function (name) {
      var options = SIunitxOptions.ParseOptions(this.GetBrackets(name, ''));
      var num = this.GetArgument(name);
      num = SINumberListParser(num, options, this.stack.env).parsed;
      if (num.length > 5)
        TEX.Error("More than three elements in angle specification");
      var units = [
        'degree',
        undefined,
        'arcminute',
        undefined,
        'arcsecond'
      ];
      var def = {mathvariant: MML.VARIANT.NORMAL};
      for (var idx = 0; idx < num.length; ++idx) {
        var n = num[idx];
        if (idx & 1) {
          // this is a separator
          // ignore here
          // TODO: factor out list separators from SINumberListParser
        } else {
          if (!n) continue;
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
      var preformatted = SINumberListParser(num, options).map(function(num) {
        return num.join(options['output-product'])
      });

      var joined;
      if(preformatted.length>2) {
        joined = preformatted.slice(0, -1).join('\\text{'+options['list-separator']+'}');
        joined += '\\text{'+options['list-final-separator']+'}'+preformatted[preformatted.length-1];
      } else {
        joined = preformatted.join('\\text{'+options['list-pair-separator']+'}');
      }
      this.Push(TEX.Parse(joined).mml());
    },

    numrange: function (name) {
      var options = SIunitxOptions.ParseOptions(this.GetBrackets(name, ''));
      var num1 = this.GetArgument(name);
      var num2 = this.GetArgument(name);
      var preformatted = (
          SINumberParser(num1, options).join(options['output-product'])
          + '\\text{'+options['range-phrase']+'}'
          + SINumberParser(num2, options).join(options['output-product'])
      );
      this.Push(TEX.Parse(preformatted).mml());
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
      numrange: 'SIunitx',
    }
  }, null, true);

  TEX.Parse.Augment({

    //
    //  Implements \SI and friends
    //
    SIunitx: function (name) {
      SIunitxCommands[name.slice(1)].call(this, name)
    }

  });

  //
  //  Indicate that the extension is ready
  //
  MathJax.Hub.Startup.signal.Post("TeX siunitx Ready");

  return SIunitxCommands;
});
