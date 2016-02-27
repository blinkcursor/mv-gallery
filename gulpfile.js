// Include gulp
var gulp = require('gulp');

// Include plugins
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var responsive = require('gulp-responsive');
var sass = require('gulp-ruby-sass');
var sourcemaps = require('gulp-sourcemaps');

// Folder locations
var src = 'src/';
var dest = 'dist/';

/* DEFINE TASKS */

// Bundle & Minify JS
gulp.task('scripts', function() {
    return gulp.src([src + 'js/plugins/*.js', src + 'js/mvgallery.js'])
      .pipe(concat('mvgallery-bundle.js'))
      .pipe(rename({suffix: '.min'}))
      .pipe(uglify())
      .pipe(gulp.dest(dest));
});
// also unbundled minified versions


// Preprocess SCSS
gulp.task('sass', function() {
  return sass(src + 'scss/style.scss', { style: 'compressed', sourcemap: true })
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(dest));
});


// Generate array of img sizes for demo
// TODO: provide array of sizes and loop through
gulp.task('images', function() {
  return gulp.src(src + 'img/*.jpg')
    .pipe(responsive({
      // Resize all JPG images to required sizes
      '*.jpg': [{
        width: 400,
        rename: { suffix: '-400' },
      }, {
        width: 600,
        rename: { suffix: '-600' },
      }, {
        width: 800,
        rename: { suffix: '-800' },
      }, {
        width: 1000,
        rename: { suffix: '-1000' },
      }, {
        width: 1200,
        rename: { suffix: '-1200' },
      }, {
        width: 1400,
        rename: { suffix: '-1400' },
      }, {
        width: 1800,
        rename: { suffix: '-1800' },
      }, {
        width: 2400,
        rename: { suffix: '-2400' },
      }],
    }, {
      // Global configuration for all images
      // The output quality for JPEG, WebP and TIFF output formats
      quality: 80,
      // Use progressive (interlace) scan for JPEG and PNG output
      progressive: true,
      // Strip all metadata
      withMetadata: false,
      // Don't make bigger files than the original
      skipOnEnlargement: false,
      withoutEnlargement: false,
      errorOnEnlargement: false
    }))
    .pipe(gulp.dest('img/'));
});


// Watch files
gulp.task('watch', function() {
  // .js files
  gulp.watch(src + 'js/**/*.js', ['scripts']);
  // .scss files
  gulp.watch(src + 'scss/**/*.scss', ['sass']);
});


/* Default tasks */
gulp.task('default', ['watch', 'sass', 'scripts']);