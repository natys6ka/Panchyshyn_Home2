const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const cssnano = require('gulp-cssnano');
const image = require('gulp-image');
const rename = require("gulp-rename");
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;
const browserSync = require('browser-sync').create();
const del = require('del');


const paths = {
    images: {
        src: 'app/photo/*.*',
        dest: 'build/images'
    },
    styles: {
        src: 'app/styles/**/*.scss',
        dest: 'build/css'
    },
    scripts: {
        src: 'app/js/**/*.js',
        dest: 'build/scripts'
    },
    html: {
        src: 'app/**/*.html',
        dest: 'build/'
    },
    fonts: {
        src: 'app/fonts/**/*.ttf',
        dest: 'build/fonts'
    }
};

function browser(done) {
    browserSync.init({
        server: {
            baseDir: './build'
        },
        port: 3000
    });
    done();
};

function browserReload(done) {
    browserSync.reload();
    done();
}

function images(){
    return gulp.src(paths.images.src)
        .pipe(image())
        .pipe(gulp.dest(paths.images.dest))
        .pipe(browserSync.stream())
}

function styles(){
    return gulp.src(paths.styles.src)
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(cssnano())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(paths.styles.dest))
        .pipe(browserSync.stream())
}

function scripts(){
    return gulp.src(paths.scripts.src)
        .pipe(concat('main.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(paths.scripts.dest))
        .pipe(browserSync.stream())
}

function html(){
    return gulp.src(paths.html.src)
        .pipe(gulp.dest(paths.html.dest))
        .pipe(browserSync.stream())
}

function fonts() {
    return gulp.src(path.fonts.src)
        .pipe(gulp.dest(path.fonts.dest))
        .pipe(browserSync.stream())
}


function watch(){
    gulp.watch(paths.images.src, images);
    gulp.watch(paths.styles.src, styles);
    gulp.watch(paths.scripts.src, scripts);
    gulp.watch(paths.html.src, html);
    gulp.watch(paths.fonts.src, fonts);
    gulp.watch('./app/*.html', gulp.series(browserReload));
}

function clear(){
    return del(['build']);
}
const build = gulp.series(clear, gulp.parallel(images, styles, scripts, html, fonts));

gulp.task('build', build);

gulp.task('default', gulp.parallel(watch, browser, build));




