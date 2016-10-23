"use strict";

var gulp = require("gulp");
var $ = require("gulp-load-plugins")({
    pattern: ["gulp-*", "main-bower-files", "uglify-save-license", "del"]
});

/**
 * compilation sass vers css
 */
gulp.task("styles", ["injector:css:preprocessor", "injectBowerDeps"], function () {
    return gulp.src(["src/public/scss/main.scss"])
        .pipe($.sass({style: "expanded"}))
        .on("error", function handleError(err) {
            console.error(err.toString());
            this.emit("end");
        })
        .pipe($.autoprefixer())
        .pipe(gulp.dest(".tmp/public/stylesheet/"))
        .pipe(gulp.dest("src/public/stylesheet/"));
});

/**
 * inject les differents fichier sass
 * dans le fichier sass principal
 */


gulp.task("injector:css:preprocessor", function () {
    return gulp.src("src/public/scss/main.scss")
        .pipe($.inject(gulp.src([
            "src/public/scss/**/*.scss",
            "src/public/scss/foundation-sites.scss",
            "src/public/lib/aca-magellan-nav/magellanNav.scss",
            "!src/public/scss/main.scss"
        ], {read: false}), {
            transform: function (filePath) {
                filePath = filePath.replace("src/public/scss/", "");
                return "@import '" + filePath + "';";
            },
            starttag: "// injector",
            endtag: "// endinjector",
            addRootSlash: false
        }))
        .pipe(gulp.dest("src/public/scss"));
});

/**
 * inject le fichier css compiler
 * dans l'index.html
 */
gulp.task("injector:css", ["styles"], function () {
    return gulp.src("src/public/index.html")
        .pipe($.inject(gulp.src([
            "src/public/stylesheet/**/*.css"
        ], {read: false}), {relative: true}, {
            ignorePath: ".tmp",
            addRootSlash: false
        }))
        .pipe(gulp.dest("src/public/"));
});
