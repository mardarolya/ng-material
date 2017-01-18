'use strict';

var gulp = require("gulp"),
	jade = require('gulp-jade'),
	less = require('gulp-less'),
	tscr = require('gulp-typescript'),
	cssmin = require('gulp-cssmin'),
	jsmin  = require('gulp-jsmin'),
	watch  = require('gulp-watch');

// следим за изменениями
gulp.task('whats-new', function(){
	
	watch(['./src/index.jade', './src/view/**/*.jade'])  
		.on("change", function(file) {
            gulp.src(file)
            .pipe(jade({pretty: true}))
            .on('error', console.log)
            .pipe(gulp.dest(function(file){
                    return file.base;
                }, {overwrite: true}));
        });

	watch(['./src/script/*.ts', './src/view/**/*.ts'])
    	.on("change", function(file) {
	            gulp.src(file)
	            .pipe(tscr())
	            .on('error', console.log)
	            .pipe(gulp.dest(function(file){
                    return file.base;
                }, {overwrite: true}));
	        });
	
	watch('./src/style/*.less')
		.on("change", function(file) {
            gulp.src(file)
            .pipe(less({pretty: true}))
            .on('error', console.log)
            .pipe(gulp.dest(function(file){
                    return file.base;
                }, {overwrite: true}));
        });

});	


// собираем в public
gulp.task('public', function(){
	// перенесем шрифты
	gulp.src('./project/font/icons/*')
	    .pipe(gulp.dest('./public/font/icons'), {overwrite: true}); 
	gulp.src('./project/font/text/*')
	    .pipe(gulp.dest('./public/font/text'), {overwrite: true});     
	// перенесем стили
	gulp.src('./project/style/css/*.css')
		.pipe(cssmin())	
		.on('error', console.log)
	    .pipe(gulp.dest('./public/style'), {overwrite: true}); 
	// перенесем скрипты
	gulp.src('./project/script/js/*.js')
		.pipe(jsmin())	
		.on('error', console.log)
	    .pipe(gulp.dest('./public/script'), {overwrite: true}); 
	// перенесем картинки
	gulp.src('./project/image/*')
	    .pipe(gulp.dest('./public/image'), {overwrite: true}); 
	// перенесем index
	gulp.src('./project/index.html')
	    .pipe(gulp.dest('./public'), {overwrite: true});
});

