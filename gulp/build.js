"use strict";

var gulp = require("gulp");
var debug = require("gulp-debug");

var $ = require("gulp-load-plugins")({
    pattern: ["gulp-*", "main-bower-files", "uglify-save-license"]
});
var del = require("del");

gulp.task("scripts", function () {
    return gulp.src("src/public/js/**/*.js");
});

/**
 * construit un templatecache angularjs
 */
gulp.task("partials", function () {
    return gulp.src(["src/public/{js,templates}/**/*.html", ".tmp/public/{js,templates}/**/*.html"])
        .pipe($.minifyHtml({
            empty: true,
            spare: true,
            quotes: true
        }))
        .pipe($.angularTemplatecache("templateCacheHtml.js", {
            module: "CheFormulaire-Habitation"
        }))
        .pipe(gulp.dest(".tmp/public/inject/"));
});

/**
 * concatenation et minification des js et des css
 */
gulp.task("html", ["injectBowerDeps", "injector:css", "injector:js", "partials"], function () {
    var htmlFilter = "*.html";
    var jsFilter = "**/*.js";
    var cssFilter = "**/*.css";
    var assets;

    return gulp.src(["src/public/*.html", ".tmp/public/*.html"])

        .pipe($.inject(gulp.src(".tmp/public/inject/templateCacheHtml.js", {read: false}), {
            starttag: "<!-- inject:partials -->",
            ignorePath: ".tmp",
            addRootSlash: false
        }))
        .pipe(assets = $.useref.assets())
        .pipe($.rev())
        .pipe(debug({
            title: "unicorn:",
            minimal: false
        }))
        .pipe($.sourcemaps.init())
        .pipe($.if(jsFilter, $.ngAnnotate()))
        .pipe($.if(jsFilter, $.uglify({preserveComments: $.uglifySaveLicense})))
        .pipe($.sourcemaps.write("maps"))
        .pipe($.if(cssFilter, $.csso()))
        .pipe(assets.restore())
        .pipe($.useref())
        .pipe($.revReplace())
        .pipe($.if(htmlFilter, $.minifyHtml({
            empty: true,
            spare: true,
            quotes: true
        })))
        .pipe(gulp.dest("dist/"))
        .pipe($.size({
            title: "dist/",
            showFiles: true
        }));
});

/**
 * optimisation des images
 */
gulp.task("images", function () {
    return gulp.src("src/public/images/**/*")
        //.pipe($.imagemin({
        //    optimizationLevel: 3,
        //    progressive: true,
        //    interlaced: true
        //}))
        .pipe(gulp.dest("dist/images/"));
});

/**
 * integration des fonts foundation
 */
gulp.task("foundation-fonts", function () {
    return gulp.src("src/public/lib/foundation-icon-fonts/*")
        .pipe($.filter("**/*.{eot,svg,ttf,woff}"))
        .pipe($.flatten())
        .pipe(gulp.dest("dist/styles/"));
});

gulp.task("project-fonts", function () {
    return gulp.src("src/public/police/*")
        .pipe($.filter("**/*.{eot,svg,ttf,woff,woff2}"))
        .pipe($.flatten())
        .pipe(gulp.dest("dist/police/"));
});

/**
 * integration d"un icon (.ico)
 */
gulp.task("misc", function () {
    return gulp.src("src/public/**/*.ico")
        .pipe(gulp.dest("dist/"));
});

/**
 * suppression des repertoires dist et .tml
 */
gulp.task("clean", function (done) {
    del(["dist/", ".tmp/"], done);
});


/**
 * construit une version livrable de l"application
 */
gulp.task("build", ["html", "images", "foundation-fonts", "project-fonts", "misc"]);
