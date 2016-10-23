"use strict";

var gulp = require("gulp");

// inject bower components
gulp.task("injectBowerDeps", function () {
    var wiredep = require("wiredep").stream;

    return gulp.src("src/public/index.html")
        .pipe(wiredep({
            exclude: [
                /foundation\.js/,
                /foundation\.css/,
                /bootstrap\.css/,
                /jquery/,
                /pdf\.combined\.js/,
                /pdf\.combined\.js/,
                /mdPickers\.min\.js/
            ]
        }))
        .pipe(gulp.dest("src/public"));
});
