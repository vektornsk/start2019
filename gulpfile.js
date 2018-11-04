const gulp = require('gulp');
const pug = require('gulp-pug');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const rename = require("gulp-rename");
const purgecss = require('gulp-purgecss')
const browserSync = require('browser-sync').create();
const imagemin = require('gulp-imagemin');
const tiny = require('gulp-tinypng-nokey');
const pngquant = require('imagemin-pngquant');


function buildHtml() {
  return gulp.src("src/pug/*.pug")
    .pipe(pug({
      pretty: true
    }))
    .pipe(gulp.dest("static/html"))
    .pipe(browserSync.reload({
      stream: true
    }));
}

function buildStyle() {
  return gulp.src("src/scss/index.scss")
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 5 versions']
    }))
    .pipe(purgecss({
      content: ["static/html/*.html"]
    }))
    .pipe(rename("style.css"))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest("static/css"))
    .pipe(browserSync.stream());
}

function png() {
  return gulp.src("static/img/**/*{png, PNG}")
    .pipe(tiny())
    .pipe(gulp.dest("static/img/compressed"));
}

function all() {
  return gulp.src("static/img/**/*{jpg,jpeg,gif,svg,JPG,JPEG,GIF,SVG}")
    .pipe(imagemin({
      progressive: true,
      optimizationLevel: 10,
      svgoPlugins: [{
        removeViewBox: false
      }],
      use: [pngquant()]
    }))
    .pipe(gulp.dest("static/img/compressed"));
}

function pngDemo() {
  return gulp.src("static/demo/**/*{png, PNG}")
    .pipe(tiny())
    .pipe(gulp.dest("static/demo/compressed"));
}

function allDemo() {
  return gulp.src("static/demo/**/*{jpg,jpeg,gif,svg,JPG,JPEG,GIF,SVG}")
    .pipe(imagemin({
      progressive: true,
      optimizationLevel: 10,
      svgoPlugins: [{
        removeViewBox: false
      }],
      use: [pngquant()]
    }))
    .pipe(gulp.dest("static/demo/compressed"));
}


gulp.task('html', buildHtml);
gulp.task('style', buildStyle);
gulp.task('server', function () {

  browserSync.init({
    server: {
      baseDir: 'static'
    },
    notify: false
  });

  gulp.watch("./src/scss/**/*.scss", buildStyle);
  gulp.watch("./src/pug/**/*", buildHtml);
  gulp.watch("./static/js/**/*").on('change', browserSync.reload);
});

gulp.task('default', gulp.series('html', 'style', 'server'));
gulp.task('build', gulp.series('html', 'style'));
gulp.task('compress', gulp.parallel(png, all, pngDemo, allDemo));