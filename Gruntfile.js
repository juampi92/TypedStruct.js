module.exports = function(grunt) {
  'use strict';

  grunt.initConfig({
    // Benchmarks
    benchmark: {
      all: {
        src: ['benchmarks/**/*.bench.js'],
        dest: 'results/all.csv'
      },
      experiments: {
        src: ['benchmarks/experiments/*.bench.js'],
        dest: 'results/experiments.csv'
      },
      algorithms: {
        src: ['benchmarks/algorithms/*.bench.js'],
        dest: 'results/algorithms.csv'
      }
    },
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
    }
  });

  grunt.loadNpmTasks('grunt-benchmark');
  grunt.loadNpmTasks('grunt-mocha-test');

  grunt.registerTask('bench', ['benchmark:all']);
  grunt.registerTask('test', ['mochaTest']);
};