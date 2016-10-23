"use strict";
var gulp = require("gulp");
var jscs = require("gulp-jscs-custom");
var jshint = require("gulp-jshint");
var reporter = require("./reporters/jshint-file-checkstyle");

gulp.task("jshint", function() {
    reporter.startReport();
    gulp.src(["src/**/*.js", "!src/public/lib/**/*.js"])
        .pipe(jshint(".jshintrc"))
        .pipe(jshint.reporter(reporter))
        .on("finish", reporter.finishReport);
});

gulp.task("jscs", function() {
    return gulp.src(["src/**/*.js", "!src/public/lib/**/*.js"])
        .pipe(jscs({
            esnext: false,
            configPath: ".jscsrc",
            reporter: "checkstyle",
            filePath: "jscs-checkstyle.xml"
        }));
});
