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

define(['./siunitx-options-definition','./number-parser-peg','./number-preformatter'],function(SIunitxOptions, PARSER, FORMATTER) {
    'use strict';

    var exports = {};

    var TEX = MathJax.InputJax.TeX;

    var replacements = {
        '+-': '\\pm',
        '-+': '\\mp',
        '<=': '\\leq',
        '>=': '\\geq',
        '<<': '\\ll',
        '>>': '\\gg',
    };

    function preprocess(str){
        str = str.replace(/\s+/gi, '');
        for (var key in replacements) if(replacements.hasOwnProperty(key)) {
            str = str.replace(key, replacements[key]);
        }
        return str;
    }

    exports.SINumberParser = function SINumberParser(string,options){
        var str = preprocess(string);
        var parsed = PARSER.parse(str, options);
        var preformatted = FORMATTER.processAll(options, parsed);
        return preformatted;
    };

    exports.SINumberListParser = function SINumberListParser(string,options){
        var ret = string.split(';').map(function(str) {
            var str = preprocess(str);
            var parsed = PARSER.parse(str, options);
            var preformatted = FORMATTER.processAll(options, parsed);
            return preformatted;
        });
        return ret;
    };

    return exports;
});