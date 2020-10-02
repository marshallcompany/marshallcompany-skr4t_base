const { src, dest, parallel, series, watch } = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const notify = require('gulp-notify');
const imagesmin = require('gulp-imagemin');
const del = require('del');

// Browser-sync
function initBrowserSync() {
    browserSync.init({
        server: {
            baseDir: './src'
        },
        ui: {
            port: 8080
        },
        port: 8000,
        online: true
    });
}

// Watch
function startWatch() {
    watch('./src/sass/**/*.scss').on('change', series(styles, browserSync.reload));
    watch('./src/**/*.html').on('change', browserSync.reload);
    watch('./src/**/*.js').on('change', browserSync.reload);
    watch('./src/**/*.php').on('change', browserSync.reload);
}

// Styles
function styles() {
    return src('./src/sass/**/*.scss')
    .pipe(sass())
    .on('error', notify.onError({
        message: 'Error: <%= error.message %>',
        title: 'Error'
    }))
    .pipe(autoprefixer({
        overrideBrowserslist: ['last 10 versions'],
        grid: true,
        cascade: false
    }))
    .pipe(dest('./src/styles'));
}

// Images minification
function imagesMinification() {
    return src('./src/**/*.+(jpg|png|ico|svg)', { base: './src' })
    .pipe(imagesmin())
    .pipe(dest('dist'))
}

// Remove dir dist
function removeDirDist() {
    return del(['./dist']);
}

// Build
function copyFile() {
    return src([
        './src/js/*.js',
        './src/styles/*.css',
        './src/libs/**/*.js',
        './src/libs/**/*.css',
        './src/**/*.html',
        './src/**/*.+(otf|ttf|woff|woff2|eot)',
        './src/**/*.+(mov|mp4)'
    ], { base: './src' })
    .pipe(dest('./dist'));
}

exports.build = series(removeDirDist, imagesMinification, copyFile);
exports.watch = parallel(styles, initBrowserSync, startWatch);