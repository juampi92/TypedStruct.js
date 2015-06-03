module.exports = function(grunt) {
  'use strict';

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    // Mocha
    mochaTest: {
      test: {
        options: {
          reporter: 'spec',
          captureFile: 'results/tests.txt', // Optionally capture the reporter output to a file
          quiet: false, // Optionally suppress output to standard out (defaults to false)
          clearRequireCache: false // Optionally clear the require cache before running tests (defaults to false)
        },
        src: ['tests/**/*.test.js']
      }
    },
    // Uglify
    uglify: {
      build: {
        options: {
          mangle: false,
          banner: '/*!\n' + 
          ' * TypedStruct.js - v<%= pkg.version %>\n' + 
          ' * (c) <%= pkg.author %>\n' + 
          ' * <%= pkg.homepage %>\n' + 
          ' */\n'
        },
        files: {
          'typedstruct.min.js': ['typedstruct.js']
        }
      }
    },
    update_json: {
      // set some task-level options 
      options: {
        src: 'package.json',
        indent: '  '
      },
      // update bower.json with data from package.json 
      bower: {
        dest: 'bower.json', // where to write to 
        fields: 'version, name, main, description, author, license, repository, keywords'
      }
    }
  });

  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-update-json');

  grunt.registerTask('build', ['uglify','update_json']);
  grunt.registerTask('test', ['mochaTest']);
};