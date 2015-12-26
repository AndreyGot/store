var gulp         = require('gulp'),
    // general
    rename       = require('gulp-rename'),
    wrapper      = require('gulp-wrapper'),

    // css
    sass         = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss    = require('gulp-minify-css'),

    // html
    minifyHTML   = require('gulp-minify-html'),
    
    // js
    jshint       = require('gulp-jshint'),
    concat       = require('gulp-concat'),
    uglify       = require('gulp-uglifyjs'),

    clean        = require('gulp-clean'),
    notify       = require('gulp-notify'),
    // angular
    ngAnnotate   = require('gulp-ng-annotate');

var resources = 'src/Acme/StoreBundle/Resources/src';

gulp.task('scripts', function () {
  return gulp.src([
      resources + '/andreyApp.js',
      resources + '/routings.js',
      resources + '/preloader.js',
      resources + '/mainCtrl.js',
      resources + '/**/*.js',
    ])
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('default'))
    .pipe(ngAnnotate({single_quotes: true}))
    .pipe(uglify('app.js',{mangle: false, output:{beautify: true}}))
    .pipe(gulp.dest('web/js'))
    .pipe(uglify('app.min.js',{mangle: true, output:{beautify: false}}))
    .pipe(gulp.dest('web/js'))
    .pipe(notify({ message: 'scripts task completed' }));
});

gulp.task('html', function () {
    var opts = {
      comments:true,
      spare:true,
      // do not remove empty attributes
      empty:true,
      quotes:true
    };
  
  gulp.src([resources + '/**/*.html'])
    .pipe(wrapper({
      header: '<script type="text/ng-template" id="/${filename}">\n',
      footer: '</script>\n'
    }))
    .pipe(minifyHTML(opts))
    .pipe(concat('composite.html'))
    .pipe(gulp.dest('web/html/'))
    .pipe(notify({ message: 'html task completed' }));
});

gulp.task('libs', function () {
  return gulp.src([
      'web/components/angular/angular.min.js',
      'web/components/angular-ui-router/release/angular-ui-router.js',
      'web/components/jquery/dist/jquery.min.js',
      'web/components/angular-ui-bootstrap-bower/ui-bootstrap-tpls.min.js',
      'web/components/underscore/underscore.js',
      'web/components/restangular/dist/restangular.js',
    ])
    .pipe(concat('libs.js'))
    .pipe(gulp.dest('web/libs'))
    .pipe(notify({ message: 'libs task completed' }));
});

gulp.task('styles', function () {
  return gulp.src(resources + '/css/style.scss')
    .pipe(sass({errLogToConsole: true}))
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(gulp.dest('web/css'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(minifycss())
    .pipe(gulp.dest('web/css'))
    .pipe(notify({ message: 'styles task complete' }));
});


gulp.task('clean', function () {
  return gulp.src([
    'web/js',
    'web/html',
    'web/css',
    'web/libs',
    ], {read: false})
    .pipe(clean())
    .pipe(notify({ message: 'clean task completed' }));
});

gulp.task('default', ['clean'], function () {
    gulp.start(
      'styles',
      'scripts',
      'html',
      'libs'
      );
});

gulp.task('watch', function () {
  gulp.start('default');
  gulp.watch(resources + '/css/**/*.scss', ['styles']);
  gulp.watch(resources + '/**/*.js', ['scripts']);
  gulp.watch(resources + '/**/*.html', ['html']);
});
