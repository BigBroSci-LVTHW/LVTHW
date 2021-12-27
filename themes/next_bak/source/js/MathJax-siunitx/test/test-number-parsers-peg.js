/**
 * Created by yves on 26/06/16.
 */

var assert = require('chai').assert;
var requirejs = require('requirejs');

requirejs.config({
  baseUrl: '.',
  nodeRequire: require
});

var default_options = {
  'input-complex-roots': 'ij',
  'input-decimal-markers': '.,',
  'input-exponent-markers': 'eEdD',
};

function assert_decimal(outp,expected,msg){
  if(!outp && !expected) return;
  ['int','sep','frac','uncert','sign','root'].forEach(function(attr) {
    var o=outp[attr];
    var e=expected[attr];
    if(!o && !e) return;
    assert.equal(o,e,msg+'.'+attr);
  });
}

function assert_complex(outp,expected){
  ['re','im','exp'].forEach(function(attr){
    assert_decimal(outp[attr],expected[attr],attr);
  });
  if(!outp.rel && !expected.rel) return;
  assert.equal(outp.rel,expected.rel);
}

function assert_single_number(outp,expected){
  assert.lengthOf(outp,1);
  outp = outp[0];
  assert.isNotOk(outp.denom);
  assert_complex(outp.num,expected);
}

describe('number-parser-peg',function(){
  var parse,err;
  it('can be imported',function(done){
    requirejs(['unpacked/number-parser-peg'],function(p){
      parse = p.parse;
      err = p.SyntaxError;
      done();
    });
  });
  function test_single_number(descr,inp,expected,extra_options){
    it(descr+':"'+inp+'"',function() {
      var options=Object.create(default_options);
      var outp = parse(inp, options);
      assert_single_number(outp, expected);
    });
  }
  beforeEach(function(){});
  describe('single-numbers',function(){
    test_single_number('basic','+-1.23',{re:{int:'1',sep:'.',frac:'23',sign:'\\pm'}});
    test_single_number('basic','12345,67890',{re:{int:'12345',sep:',',frac:'67890'}});
    test_single_number('exponent','1e2',{re:{int:'1'},exp:{int:'2'}});
    test_single_number('exponent without mantissa','-e10',{sign:'-',exp:{int:'10'}});
    test_single_number('uncert in brackets','1.1(2)',{re:{int:'1',sep:'.',frac:'1',uncert:'2'}});
    test_single_number('complex','+ 1 - 2i',{re:{int:'1',sign:'+'},im:{int:'2',sign:'-',root:'i'}});
    test_single_number('complex with +- imaginary part','1 +- 2i',{re:{int:'1'},im:{int:'2',sign:'\\pm',root:'i'}});
    test_single_number('complex with exponent','1 - j2 e2',{re:{int:'1'},im:{int:'2',sign:'-',root:'j'},exp:{int:'2'}});
    test_single_number('separate uncert','- 1,1 +- 2.01',{re:{int:'1',sep:',',frac:'10',sign:'-',uncert:'201'}});
    test_single_number('separate uncert','- 1.101 +- 2',{re:{int:'1',sep:'.',frac:'101',sign:'-',uncert:'2000'}});
  });
});