/* Variables */
var gulp = require('gulp'), 								//Таск-менеджер Gulp
	sass = require('gulp-sass'), 							//Препроцессор Sass
	browserSync = require('browser-sync'), 					//Сервер для работы и автоматического обновления страниц
	notify = require("gulp-notify"), 						//Плагин для информирование о найденных ошибках
	rename = require('gulp-rename'), 						//Плагин для переименования файлов
	autoprefixer = require('gulp-autoprefixer'),			//Плагин для автоматической расстановки префиксов
	cleanCSS = require('gulp-clean-css'),					//Плагин для минимизации CSS с использованием clean-css
	concat = require('gulp-concat'),						//Плагин для конкатенации файлов
	uglify = require('gulp-uglify'),						//Плагин для минификации js-файлов
	del = require('del'), 									//Плагин для удаления файлов и каталогов
	imagemin = require('gulp-imagemin'),					//Плагин для сжатия JPEG, GIF и SVG изображений
	cache = require('gulp-cache'), 							//Плагин для кэширования
	imageminpngquant = require('imagemin-pngquant'),		//Плагин для сжатия PNG изображений
	jpegrecompress = require('imagemin-jpeg-recompress');	//Плагин для сжатия JPEG
/* Variables */

/* Sass */
gulp.task('sass', function () {
	return gulp.src('app/sass/**/*.sass')
		.pipe(sass({outputStyle: 'expanded'}).on("error", notify.onError()))
		.pipe(rename({suffix: '.min', prefix : ''}))
		.pipe(autoprefixer(['last 15 versions']))
		.pipe(cleanCSS())
		.pipe(gulp.dest('app/css'))
		.pipe(browserSync.stream())
});
/* Sass */

/* Browser-sync */
gulp.task('browser-sync', function () {
	browserSync.init({
		server: {
			baseDir: 'app'
		},
		notify: false,
	});
});
/* Browser-sync */

/* browserSyncHTML */
gulp.task('codeHTML', function() {
	return gulp.src('app/*.html')
	.pipe(browserSync.stream())
})
/* browserSyncHTML */

/* CommonJS */
gulp.task('common-js', function() {
	return gulp.src([
		'app/libs/CommonJs/common.js',
		])
	.pipe(concat('scripts.min.js'))
	.pipe(uglify())
	.pipe(gulp.dest('app/js'))
	.pipe(browserSync.stream());
});
/* CommonJS */

/* Imagemin */
gulp.task('imagemin', function() {
	return gulp.src('app/images/**/*')
	.pipe(cache(imagemin([ // сжатие изображений
		imagemin.gifsicle({ interlaced: true }),
		jpegrecompress({
			progressive: true,
			max: 90,
			min: 80
		}),
		imageminpngquant(),
		imagemin.svgo({ plugins: [{ removeViewBox: false }] })
	])))
	.pipe(gulp.dest('dist/images/')); // выгрузка готовых файлов
});
/* Imagemin */

/* CodeJS */
gulp.task('codeJS', gulp.parallel('common-js'), function() {
	return gulp.src([
		'app/libs/CommonJs/common.min.js', //CommonJs всегда в конце
	])
	.pipe(concat('scripts.min.js'))
	.pipe(gulp.dest('app/js'))
	.pipe(browserSync.stream());
})
/* CodeJS */

/* Watch */
gulp.task('watch', function () {
	gulp.watch('app/sass/**/*.sass', gulp.parallel('sass'));
	gulp.watch('app/libs/CommonJs/**/*.js', gulp.parallel('codeJS'));
	gulp.watch('app/*.html', gulp.parallel('codeHTML'));
});
/* Watch */

/* Default (команда gulp) */
gulp.task('default', gulp.parallel('browser-sync', 'sass', 'codeJS', 'watch'));
/* Default (команда gulp)*/

/* Remove dist */
gulp.task('removedist', function() { 
	return del(['dist']);
});
/* Remove dist */

/* Build Files */
gulp.task('dist', function () {

	var buildFiles = gulp.src([
		'app/*.html',
	//	'app/.htaccess',
		]).pipe(gulp.dest('dist'));

	var buildCss = gulp.src([
		'app/css/main.min.css',
		]).pipe(gulp.dest('dist/css'));

	var buildJs = gulp.src([
		'app/js/scripts.min.js',
		]).pipe(gulp.dest('dist/js'));

	var buildFonts = gulp.src([
		'app/fonts/**/*',
		]).pipe(gulp.dest('dist/fonts'));


    return buildFiles, buildCss, buildJs, buildFonts;

});
/* Build Files */

/* Built */
gulp.task('build', gulp.series('removedist','sass', 'codeJS', 'dist', 'imagemin'));
/* Built */

/* Clear cache */
gulp.task('clearcache', function () { 
	return cache.clearAll(); 
});
/* Clear cache */

