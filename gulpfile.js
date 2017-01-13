var gulp = require('gulp'),
    gutil = require('gulp-util'),
    coffee = require('gulp-coffee'),
    browserify = require('gulp-browserify'),
    compass = require('gulp-compass'),
    connect = require('gulp-connect'),
    concat = require('gulp-concat');

var coffeeSources = ['components/coffee/tagline.coffee'];
var JsSources = [
    'components/scripts/rclick.js',
    'components/scripts/pixgrid.js',
    'components/scripts/tagline.js',
    'components/scripts/template.js'
]
var sassSources = ['components/sass/style.scss'];
var htmlSources = ['builds/development/*.html'];
var jsonSources = ['builds/development/js/*.json']

gulp.task('coffee', function() {
    gulp.src(coffeeSources)
        .pipe(coffee({ bare: true })
            .on('error', gutil.log))
        .pipe(gulp.dest('components/scripts'))        
});

gulp.task('js', function() {
    gulp.src(JsSources)
        .pipe(concat('script.js'))
        .pipe(browserify())
        .pipe(gulp.dest('builds/development/js'))
        .pipe(connect.reload())
});

gulp.task('compass', function() {
    gulp.src(sassSources)
        .pipe(compass({
            sass: 'components/sass',
            image: 'builds/development/images',
            style: 'expanded',
            line_comments: true,
            line_numbers: true,
            lineNumbers: true,
            comments: true,
        })
        .on('error', gutil.log))
        .pipe(gulp.dest('builds/development/css'))
        .pipe(connect.reload())
});

gulp.task ('watch', function() {
    gulp.watch(coffeeSources, ['coffee']);
    gulp.watch(JsSources, ['js']);
    gulp.watch('components/sass/*.scss', ['compass']);
    gulp.watch(htmlSources, ['html']);
    gulp.watch(jsonSources, ['json']);
});

gulp.task ('connect', function() {
    connect.server({
        root: 'builds/development/',
        livereload: true
    });
})

gulp.task ('html', function() {
    gulp.src(htmlSources)
    .pipe(connect.reload())
})

gulp.task ('json', function() {
    gulp.src(jsonSources)
    .pipe(connect.reload())
})

gulp.task ('default', ['html', 'json', 'coffee', 'js', 'compass', 'connect', 'watch']);

