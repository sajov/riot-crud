var gulp = require('gulp');
var riot = require('gulp-riot');
var $    = require('gulp-load-plugins')();
var browserSync = require('browser-sync');
var reload = browserSync.reload;

gulp.task('sass', function() {

  gulp.src('scss/guentella.scss')
    .pipe(gulp.dest('css'));
    reload();
});

gulp.task('riot', function() {
  console.log('riot');
  gulp.src(['tags/themes/**/*.tag'])
      .pipe(riot())
      .pipe(gulp.dest('js/riotcrud/themes'));

  reload();
});

// watch files for changes and reload
gulp.task('serve', function() {

  gulp.watch(['scss/**/*.scss'], ['sass']);
  gulp.watch(['tags/**/*.tag'], ['riot']);
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
