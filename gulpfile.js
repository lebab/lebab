var gulp = require('gulp');
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var buffer = require('vinyl-buffer');
var uglifyes = require('uglify-es');
var composer = require('gulp-uglify/composer');
var uglify = composer(uglifyes, console);
var plumber = require('gulp-plumber');
var rename = require('gulp-rename');
var onError = error => {
  console.log(`Error (${error.plugin}): ${error.message}`);
    // emit the end event, to properly end the task
  console.log(`Error stack ${error}`);
};

function buildMinJs() {
  var file = `./index.js`;
  var props = {
    standalone: 'lebab',
    entries: [file],
    debug: false,
    cache: {},
    packageCache: {}
  };
  var bundler = browserify(props);
  function rebundle() {
    var stream = bundler.bundle();
    return stream.pipe(plumber({ errorHandler: onError })).pipe(source(file)).pipe(buffer()).pipe(plumber({ errorHandler: onError })).pipe(rename('lebab.js')).pipe(gulp.dest('./dist')).pipe(uglify().on('error', onError)).pipe(rename('lebab.min.js')).pipe(plumber(onError)).pipe(gulp.dest('./dist'));
  }
    // run it once the first time buildScript is called
  return rebundle();
}

gulp.task('default', buildMinJs);
