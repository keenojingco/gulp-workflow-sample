var gulp = require('gulp');
var config = require('./gulp.config')();

var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var cssnano = require('gulp-cssnano');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');

var browserSync = require('browser-sync').create();
var del = require('del');
var runSequence = require('run-sequence');

var $ = require('gulp-load-plugins')({lazy: true});

// wiredep bower components and inject app scripts
gulp.task('wiredep', function(){
    var wiredep = require('wiredep').stream;
    var options = config.getWiredepOptions();

    return gulp
        .src(config.index)
        .pipe(wiredep(options))
        .pipe($.inject(gulp.src(config.js)))
        .pipe(gulp.dest(config.app));
});

// compile sass to css
gulp.task('styles', ['clean-styles'], function(){
    return gulp
        .src(config.sass)
        .pipe($.sass())
        .pipe($.autoprefixer({browsers : ['last 2 version', '> 5%']}))
        .pipe(gulp.dest(config.temp))
        .pipe(browserSync.reload({
            stream: true
        }));
});

// inject app styles
gulp.task('inject', ['wiredep', 'styles'], function(){
    return gulp
        .src(config.index)
        .pipe($.inject(gulp.src(config.css)))
        .pipe(gulp.dest(config.app));
});

// clean app styles folder
gulp.task('clean-styles', function(){
    var files = config.temp + '**/*.css';
    return del.sync(files);
});

// browserSync
gulp.task('browserSync', function() {
    browserSync.init({
        server: {
            baseDir: config.app,
            routes: {
                "/bower_components" : './bower_components',
                "/.tmp": config.temp,
                "/src/app/js": config.appJS
            }
        },
    })
});

// watchers for changes to css, js, and index.html files
gulp.task('watch', ['browserSync', 'styles'], function(){
    gulp.watch(config.sass, ['styles']);
    gulp.watch(config.index, browserSync.reload);
    gulp.watch(config.js, browserSync.reload);
});

gulp.task('useref', function() {
    return gulp.src('app/*.html')
        .pipe(useref())
        .pipe(gulpIf('*.js', uglify()))
        .pipe(gulpIf('*.css', cssnano()))
        .pipe(gulp.dest('dist'))
});

gulp.task('images', function(){
    return gulp.src('app/images/**/*.+(png|jpg|gif|svg)')
    .pipe(cache(imagemin({
        interlaced: true
    })))
    .pipe(gulp.dest('dist/images'))
});

gulp.task('fonts', function() {
    return gulp.src('app/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'))
});

gulp.task('clean-dist', function() {
  return del.sync('dist');
});

// start/sreve dev build
gulp.task('default', function (callback) {
    runSequence(['inject', 'browserSync', 'watch'],
        callback
    )
});

// build production code
gulp.task('build', function(callback) {
    runSequence('clean-dist',['inject', 'useref', 'images', 'fonts'],
        callback
    )
});