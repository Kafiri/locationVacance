"use strict";

var gulp = require("gulp");

gulp.task("watch", ["injectBowerDeps", "injector:css", "injector:js"], function() {
    gulp.watch("src/public/scss/**/*.scss", ["injector:css"]);
    gulp.watch("src/public/js/**/*.js", ["injector:js"]);
    gulp.watch("src/public/images/**/*", ["images"]);
    gulp.watch("bower.json", ["injectBowerDeps"]);
});
