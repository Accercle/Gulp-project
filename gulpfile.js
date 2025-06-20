const {src, dest, watch, parallel, series} = require('gulp')

const scss = require('gulp-sass')(require('sass'))
const concat = require('gulp-concat')
const uglify = require('gulp-uglify-es').default
const browserSync = require('browser-sync').create()
// const autoprefixer = require('gulp-autoprefixer')
const clean = require('gulp-clean')

function styles() {
    return src('app/scss/style.scss')
        // .pipe(autoprefixer({overrideBrowserslist: ['last 10 version']}))
        .pipe(concat('style.min.css'))
        .pipe(scss({ style: 'compressed'}))
        .pipe(dest('app/css'))
        .pipe(browserSync.stream())
}

function scripts() {
    return src([
//       'node_modules/swiper', подключение сторонних пакетов
//       'app/js/*.js', '!app/js/main.min.js' исключение файла
        'app/js/main.js'
    ])
        .pipe(concat('main.min.js'))
        .pipe(uglify())
        .pipe(dest('app/js'))
        .pipe(browserSync.stream())
}

function browsersync() {
    browserSync.init({
        server: {
            baseDir: "app/"
        }
    })
}

function cleanDist() {
    return src('dist')
        .pipe(clean())
}

function building() {
    return src([
        'app/css/style.min.css',
        'app/js/main.min.js',
        'app/**/*.html'
    ], {base: 'app'})
        .pipe(dest('dist'))
}

function watching() {
    watch(['app/scss/style.scss'], styles)
    watch(['app/js/main.js'], scripts)
    watch(['app/**/*.html']).on('change', browserSync.reload)
}

exports.watching = watching
exports.styles = styles
exports.scripts = scripts
exports.browsersync = browsersync

exports.build = series(cleanDist, building)

exports.default = parallel(styles, scripts, browsersync, watching)