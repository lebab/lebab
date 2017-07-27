const gulp = require('gulp');
const source = require('vinyl-source-stream');
const browserify = require('browserify');
const buffer = require('vinyl-buffer');
const uglifyes = require('uglify-es');
const composer = require('gulp-uglify/composer');
const uglify = composer(uglifyes, console);
const plumber = require('gulp-plumber');
const rename = require('gulp-rename');
const onError = error => {
  console.log(`Error (${error.plugin}): ${error.message}`); // eslint-disable-line no-console
  // emit the end event, to properly end the task
  console.log(`Error stack ${error}`); // eslint-disable-line no-console
};

function buildMinJs() {
  const file = './index.js';
  const props = {
    standalone: 'lebab',
    entries: [file],
    debug: false,
    cache: {},
    packageCache: {}
  };
  const bundler = browserify(props);
  function rebundle() {
    const stream = bundler.bundle();
    return stream.pipe(plumber({errorHandler: onError})).pipe(source(file)).pipe(buffer()).pipe(plumber({errorHandler: onError})).pipe(rename('lebab.js')).pipe(gulp.dest('./dist')).pipe(uglify().on('error', onError)).pipe(rename('lebab.min.js')).pipe(plumber(onError)).pipe(gulp.dest('./dist'));
  }
    // run it once the first time buildScript is called
  return rebundle();
}

gulp.task('default', buildMinJs);
