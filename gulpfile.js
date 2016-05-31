var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var minify = require('gulp-minify-css');
var merge = require('merge-stream');
var stripCssComments = require('gulp-strip-css-comments');
var uglify = require('gulp-uglify');
var input = './stylesheets/*.scss';
var output = './public/css';
var uikit = './public/css/uikit.min.css';
var js = './public/js/*.js';
gulp.task('js', function() {
    var jsStream = gulp.src(js).pipe(uglify()).pipe(concat('app.js')).pipe(gulp.dest('./public/js/dist'));
});
gulp.task('style', function() {
    var scssStream = gulp.src(input).pipe(sass()).pipe(concat('scss-files.scss'));
    var cssStream = gulp.src([uikit]).pipe(stripCssComments({
        preserve: false
    })).pipe(concat('css-files.css'));
    var mergedStream = merge(scssStream, cssStream).pipe(concat('stylesmin.css')).pipe(minify()).pipe(gulp.dest('./public/css'));
    return mergedStream;
});
gulp.task('default', ['style', 'js']);