var gulp = require('gulp');
var less = require('gulp-less');

gulp.task('less', function() {
    gulp.src('./src/css/*.less')
        .pipe(less())
        .pipe(gulp.dest('./src/css'))
});

gulp.task('default', ['less'], function() {
    gulp.watch('./src/css/*.less', ['less']);
})