const gulp = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const plumber = require('gulp-plumber');
const sass = require('gulp-sass');
const sassdoc = require('sassdoc');
const sourcemaps = require('gulp-sourcemaps');
const stylelint = require('gulp-stylelint');

const paths = {
  scss: ['./assets/scss/**/*.scss', '!./assets/scss/**/vendor/*.scss'],
  dist: './dist/css'
};

gulp.task('scss', function () {
  return gulp.src(paths.scss)
    .pipe(plumber())
    .pipe(stylelint({
      syntax: 'scss',
      reporters: [{
        formatter: 'string',
        console: true
      }]
    }))
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer('last 2 versions'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.dist));
});

gulp.task('sassdoc', function () {
  return gulp.src(paths.scss)
    .pipe(sassdoc());
});

// gulp.task('clean', require('del').bind(null, paths.dist));

gulp.task('default', ['scss', 'sassdoc'], function () {
  gulp.watch(paths.scss, ['scss', 'sassdoc']);
});

module.exports = gulp; // Export the Gulp instance for use in Fractal CLI
