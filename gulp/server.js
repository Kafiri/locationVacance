"use strict";

var gulp = require("gulp");
var nodemon = require("gulp-nodemon");

gulp.task("serve", ["confenv:client", "watch"], function() {
    nodemon({
        script: "src/server/app.js",
        ext: "js",
        ignore: ["src/public/*", "coverage/*", "xunit.xml", "**/node_modules/**/*"],
        nodeArgs: ["--debug=5875"]
    })
        .on("restart", function() {
            console.log("restarted!");
        });
});
