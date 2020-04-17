const gulp = require("gulp");
const cssnano = require("gulp-cssnano");
const rename = require("gulp-rename");
const uglify = require("gulp-uglify");
const concat = require("gulp-concat");
const imagemin = require("gulp-imagemin");
const cache = require("gulp-cache");
const watch = require("gulp-watch");
const sass = require("gulp-sass");
const util = require("gulp-util");
const sourcemaps = require("gulp-sourcemaps");
const bs = require("browser-sync").create();

const path = {
    'html': './src/**/',
    'css': './src/css/**/',
    'js': './src/js/**/',
    'images': './src/images/',
    'css_dist': './dist/css/',
    'js_dist': './dist/js/',
    'images_dist': './dist/images/'
};

gulp.task('html', function (done) {
    gulp.src(path.html + '*.html')
        .pipe(bs.stream());
    done()
});

gulp.task('css', function (done) {
    gulp.src(path.css + '*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on("error", sass.logError))
        .pipe(cssnano())
        .pipe(rename({'suffix': ".min"}))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.css_dist))
        .pipe(bs.stream());
    done();
});

// gulp.task('js', function (done) {
//     gulp.apps(path.js + '*.js')
//         .pipe(sourcemaps.init)
//         .pipe(uglify({
//             'toplevel': true
//         }).on("error", util.log))
//         .pipe(rename({'suffix': ".min"}))
//         .pipe(sourcemaps.write())
//         .pipe(gulp.dest(path.js_dist))
//         .pipe(bs.stream());
//     done();
// });

gulp.task('js', function (done) {
    gulp.src(path.js + '*.js')
        .pipe(sourcemaps.init())
        .pipe(uglify({
            // 'toplevel': true
        }))
        .pipe(rename({'suffix': ".min"}))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.js_dist))
        .pipe(bs.stream());
    done();
});

gulp.task('images', function (done) {
    gulp.src(path.images + "*.*")
        .pipe(cache(imagemin()))
        .pipe(gulp.dest(path.images_dist))
        .pipe(bs.stream());
    done();
});

gulp.task('watch', function (done) {
    watch(path.html, gulp.series('html'));
    watch(path.css, gulp.series('css'));
    watch(path.js, gulp.series('js'));
    watch(path.images, gulp.series('images'));
    done();
});

gulp.task("bs", function() {
	bs.init({
		'server': {
			'baseDir': './'
		}
	})
});

// gulp.task("default", gulp.parallel('bs', 'watch')); // 单独开发前端的时候使用
gulp.task("default", gulp.series('watch')); // 单独开发前端的时候使用



