var gulp = require('gulp'),
    svgmin = require('gulp-svgmin'),
    svgSymbols = require('gulp-svg-symbols'),
    handlebars = require('gulp-compile-handlebars'),
    data = require('gulp-data'),
    runSequence = require('run-sequence'),
    path = require('path'),
    fs = require('fs');

function getIconsList(folder) {
    var icons = fs.readdirSync(folder),
        list = [];

    icons.forEach(function(filename) {
        var ext = path.extname(filename),
            re = /viewBox="0 0\s(\d+)\s(\d+)"/g,
            svg, match;

        if (ext == '.svg') {
            svg = fs.readFileSync(folder + '/' + filename, 'utf8');
            match = re.exec(svg);

            list.push({
                icon: path.basename(filename, '.svg'),
                w: match[1],
                h: match[2]
            });
        }
    });

    return list;
}

function getTemplateData() {
    return {
        title: 'SVG-stack',
        file: 'svg-symbols.svg',
        icons: getIconsList('svg')
    };
}

module.exports = function(buildOptions) {

    gulp.task('build-template', function () {
        var options = {
                ignorePartials: true
            };

        return (
            gulp
                .src(['templates/stack.html'])
                .pipe(data(function(file) {
                    return getTemplateData();
                }))
                .pipe(handlebars(data, options))
                .pipe(gulp.dest('build/'))
        );
    });

    gulp.task('build-stack', function () {
        return (
            gulp.src('svg/*.svg')
                .pipe(svgmin())
                .pipe(svgSymbols({
                    title: false,
                    svgoConfig: {},
                    templates: ['default-svg', 'default-css', 'default-demo']
                }))
                .pipe(gulp.dest('build'))
        );
    });

    return function(callback) {
        runSequence('build-template', 'build-stack', callback);
    };
};


