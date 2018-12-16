module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    peg: {
      numberparser : {
        src: "unpacked/number-parser.peg",
        dest: "unpacked/number-parser-peg.js",
        options: {
          optimize: 'size',
          wrapper: function (src, parser) {
            return 'define([], function () { return ' + parser + '; });';
          }
        }
      }
    },
    requirejs: {
      main: {
        options: {
          'findNestedDependencies': true,
          'baseUrl': 'unpacked',
          'optimize': 'none',
//          'mainConfigFile': 'src/js/app/config/config.js',
          'include': ['siunitx-commands'],
          'out': 'unpacked/siunitx.js',
          'onModuleBundleComplete': function (data) {
            var fs = require('fs'),
              path = require('path'),
              amdclean = require('amdclean'),
              outputFile = data.path;
            var main = fs.readFileSync(path.join(path.dirname(outputFile),'siunitx-amd.js'),{encoding:'utf-8'});
            var start_mark = /\n\s*\/\/ amd-replace-start\s*\n/m,
                stop_mark = /\n\s*\/\/ amd-replace-stop\s*\n/m;
            start_mark = start_mark.exec(main);
            var start_pos = start_mark.index + start_mark[0].length;
            stop_mark = stop_mark.exec(main);
            var stop_pos = stop_mark.index; // + stop_mark[0].length;
            var cleaned = amdclean.clean({
              'filePath': outputFile
            });
            main = main.substring(0,start_pos)
              + cleaned
              + main.substring(stop_pos).replace(
                  /(MathJax\.Ajax\.loadComplete\("\[Contrib\]\/siunitx).*?("\);)/,
                  '$1/unpacked/siunitx.js$2'
                );
            fs.writeFileSync(outputFile, main);
          }
        }
      }
    },
    uglify: {
      options: {mangle: true, beautify: false},
      main: {
        files: {
          'siunitx.js': ['unpacked/siunitx.js']
        }
      }
    },
    copy: {
      main: {
          src: 'siunitx.js',
          dest:'siunitx.js',
          options: {
            process: function (content, srcpath) {
              return content.replace(
                  /(MathJax\.Ajax\.loadComplete\("\[Contrib\]\/siunitx).*?("\);)/,
                  '$1/siunitx.js$2'
              );
            }
          }
      }
    },
    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/**/*.js']
      }
    }
  });
  grunt.loadNpmTasks('grunt-peg');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.registerTask('build', ['peg','requirejs','uglify','copy']);
  grunt.registerTask('test', ['mochaTest']);
  grunt.registerTask('default', ['build','test']);
};