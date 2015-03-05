var grunt = require('grunt');
require('load-grunt-tasks')(grunt);

grunt.initConfig({
  babel: {
    options: {
      modules: 'common'
    },
    dist: {
      files:  [{
        "expand": true,
        "cwd": "src/",
        "src": ["**/*.js"],
        "dest": "lib/",
        "ext": ".js"
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
      'src/**/*.js'
    ]
  },
  clean: {
    js: ["lib/**/*.js"]
  }
});

grunt.registerTask('default', ['clean', 'babel']);