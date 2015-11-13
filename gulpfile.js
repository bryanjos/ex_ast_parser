const gulp = require('gulp');
const babel = require('gulp-babel');
const mocha = require('gulp-mocha');


gulp.task('build', () => {
    return gulp.src('src/**/*.js')
        .pipe(babel())
        .pipe(gulp.dest('lib'));
});

gulp.task('test', ['build'], () => {
    return gulp.src('tests/**/*.js', {read: false})
        .pipe(mocha({reporter: 'spec'}));
});
