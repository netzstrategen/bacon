var gulp = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    plumber = require('gulp-plumber'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    stylelint = require('gulp-stylelint');

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

// gulp.task('clean', require('del').bind(null, paths.dist));

gulp.task('default', ['scss'], function () {
  gulp.watch(paths.scss, ['scss']);
});

module.exports = gulp; // Export the Gulp instance for use in Fractal CLI
