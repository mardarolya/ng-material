"use strict";

var gulp = require("gulp"),
	jade = require("gulp-jade"),
	less = require("gulp-less"),
	tscr = require("gulp-typescript"),
	cssmin = require("gulp-cssmin"),
	jsmin  = require("gulp-jsmin"),
	watch  = require("gulp-watch"),
	browserSync = require("browser-sync");

gulp.task("browser-sync", function() { // Создаем таск browser-sync
    browserSync({ // Выполняем browser Sync
        server: { // Определяем параметры сервера
            baseDir: "./" // Директория для сервера - app
        },
        notify: false // Отключаем уведомления
    });
});

// следим за изменениями
gulp.task("whats-new", ["browser-sync"], function(){
	
	watch(["./src/index.jade", "./src/view/**/*.jade"])  
		.on("change", function(file) {
            gulp.src(file)
            .pipe(jade({pretty: true}))
            .on("error", console.log)
            .pipe(gulp.dest(function(file){
                    return file.base;
                }, {overwrite: true}))
            .pipe(browserSync.reload({stream: true}));
        });

	watch(["./src/script/*.ts", "./src/view/**/*.ts"])
    	.on("change", function(file) {
	            gulp.src(file)
	            .pipe(tscr())
	            .on("error", console.log)
	            .pipe(gulp.dest(function(file){
                    return file.base;
                }, {overwrite: true}))
                .pipe(browserSync.reload({stream: true}));
	        });
	
	watch("./src/style/*.less")
		.on("change", function(file) {
            gulp.src(file)
            .pipe(less({pretty: true}))
            .on("error", console.log)
            .pipe(gulp.dest(function(file){
                    return file.base;
                }, {overwrite: true}))
            .pipe(browserSync.reload({stream: true}));
        });
});	


// собираем в public
gulp.task("dist", function(){
	// перенесем шрифты
	gulp.src("./src/font/icons/*")
	    .pipe(gulp.dest("./dist/font/icons"), {overwrite: true}); 
	gulp.src("./src/font/text/*")
	    .pipe(gulp.dest("./dist/font/text"), {overwrite: true});     
	// перенесем стили
	gulp.src("./src/style/*.css")
		.pipe(cssmin())	
		.on("error", console.log)
	    .pipe(gulp.dest("./dist/style"), {overwrite: true}); 
	// перенесем скрипты
	gulp.src("./src/script/*.js")
		.pipe(jsmin())	
		.on("error", console.log)
	    .pipe(gulp.dest("./dist/script"), {overwrite: true}); 

	// перенесем картинки
	gulp.src("./src/image/*")
	    .pipe(gulp.dest("./dist/image"), {overwrite: true}); 

	gulp.src(["./src/view/*/*.js", "./src/view/*/*.html"])
	    .pipe(gulp.dest("./dist/view"), {overwrite: true});    
	// перенесем index
	gulp.src("./src/index.html")
	    .pipe(gulp.dest("./dist"), {overwrite: true});

});

