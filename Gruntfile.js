var grunt = require('grunt');
require('load-grunt-tasks')(grunt);

grunt.initConfig({
  clean: {
    build: ['.tmp', 'assets']
  },
  copy: {
    dist: {
      files: [
        {src: 'src/index.html', dest: 'index.html'},
        {src: 'src/favicon.png', dest: 'favicon.png'}
      ]
    }
  },
  useminPrepare: {
    html: 'index.html',
    options: {
      dest: '.tmp'
    }
  },
  concat: {
    generated: {
      files: [
        {
          dest: '.tmp/concat/js/app.js',
          src: ['src/scripts/xto6.js', 'src/scripts/app.js']
        },
        {
          dest: '.tmp/concat/js/vendor.js',
          src: ['src/bower_components/ace-builds/src/ace.js', 'bower_components/ace-builds/src/theme-github.js', 'bower_components/ace-builds/src/mode-javascript.js', 'src/bower_components/highlightjs/highlight.pack.js']
        },
        {
          dest: '.tmp/concat/css/app.css',
          src: ['src/styles/app.css']
        },
        {
          dest: '.tmp/concat/css/vendor.css',
          src: ['src/bower_components/highlight.js/src/styles/default.css', 'src/bower_components/icono/build/icono.css', 'src/bower_components/bootstrap/dist/css/bootstrap.css']
        }
      ]
    }
  },
  uglify: {
    generated: {
      files: [
        {
          dest: 'assets/js/app.js',
          src: ['.tmp/concat/js/app.js']
        },
        {
          dest: 'assets/js/vendor.js',
          src: ['.tmp/concat/js/vendor.js']
        }
      ]
    }
  },
  cssmin: {
    generated: {
      files: [
        {
          dest: 'assets/css/app.css',
          src: ['.tmp/concat/css/app.css']
        },
        {
          dest: 'assets/css/vendor.css',
          src: ['.tmp/concat/css/vendor.css']
        }
      ]
    }
  },
  usemin: {
    html: 'index.html',
    options: {}
  },
  htmlmin: {
    dist: {
      options: {
        removeComments: true,
        collapseWhitespace: true,
        minifyJS: true
      },
      files: {
        'index.html': 'index.html'
      }
    }
  }
});

grunt.registerTask('build', [
  'clean',
  'copy',
  'useminPrepare',
  'concat:generated',
  'cssmin:generated',
  'uglify:generated',
  'usemin',
  'htmlmin'
]);