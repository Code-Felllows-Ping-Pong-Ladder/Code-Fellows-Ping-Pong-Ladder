'use strict';

const gulp = require('gulp');
const webpack = require('webpack-stream');
const clean = require('gulp-clean');
const mocha = require('gulp-mocha');

const paths = {
  js: __dirname + '/app/**/*.js',
  html: __dirname + '/app/**/*.html',
  css: __dirname + '/app/**/*.css',
  ico: __dirname + '/app/**/*',
  images: __dirname + '/app/**/*.png'
};

gulp.task('clean', ()=>{
  return gulp.src('./build/*', {read:false})
    .pipe(clean());
});

gulp.task('copy-html', ['clean'], ()=>{
  return gulp.src(paths.html)
    .pipe(gulp.dest('./build'));
});

gulp.task('copy-css', ['clean'], ()=>{
  return gulp.src(paths.css)
    .pipe(gulp.dest('./build'));
});

gulp.task('copy-ico', ['clean'], ()=>{
  return gulp.src(paths.ico)
  .pipe(gulp.dest('./build'));
});

gulp.task('copy-images', ['clean'], ()=>{
  return gulp.src(paths.images)
  .pipe(gulp.dest('./build'));
});

gulp.task('bundle', ['clean'], ()=>{
  return gulp.src(paths.js)
    .pipe(webpack({
      output: {
        filename: 'bundle.js'
      }
    }))
    .pipe(gulp.dest('./build'));
});

gulp.task('bundle:test', () => {
  return gulp.src(__dirname + '/fetest/*_test.js')
    .pipe(webpack({
      output: {
        filename: 'test_bundle.js'
      },
      module: {
        loaders: [{
          test: /\.html$/,
          loader: 'html'
        }]
      }
    }))
    .pipe(gulp.dest(__dirname + '/fetest'));
});


gulp.task('test', () => {
  gulp.src('test/*.js')
  .pipe(mocha());
});

gulp.task('watch', ()=>{
  gulp.watch('./app/*', ['build']);
});

gulp.task('build', ['clean', 'copy-html', 'copy-css', 'copy-ico', 'copy-images', 'bundle']);

gulp.task('default', ['build']);
