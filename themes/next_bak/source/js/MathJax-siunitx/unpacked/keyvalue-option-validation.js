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

define(function() {
  var exports = {};

  var TEX = MathJax.InputJax.TeX;

  var ValidationError = exports.ValidationError = MathJax.Object.Subclass({
    Init: function (obj, name, validator, val) {
      this._errormsg = 'ValidationError: Error validating "' + name + '" of "' + obj.constructor + '" (a "' + validator + '") to "' + val + '": '
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
        throw ValidationError(
          obj, name, this, val,
          'must be one of ["'
          + Object.getOwnPropertyNames(this._choices).join('", "')
          + '"]'
        );
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
      if (val === undefined) val = this._switchchoice;
      return Choice.prototype.Validate.call(this, obj, name, val);
    }
  });
  var Integer = exports.Integer = ValidationBase.Subclass({
    Init: function (def) {
      if (def === undefined) def = 0;
      this._default = def;
    },
    Validate: function (obj, name, val) {
      val = parseInt(val)
      if (!Number.isInteger(val))
        throw ValidationError(obj, name, this, val, "must be an integer");
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
      return val; // TODO: proper validation
    }
  });
  var Macro = exports.Macro = ValidationBase.Subclass({
    Init: function (def) {
      this._default = def;
    },
    Validate: function (obj, name, val) {
      return val; // TODO: proper validation
    }
  });
  var Switch = exports.Switch = ValidationBase.Subclass({
    Init: function (def) {
      if (def === undefined)
        def = false;
      this._default = def;
    },
    Validate: function (obj, name, val) {
      if (val === undefined) val = true;
      if (typeof val == 'string' || val instanceof String) {
        val = val.toLowerCase();
        if (val == 'true')
          val = true;
        else if (val == 'false')
          val = false;
      }
      if (val !== true && val !== false)
        throw ValidationError(obj, name, this, val, "must be a boolean");
      return val;
    }
  });

  var ConfigData = exports.ConfigData = MathJax.Object.Subclass({
    Init: function (values) {
      this._values = {}
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
        sep = ',\n'
      var ret = []
      for (var prop in this._options) {
        if (skip_initial && !this._values.hasOwnProperty(prop))
          continue;
        ret.push(prop + ' = ' + this[prop]);
      }
      return ret.join(sep);
    }
  }, {
    Define: function (definition) {
      var ret = this.Subclass({_options: definition});
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
            var open = val.indexOf("{", start);
            var close = val.indexOf("}", start);
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
});

