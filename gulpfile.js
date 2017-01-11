/*eslint no-console: ["error", { allow: ["warn", "error"] }] */
'use strict';
var gulp = require('gulp');
var tape = require('gulp-tape');
var browserify = require('browserify');
var watchify = require('watchify');
var babelify = require('babelify');
var rimraf = require('rimraf');
var source = require('vinyl-source-stream');
var _ = require('lodash');
var browserSync = require('browser-sync');
var jsdoc = require('gulp-jsdoc3');
var tapSpec = require('tap-spec');
var reload = browserSync.reload;

var config = {
  entryFile: './src/index.js',
  outputDir: './dist/',
  outputFile: 'index.js'
};

var bundler;
function getBundler() {
  if (!bundler) {
    bundler = watchify(browserify(config.entryFile, _.extend({ debug: true }, watchify.args)));
  }
  return bundler;
}

function bundle() {
  return getBundler()
    .transform(babelify)
    .bundle()
    .on('error', function(err) {
      console.error('Error: ' + err.message);
    })
    .pipe(source(config.outputFile))
    .pipe(gulp.dest(config.outputDir))
    .pipe(reload({ stream: true }));
}

gulp.task('clean', function(cb){
  rimraf(config.outputDir, cb);
});

gulp.task('test', function(){
  return gulp.src('tests/**/*.js')
    .pipe(tape({
      reporter: tapSpec()
    }));
});

gulp.task('build-persistent', ['clean'], function() {
  return bundle();
});

gulp.task('build', ['build-persistent'], function() {
  process.exit(0);
});

gulp.task('watch', ['build-persistent'], function() {
  browserSync({
    server: {
      baseDir: './'
    }
  });
  getBundler().on('update', function() {
    gulp.start('build-persistent');
  });
});

gulp.task('serve', function () {
  browserSync({
    server: {
      baseDir: './'
    }
  });
});

gulp.task('docs', function (cb) {
  var jsdoc_config = require('./jsdoc.json');
  gulp.src(['./src/**/*.js'], { read: false })
  .pipe(jsdoc(jsdoc_config,cb));
});
