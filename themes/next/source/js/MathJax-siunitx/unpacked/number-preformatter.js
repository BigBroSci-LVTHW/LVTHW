/*************************************************************
 *
 *  MathJax/extensions/TeX/siunitx/number-preformatter.js
 *
 *  Converts parsed numbers back into LaTeX, after performing post-processing.
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


define([],function(){
    'use strict';

    // this is mainly here for documentation purposes
    var default_options = {
        'explicit-sign': null,   // which sign to place explicitly if one is missing
        'retain-explicit-plus': false,
        'add-integer-zero': false,
        'add-decimal-zero': false,
        'minimum-integer-digits': 0,
        'round-mode': 'off', // or 'figures', 'places'
        'round-precision': 3,
        'round-half': 'even',    // or 'up',
        'round-integer-to-decimal': false,
        'zero-decimal-to-integer': false,
        'group-digits': null, // or 'true','integer','decimal'
        'group-minimum-digits': 3,
        'group-separator': '\\,',
        'copy-decimal-marker': true,
        'output-decimal-marker':'.',
        'bracket-numbers':true,
        'open-bracket':'(',
        'close-bracket':')',
        'copy-complex-root':true,
        'output-complex-root':'i',
        'complex-root-position':'before-number',
        'output-exponent-marker':false,  // or an explicit marker, e.g. 'e'
        'exponent-product':'\\times',
        'exponent-base':'10'
    };

    function incIntStr(str){
        var m = str.length;
        var k=m-1;
        while(k>=0 && str[k]==='9') k--;
        if(k>=0){
            str = str.slice(0,k)
                + '123456789'[parseInt(str[k])]
                + '0'.repeat(m-k-1);
        } else str = '1' + '0'.repeat(m);
        return str;
    }
    function postprocDecimal(options,num,no_rounding,retain_plus){
        console.log(num);
        if(!num)return;
        var n;
        // -- explicit signs
        if(num.sign === null)
            num.sign = options['explicit-sign'];
        else if(!retain_plus && num.sign === '+' && !options['retain-explicit-plus'])
            num.sign = null;
        // -- remove leading zeros
        num.int = num.int.replace(/^00*/,'')
        // -- missing zeros
        if(!num.int && options['add-integer-zero'])
            num.int = '0';
        if(num.sep && !num.frac && options['add-decimal-zero'])
            num.frac = '0';
        // -- minimum integer digits
        n = options['minimum-integer-digits'] - num.int.length
        if(n>0)
            num.int = '0'.repeat(n) + num.int;
        // -- rounding
        // TODO: disable rounding when non-digits present in number
        if(!no_rounding && num.uncert===null && options['round-mode']!=='off'){
            if(options['round-mode']==='figures') {
                n = num.int.replace(/^00*/,'').length;
                if(n)
                    n += num.frac.length;
                else
                    n = num.frac.replace(/^00*/,'').length;
            } else
                n = num.frac.length;  // round-mode = places
            n -= options['round-precision'];
            switch(Math.sign(n)){
                case 1:
                    // Too many digits
                    var comb = num.int + num.frac;
                    var dir = Math.sign(parseInt(comb[comb.length-n])-5);
                    if(!dir && n>1 && parseInt(comb.slice(1-n)))
                        dir = 1;
                    comb = comb.slice(0,-n);
                    if(!dir){
                        // exactly half
                        switch(options['round-half']){
                            case 'up': // actually: up in magnitude
                                dir = 1;
                                break;
                            default:
                            case 'even':
                                dir = parseInt(comb[comb.length-1])&1 ? 1 : -1;
                                break;
                        }
                    }
                    if(dir===1) comb = incIntStr(comb);
                    if(n<num.frac.length){
                        // decimal result
                        num.int = comb.slice(0,n-num.frac.length);
                        num.frac = comb.slice(n-num.frac.length);
                    } else {
                        // integer result
                        num.int = comb + '0'.repeat(n-num.frac.length);
                        num.sep = null;
                        num.frac = '';
                    }
                    break
                case -1:
                    // Too few digits
                    if(num.sep || options['round-integer-to-decimal']){
                        num.sep = num.sep || options['output-decimal-marker'];
                        num.frac += '0'.repeat(-n);
                    }
                    break
            };
        };
        if(
            options['zero-decimal-to-integer']
            && !(num.frac && parseInt(num.frac))
        ) {num.frac=null;num.sep=null;};
    };
    function postprocComplExp(options,num){
        postprocDecimal(options,num.re);
        postprocDecimal(options,num.im,false,true);
        postprocDecimal(options,num.exp,true);
    };

    function postprocAll(options,nums){
        nums.forEach(function(quot){
            [quot.num, quot.denom].forEach(function(num){
                if(!num) return;
                postprocComplExp(options,num);
            })
        });
    };



    function fmtDecimal(options,num){
        var integer = num.int;
        var fractional = num.frac;

        var gd = options['group-digits'];
        var md = options['group-minimum-digits'];
        var gs = '{' + options['group-separator'] + '}';
        var dm = '{' + (
                options['copy-decimal-marker']
                    ? num.sep
                    : options['output-decimal-marker']
            ) + '}';

        var sign = (num.sign || '');

//  integer = integer || '0';
        var l = integer.length;
        if(l>=md && (gd==='true' || gd==='integer')){
            l-=3;
            for(;l>0;l-=3){
                integer = integer.slice(0,l) + gs + integer.slice(l);
            }
        }

        if(!num.sep)
            return sign + integer;

        l = fractional.length;
        if(l>=md && (gd==='true' || gd==='decimal')){
            l-=1+(l-1)%3;
            for(;l>0;l-=3){
                fractional = fractional.slice(0,l) + gs + fractional.slice(l);
            }
        }

        return (
            sign
            + integer
            + dm
            + fractional
        );
    };

    function fmtComplExp(options,num){
        var ob='',cb='';
        if(num.exp && options['bracket-numbers']){
            ob = (options['open-bracket'] || '(') + ' ';
            cb = ' ' + (options['close-bracket'] || ')');
        }

        var re = num.re && fmtDecimal(options,num.re);
        var im = null;
        if(num.im){
            var cr = (
                options['copy-complex-root']
                    ? num.im.root
                    : options['output-complex-root']
            );
            im = fmtDecimal(options,num.im);
            if(options['complex-root-position'] === 'before-number')
                im = cr+im;
            else
                im = im+cr;
        }
        var ret = num.rel ? num.rel+' ' : '';
        if(re) {
            if(!im) ret += re;
            else ret += ob + re + ' ' + im + cb;
        } else if(im) ret += im;
        if(num.sign){
            // num.sign only for lone signs without any number
            if(num.re || num.im) error('sign but also re or im given');  // should never happen
            ret += ' ' + num.sign;
        }

        if(num.exp){
            var exp = fmtDecimal(options,num.exp);
            var oem = options['output-exponent-marker'];
            if(oem)
                ret += ' ' + oem + ' ' + exp;
            else
                ret += (
                    ' ' + (
                        (re || im) ?
                        (options['exponent-product'] || '\\times') :
                        ''
                    ) + ' ' + (options['exponent-base'] || '10')
                    + '^{' + exp + '}'
                );
        }
        return ret;
    };


    function processAll(options,nums){
        return nums.map(function(quot){
            var formatted = [quot.num, quot.denom].map(function(num){
                if(!num) return num;
                var numcopy = {};
                for(var k in num) if(num.hasOwnProperty(k)) numcopy[k] = num;
                postprocComplExp(options,num);
                return fmtComplExp(options,num);
            });
            var num = formatted[0];
            var denom = formatted[1];
            if(denom === null) return num;
            if(options['quotient-mode']=='symbol') return num + options['output-quotient'] + denom;
            return options['fraction-function']+'{'+num+'}{'+denom+'}';
        });
    }

    return {
        postprocDecimal:postprocDecimal,
        postprocComplExp:postprocComplExp,
        postprocAll:postprocAll,
        fmtDecimal:fmtDecimal,
        fmtComplExp:fmtComplExp,
        processAll:processAll
    };
});