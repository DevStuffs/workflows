var gulp        = require('gulp'),
    gutil       = require('gulp-util'),
    coffee      = require('gulp-coffee'),
    browserify  = require('gulp-browserify'),
    compass     = require('gulp-compass'),
    connect     = require('gulp-connect'),
    gulpif      = require('gulp-if'),
    uglify      = require('gulp-uglify'),
    minifyHTML  = require('gulp-minify-html'),
    jsonminify  = require('gulp-jsonminify'),
    concat      = require('gulp-concat');

var env,
    coffeeSources,    
    sassSources,
    htmlSources,
    jsonSources,
    JsSources,
    outputDir,
    sassStyle;

env = process.env.NODE_ENV || 'development';
if (env==='development') {
    outputDir = 'builds/development/'; // we now use "outputDir +" to replace all of the instances of "builds/development/" in the code below
    sassStyle = 'expanded';
} else {
    outputDir = 'builds/production/';
    sassStyle = 'compressed'; // suuposed to minify for production, currently inconsistent
}



coffeeSources = ['components/coffee/tagline.coffee'];
sassSources = ['components/sass/style.scss'];
htmlSources = [outputDir + '*.html'];
jsonSources = [outputDir + 'js/*.json']
JsSources = [
    'components/scripts/rclick.js',
    'components/scripts/pixgrid.js',
    'components/scripts/tagline.js',
    'components/scripts/template.js'
]

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
        .pipe(gulpif(env === 'production', uglify()))
        .pipe(gulp.dest(outputDir + 'js'))
        .pipe(connect.reload())
});

gulp.task('compass', function() {
    gulp.src(sassSources)
        .pipe(compass({
            sass: 'components/sass',
            image: outputDir + 'images',
            style: sassStyle,
            line_comments: true,
            line_numbers: true,
            lineNumbers: true,
            comments: true
        })
        .on('error', gutil.log))
        .pipe(gulp.dest(outputDir + 'css'))
        .pipe(connect.reload())
});

gulp.task ('watch', function() {
    gulp.watch(coffeeSources, ['coffee']);
    gulp.watch(JsSources, ['js']);
    gulp.watch('components/sass/*.scss', ['compass']);
    //gulp.watch('builds/development/*.html', ['html']);
    gulp.watch('builds/development/js/*.json', ['json']);
});

gulp.task ('connect', function() {
    connect.server({
        root: outputDir,
        livereload: true
    });
})

gulp.task ('html', function() {
    gulp.src('builds/development/*.html')
        //.pipe(gulpif(env === 'production', minifyHTML())) // minify if in production
        .pipe(gulpif(env === 'production', gulp.dest(outputDir))) // send updated, minified index files to the ouput directory
        .pipe(connect.reload())
})

gulp.task ('json', function() {
    gulp.src('builds/development/js/*.json')
        .pipe(gulpif(env === 'production', jsonminify()))
        .pipe(gulpif(env === 'production', gulp.dest('builds/production/js')))    
        .pipe(connect.reload())
})

gulp.task('default', ['coffee', 'js', 'compass', 'watch', 'connect', 'html', 'json']);

