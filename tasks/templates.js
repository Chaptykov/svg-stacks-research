var gulp = require('gulp'),
    handlebars = require('gulp-compile-handlebars'),
    data = require('gulp-data'),
    runSequence = require('run-sequence'),
    path = require('path'),
    fs = require('fs');

module.exports = function(buildOptions) {
    var base = 'source/blocks/',
        blocks = [],
        blocksFolder = fs.readdirSync(base);

    blocksFolder.forEach(function(item) {
        var that = path.join(base, item);

        if (fs.statSync(that).isDirectory()) {
            blocks.push(that);
        }
    });

    gulp.task('templates', function() {
        var options = {
                ignorePartials: true,
                batch : blocks
            };

        return (
            gulp
                .src(['templates/layout.html'])
                .pipe(data(function(file) {
                    return require('../source/data/' + path.basename(file.path, '.html') + '.json');
                }))
                .pipe(handlebars(data, options))
                .pipe(gulp.dest('build/'))
        );
    });

    return function(callback) {
        runSequence('templates', callback);
    };
};