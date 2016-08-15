var grunt = require('grunt');
require('load-grunt-tasks')(grunt);

grunt.initConfig({
  watch: {
    options: {
      spawn: false
    },
    scripts: {
      files: ['src/**/*.js'],
      tasks: ['default']
    }
  },
  clean: {
    js: [
      'lib/**/*.js',
    ]
  },
});
