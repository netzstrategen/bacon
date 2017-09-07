const gulp = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const cleanCss = require('gulp-clean-css');
const pkg = require('./package.json');
const plumber = require('gulp-plumber');
const rename = require('gulp-rename');
const replace = require('gulp-replace');
const sass = require('gulp-sass');
const sassdoc = require('sassdoc');
const sourcemaps = require('gulp-sourcemaps');
const stylelint = require('gulp-stylelint');

const paths = {
  scss: ['./assets/scss/**/*.scss', '!./assets/scss/**/vendor/*.scss'],
  dist: './dist/css'
};

const copyrightPlaceholder = '/*! #copyright DO NOT REMOVE# */';
const copyrightNotice = ['/*!',
  ' * ' + pkg.title + ' - ' + pkg.description,
  ' * @version v' + pkg.version,
  ' * @link ' + pkg.homepage,
  ' * @author ' + pkg.author,
  ' */',
  ''].join('\n');

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
    .pipe(autoprefixer(pkg.browserslist))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.dist));
});

gulp.task('prod-scss', function () {
  return gulp.src(paths.scss)
    .pipe(plumber())
    .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
    .pipe(autoprefixer(pkg.browserslist))
    .pipe(replace(copyrightPlaceholder, copyrightNotice))
    .pipe(cleanCss())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest(paths.dist));
});

gulp.task('sassdoc', function () {
  return gulp.src(paths.scss)
    .pipe(sassdoc());
});

gulp.task('clean-dist', require('del').bind(null, paths.dist));

gulp.task('default', ['scss'], function () {
  gulp.watch(paths.scss, ['scss']);
});

module.exports = gulp; // Export the Gulp instance for use in Fractal CLI
