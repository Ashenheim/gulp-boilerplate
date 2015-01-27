/* ====================================
	Gulpfile
==================================== */


/*	Plugins
------------------------------------ */

var gulp       = require('gulp'),
	sass       = require('gulp-sass'),
	sourcemaps = require('gulp-sourcemaps'),
	concat     = require('gulp-concat'),
	uglify     = require('gulp-uglify'),
	jshint     = require('gulp-jshint'),
	rename     = require('gulp-rename'),
	connect    = require('gulp-connect'),
	watch      = require('gulp-watch'),
	notify     = require('gulp-notify');


/*	Config/Variables
------------------------------------ */

var config = {}

var path = {
	bower : "./bower_components",
	dest  : "_build",
	sass  : "./_source/sass",
	js    : "./_source/js"
}





/*	Tasks
------------------------------------ */


gulp.task('html', function() {
	gulp.src('./*.html')
		.pipe(gulp.dest( path.dest ));
});


gulp.task('sass', function() {
	gulp.src([
		path.sass + "/**/*.sass",
		path.sass + "/**/*.scss"
	])
		.pipe(sourcemaps.init())
		.pipe(sass({
			style: 'compressed',
		})
			.on("error", notify.onError(function (error) {
	 			return "Error: " + error.message;
	 		}))
		)
		.pipe(sourcemaps.write( path.dest + "/assets/css/" ))
		.pipe(gulp.dest( path.dest + "/assets/css/" ));
});


gulp.task('scripts', function() {
	gulp.src([
		path.bower + "/jquery/dist/jquery.js",
		path.js + "/vendors/**/*.js",
		path.js + "/partials/**/*.js",
		path.js + "/script.js"
	])
		.pipe(concat('global.js'))
		.pipe(gulp.dest( path.dest + "/assets/js/" ))
		.pipe(rename('global.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest( path.dest + "/assets/js/" ));
});


gulp.task('lint', function() {
	return gulp.src( path.js + "**/*.js" )
		.pipe(jshint())
		.pipe(jshint.reporter('default'));
});


gulp.task('watch',function() {
	gulp.watch( "./*.html", ['html']);
	gulp.watch( path.sass + "/**/*.scss", ['sass']);
	gulp.watch( path.js + "/**/*.js", ['scripts']);
});


gulp.task('move', function() {
	gulp.src( path.bower + "/font-awesome/fonts/*" )
		.pipe(gulp.dest( path.dest + "/assets/fonts" ));
});


gulp.task('webserver', function() {
	connect.server({
		root: path.dest,
		livereload: true
	});
});


gulp.task('livereload', function() {
  watch( path.dest + "/**" )
    .pipe(connect.reload());
});





/*	Bundled tasks
------------------------------------ */

gulp.task('default',   [ 'html', 'scripts', 'sass', 'move', 'webserver', 'livereload', 'watch' ]);
gulp.task('build',     [ 'html', 'scripts', 'sass', 'move' ]);