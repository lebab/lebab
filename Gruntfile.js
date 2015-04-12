var grunt = require('grunt');
require('load-grunt-tasks')(grunt);

grunt.initConfig({
  configs: {
    src: 'src',
    bower: 'src/bower_components',
    concat: '.tmp/concat',
    scripts: 'src/scripts',
    styles: 'src/styles',
    tmp: 'src/tmp',
    assets: 'assets'
  },
  clean: {
    build: ['.tmp', 'assets']
  },
  copy: {
    dist: {
      files: [
        {src: '<%= configs.src %>/index.html', dest: 'index.html'},
        {src: '<%= configs.src %>/favicon.png', dest: 'favicon.png'}
      ]
    }
  },
  useminPrepare: {
    html: 'index.html',
    options: {
      dest: '<%= configs.tmp %>'
    }
  },
  concat: {
    generated: {
      files: [
        {
          dest: '<%= configs.concat %>/js/app.js',
          src: ['<%= configs.scripts %>/xto6.js', '<%= configs.scripts %>/app.js']
        },
        {
          dest: '<%= configs.concat %>/js/vendor.js',
          src: ['<%= configs.bower %>/ace-builds/src/ace.js', '<%= configs.bower %>/ace-builds/src/theme-monokai.js', '<%= configs.bower %>/ace-builds/src/mode-javascript.js', '<%= configs.bower %>/ace-builds/src/worker-javascript.js', '<%= configs.bower %>/highlightjs/highlight.pack.js']
        },
        {
          dest: '<%= configs.concat %>/css/app.css',
          src: ['<%= configs.styles %>/app.css']
        },
        {
          dest: '<%= configs.concat %>/css/vendor.css',
          src: ['<%= configs.bower %>/highlightjs/styles/monokai.css', '<%= configs.bower %>/icono/build/icono.css', '<%= configs.bower %>/bootstrap/dist/css/bootstrap.css']
        }
      ]
    }
  },
  uglify: {
    generated: {
      files: [
        {
          dest: '<%= configs.assets %>/js/app.js',
          src: ['<%= configs.concat %>/js/app.js']
        },
        {
          dest: '<%= configs.assets %>/js/vendor.js',
          src: ['<%= configs.concat %>/js/vendor.js']
        }
      ]
    }
  },
  cssmin: {
    generated: {
      files: [
        {
          dest: '<%= configs.assets %>/css/app.css',
          src: ['<%= configs.concat %>/css/app.css']
        },
        {
          dest: '<%= configs.assets %>/css/vendor.css',
          src: ['<%= configs.concat %>/css/vendor.css']
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