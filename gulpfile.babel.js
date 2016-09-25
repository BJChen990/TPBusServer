var gulp = require('gulp'),
    nodemon = require('gulp-nodemon'),
    babel = require('gulp-babel'),
    Cache = require('gulp-file-cache');

var cache = new Cache();

gulp.task('compile', function () {
    return gulp.src('./src/**/*.js')
        .pipe(cache.filter())
        .pipe(babel({}))
        .pipe(cache.cache())
        .pipe(gulp.dest('./'));
})

gulp.task('watch', ['compile'], () => {
    return nodemon({
        script: './bin/www',
        watch: './src/',
        tasks: ['compile']
    });
})
