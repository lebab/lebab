var grunt = require('grunt');
require('load-grunt-tasks')(grunt);

grunt.initConfig({
  babel: {
    options: {
      modules: 'common'
    },
    dist: {
      files:  [{
        'expand': true,
        'cwd': 'src/',
        'src': ['**/*.js'],
        'dest': 'lib/',
        'ext': '.js'
      }, {
        'expand': true,
        'cwd': 'test/',
        'src': ['**/*.js'],
        'dest': 'test-lib/',
        'ext': '.js'
      }]
    }
  },
  watch: {
    options: {
      spawn: false
    },
    scripts: {
      files: ['src/**/*.js'],
      tasks: ['default']
    }
  },
  jshint: {
    options: {
      jshintrc: '.jshintrc'
    },
    allFiles: [
      'src/**/*.js',
      'test/**/*.js',
      'bin/*.js',
      '*.js'
    ]
  },
  clean: {
    js: [
      'lib/**/*.js',
      'test-lib/**/*.js'
    ]
  },
  mochaTest: {
    test: {
      options: {
        reporter: 'spec'
      },
      src: ['test-lib/**/*.js']
    }
  }
});

grunt.registerTask('default', ['clean', 'babel']);
grunt.registerTask('test', ['jshint', 'default', 'mochaTest']);
