const autoprefixer = require('gulp-autoprefixer');
const cleanCss = require('gulp-clean-css');
const gulp = require('gulp');
const gulpif = require('gulp-if');
const magicImporter = require('node-sass-magic-importer');
const pkg = require('./package.json');
const plumber = require('gulp-plumber');
const rename = require('gulp-rename');
const replace = require('gulp-replace');
const sass = require('gulp-sass');
const sassdoc = require('sassdoc');
const sourcemaps = require('gulp-sourcemaps');
const stylelint = require('gulp-stylelint');

const paths = {
  src: './src/**/*.scss',
  bacon: './src/bacon.scss',
  docs: './docs/docs.scss',
  dist: './dist',
};

const copyrightPlaceholder = '/*! #copyright DO NOT REMOVE# */';
const copyrightNotice = ['/*!',
  ' * ' + pkg.title + ' - ' + pkg.description,
  ' * @version v' + pkg.version,
  ' * @link ' + pkg.homepage,
  ' * @author ' + pkg.author,
  ' */',
  ''].join('\n');

const cleanCssOptions = {
  level: {
    2: {
      all: true
    }
  }
};

const cssTasks = function(filename, options = { outputStyle: 'nested', sourcemaps: true, production: false }) {
  return gulp.src(filename)
    .pipe(plumber())
    .pipe(stylelint({
      syntax: 'scss',
      reporters: [{
        formatter: 'string',
        console: true
      }]
    }))
    .pipe(gulpif(options.sourcemaps, sourcemaps.init()))
    .pipe(sass({
      importer: magicImporter({
        disableImportOnce: true
      }),
      outputStyle: options.outputStyle
    }).on('error', sass.logError))
    .pipe(autoprefixer(pkg.browserslist))
    .pipe(gulpif(options.sourcemaps, sourcemaps.write()))
    .pipe(gulpif(options.production, replace(copyrightPlaceholder, copyrightNotice)))
    .pipe(gulpif(options.production, cleanCss(cleanCssOptions)))
    .pipe(gulpif(options.production, rename({ suffix: '.min' })))
    .pipe(gulp.dest(paths.dist));
};

gulp.task('css', function () {
  cssTasks(paths.bacon);
});

gulp.task('production-css', function () {
  cssTasks(paths.bacon, { outputStyle: 'compressed', sourcemaps: false, production: true });
});

gulp.task('docs', function () {
  cssTasks([paths.bacon, paths.docs]);
});

gulp.task('sassdoc', function () {
  return gulp.src(paths.src)
    .pipe(sassdoc());
});

gulp.task('clean-dist', require('del').bind(null, paths.dist));

gulp.task('default', ['css'], function () {
  gulp.watch(paths.src, ['css']);
});

module.exports = gulp; // Export the Gulp instance for use in Fractal CLI
