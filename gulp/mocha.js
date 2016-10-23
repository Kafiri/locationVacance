"use strict";

var gulp = require("gulp");
var mocha = require("gulp-spawn-mocha");

function test() {
    return gulp.src(["test/**/*.js"], {read: false}).pipe(mocha({
        R: "xunit-file",
        istanbul: {
            report: "cobertura"
        },
        timeout: 7000
    })).on("error", console.warn.bind(console));
}

gulp.task("runTests", function() {
    return test().on("error", function(e) {
        this.emit("end");
    });
});
