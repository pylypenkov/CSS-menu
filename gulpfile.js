var gulp = require('gulp');
var sass = require('gulp-sass');
var notify = require('gulp-notify');
var plumber = require('gulp-plumber');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var svgSprite = require('gulp-svg-sprite');
var svgmin = require('gulp-svgmin');
var cheerio = require('gulp-cheerio');
var replace = require('gulp-replace');



gulp.task('sass', function(){
    return gulp.src('scss/style.scss')

        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'compressed'}))
        .pipe(autoprefixer({
            browsers: ['last 8 versions'],
            cascade: false
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('css'))
        .pipe(plumber({
            errorHandler:notify.onError(function (err) {
                return{
                    title: "Error",
                    message: err.message
                }
            })
        }))
});


gulp.task('watch', function(){
    gulp.watch('scss/**/*.scss', ['sass']);
});

// GENERATION SVG SPRITE
gulp.task('svgSpriteBuild', function () {
    return gulp.src('images/svg/*.svg')

    // minify svg
        .pipe(svgmin({
            js2svg: {
                pretty: true
            }
        }))

        .pipe(cheerio({
            run: function ($) {
                $('[style]').removeAttr('style');
            },
            parserOptions: {xmlMode: true}
        }))

        .pipe(replace('&gt;', '>'))

        .pipe(svgSprite({
                mode: {
                    symbol: {
                        sprite: 'sprite.svg',
                        dest: '',
                        render: {
                            scss: {
                                dest: '../../scss/sprite-svg.scss',
                                template: 'scss/sprite_template.scss'
                            }
                        }
                    }
                }
                // preview: false,
                // selector: "icon-%f",
            }
        ))
        .pipe(gulp.dest('css/img'));
});
// end GENERATION SVG SPRITE


gulp.task('default', ['watch', 'sass']);

