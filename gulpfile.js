var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var minify = require('gulp-minify-css');
var merge = require('merge-stream');
var stripCssComments = require('gulp-strip-css-comments');


var input = './stylesheets/*.scss';
var output = './public/css';
var uikit = './public/css/uikit.min.css';

gulp.task('style', function() {
    var scssStream = gulp.src(input)
        .pipe(sass())
        .pipe(concat('scss-files.scss'))
    ;

    var cssStream = gulp.src([uikit])
        .pipe(stripCssComments({preserve: false}))
        .pipe(concat('css-files.css'))
    ;

    var mergedStream = merge(scssStream, cssStream)
        .pipe(concat('stylesmin.css'))
        .pipe(minify())
        .pipe(gulp.dest('./public/css'));

    return mergedStream;
});