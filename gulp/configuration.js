"use strict";
var del = require("del");
var fs = require("fs");
var gulp = require("gulp");
var minimist = require("minimist");

var browserify = require("browserify");
var source = require("vinyl-source-stream");
var buffer = require("vinyl-buffer");
var gutil = require("gulp-util");
var uglify = require("gulp-uglify");
var sourcemaps = require("gulp-sourcemaps");
var reactify = require("reactify");

var knownOptions = {
    string: "env",
    default: {env: process.env.NODE_ENV || "development"}
};

var options = minimist(process.argv.slice(2), knownOptions);

/**
 * inject les fichiers client de configuration
 */
gulp.task("confenv:client", function() {
    process.stdout.write(options.env);
    // set up the browserify instance on a task basis
    var b = browserify({
        entries: "./src/public/config/index.js",
        debug: true,
        // defining transforms here will avoid crashing your stream
        transform: [reactify]
    });

    return b.bundle()
        .pipe(source("./src/public/js/configuration/index.js"))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        // Add transformation tasks to the pipeline here.
        .pipe(uglify())
        .on("error", gutil.log)
        .pipe(sourcemaps.write("./"))
        .pipe(gulp.dest("./"));
});
