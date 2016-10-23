"use strict";

var gulp = require("gulp");
var $ = require("gulp-load-plugins")({
    pattern: ["gulp-*", "main-bower-files", "uglify-save-license", "del"]
});

/**
 * inject les fichier js angular dans l"index.html
 */
gulp.task("injector:js", ["scripts", "injector:css"], function () {
    return gulp.src(["src/public/index.html", ".tmp/public/index.html"])
        .pipe($.inject(gulp.src([
            "src/public/js/**/*.js"
        ]).pipe($.angularFilesort()), {
            ignorePath: "src/public",
            addRootSlash: false
        }))
        .pipe(gulp.dest("src/public/"));
});