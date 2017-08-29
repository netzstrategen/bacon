const gulp = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const plumber = require('gulp-plumber');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const stylelint = require('gulp-stylelint');
const cleanCss = require('gulp-clean-css');
const rename = require('gulp-rename');

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
    // Output non-minified version
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.dist))
    // Output minified version and add related suffix
    .pipe(cleanCss())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.dist));
});

// gulp.task('clean', require('del').bind(null, paths.dist));

gulp.task('default', ['scss'], function () {
  gulp.watch(paths.scss, ['scss']);
});

module.exports = gulp; // Export the Gulp instance for use in Fractal CLI
