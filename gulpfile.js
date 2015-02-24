var fs = require('fs'),
    path = require('path'),
    args = require('yargs').argv;

var gulp = require('gulp'),
    gutil = require('gulp-util'),
    newer = require('gulp-newer'),
    svg2png = require('gulp-rsvg'),
    imagemin = require('gulp-imagemin'),
    svgmin = require('gulp-svgmin'),
    runSequence = require('run-sequence'),
    connect = require('gulp-connect');

var buildOptions = {
        release: 'r' in args || 'release' in args
    };


gulp.task('default', function() {
    return gulp.start('build');
});

gulp.task('d', ['dev']);
gulp.task('dev', function(callback) {
    return runSequence('build', 'connect', 'watch', callback);
});

gulp.task('build', function(callback) {
    return runSequence(
        'stack',
        callback
    );
});

gulp.task('watch', function(callback) {
    // Templates
    gulp.watch('./templates/**/*.html', function() {
        return runSequence('stack', 'reload');
    });
});

gulp.task('connect', function() {
    connect.server({
        root: __dirname + '/build',
        port: 3333,
        hostname: '*'
    });
});

gulp.task('reload', function() {
    return (
        gulp.src('build/*')
            .pipe(connect.reload())
    );
});

gulp.task('stack', require('./tasks/stack')(buildOptions));

// gulp.task('build-png-sprite', require('./tasks/pngSprite')(buildOptions));
// gulp.task('build-svg-sprite', require('./tasks/svgSprite')(buildOptions));




