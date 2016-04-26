var gulp = require('gulp');
var less = require('gulp-less');
var cleanCSS = require('gulp-clean-css');
var uglify = require('gulp-uglify');
var plumber = require('gulp-plumber');
var rename = require('gulp-rename');

gulp.task('minjs', function() {
	gulp.src('dev/js/*.js')
	.pipe(plumber())
	.pipe(uglify())
	.pipe(rename({ suffix: '.min' }))
	.pipe(gulp.dest('dist/js'))
});

gulp.task('mincss', function() {
	gulp.src('dev/less/*.less')
	.pipe(less())
	.pipe(plumber())
	.pipe(cleanCSS())
	.pipe(rename({ suffix: '.min' }))
	.pipe(gulp.dest('dist/css'))
});

gulp.task('compile', ['minjs', 'mincss']);