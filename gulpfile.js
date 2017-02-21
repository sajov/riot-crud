var gulp = require('gulp');
var riot = require('gulp-riot');
var $    = require('gulp-load-plugins')();
var babel = require("gulp-babel");
var babili = require("babili");
var minify = require('gulp-babel-minify');
var rename = require('gulp-rename');

var browserSync = require('browser-sync');
var reload = browserSync.reload;

gulp.task('sass', function() {

  gulp.src('scss/guentella.scss')
    .pipe(gulp.dest('css/guentella.css'));
    reload();
});

gulp.task('riot', function() {
  console.log('riot');
  gulp.src(['tags/themes/**/*.tag'])
      .pipe(riot())
      .pipe(gulp.dest('js/riotcrud/themes'));

  reload();
});

gulp.task("compress", function () {
  return gulp.src("js/riotcrud.js")
    .pipe(babel())
    // .pipe(minify())
    .pipe(rename({
            suffix: '.min'
        }))
    .pipe(gulp.dest("js"));
});

// watch files for changes and reload
gulp.task('serve', function() {

  gulp.watch(['scss/**/*.scss'], ['sass']);
  gulp.watch(['tags/**/*.tag'], ['riot']);
  gulp.watch(['js/*.js'], ['compress']);
  // gulp.watch(['page/**/*.tag'], ['riot']);
  gulp.watch(['*.html', 'styles/**/*.css', 'scripts/**/*.js', 'js/**/*.js'],  reload);

  browserSync({
    server: {
      baseDir: './'
    }
  });

});

gulp.task('default', ['sass'], function() {
  gulp.watch(['scss/**/*.scss'], ['sass']);
});
