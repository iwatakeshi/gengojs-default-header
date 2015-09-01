var gulp = require("gulp");
var sourcemaps = require("gulp-sourcemaps");
var babel = require("gulp-babel");
var mocha  = require('gulp-mocha');
var jshint = require('gulp-jshint');
var format = require('gulp-esformatter');
var doc = require('gulp-doxx');
var changelog = require('gulp-changelog');
var semver = require('semver');
var version = require('node-version').long;
var isHarmony = !semver.lt(version.toString(), '0.11.0');

if(!semver.lt(version.toString(), '0.11.0')){
      require("harmonize")(["harmony-generators"]);
}

gulp.task('format', function() {
  return gulp.src('./lib/**/**/*.js')
    .pipe(format(require('./esformatrc')))
    .pipe(gulp.dest(function(file){
      return file.base;
     }));
});

gulp.task("lib:entry", function () {
  return gulp.src('./lib/**/**/*.js')
    .pipe(jshint({esnext:true}))
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'))
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(sourcemaps.write("./source maps/"))
    .pipe(gulp.dest(function(file){
      return file.base.replace('lib/','');
     }));
});

gulp.task('doc', function() {
  return gulp.src('./lib/index.js')
    .pipe(doc({
      title: require('./package').name,
      urlPrefix: '/docs'
    }))
    .pipe(gulp.dest('docs'));
});

gulp.task('changelog', function(cb){
	changelog(require('./package.json')).then(function(stream){
		stream.pipe(gulp.dest('./')).on('end', cb);
	})
});

gulp.task('watch', function () {
    return gulp.watch('./lib/**/**/*.js', ['lib:entry']);
});
gulp.task('test', ['lib:entry'],function() {
   return gulp.src('tests/**/**/*.js')
      .pipe(mocha())
      .once('end', function () {
        process.exit();
      });
});

gulp.task("default", ['format','lib:entry','doc','changelog','watch']);

gulp.task('build', ['format','lib:entry','doc','test', 'changelog']);