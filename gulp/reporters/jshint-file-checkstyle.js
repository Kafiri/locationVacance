"use strict";

var fs = require("fs");
var del = require("del");

var outFile = "jshint-checkstyle.xml";

module.exports =
{
    reporter: function(results, data, opts) {
        var files = {};
        var out = [];
        var pairs = {
            "&": "&amp;",
            "\"": "&quot;",
            "'": "&apos;",
            "<": "&lt;",
            ">": "&gt;"
        };
        var fileName;
        var i;
        var issue;
        var errorMessage;

        opts = opts || {};

        function encode(s) {
            for (var r in pairs) {
                if (typeof(s) !== "undefined") {
                    s = s.replace(new RegExp(r, "g"), pairs[r]);
                }
            }
            return s || "";
        }

        results.forEach(function(result) {
            // Register the file
            result.file = result.file.replace(/^\.\//, "");
            if (!files[result.file]) {
                files[result.file] = [];
            }

            // Create the error message
            errorMessage = result.error.reason;
            if (opts.verbose) {
                errorMessage += " (" + result.error.code + ")";
            }

            // Add the error
            files[result.file].push({
                severity: "error",
                line: result.error.line,
                column: result.error.character,
                message: errorMessage,
                source: "jshint." + result.error.code
            });
        });

        for (fileName in files) {
            if (files.hasOwnProperty(fileName)) {
                out.push("\t<file name=\"" + fileName + "\">");
                for (i = 0; i < files[fileName].length; i++) {
                    issue = files[fileName][i];
                    out.push(
                        "\t\t<error " +
                        "line=\"" + issue.line + "\" " +
                        "column=\"" + issue.column + "\" " +
                        "severity=\"" + issue.severity + "\" " +
                        "message=\"" + encode(issue.message) + "\" " +
                        "source=\"" + encode(issue.source) + "\" " +
                        "/>"
                    );
                }
                out.push("\t</file>");
            }
        }

        fs.appendFile(outFile, out.join("\n"));
        fs.appendFile(outFile, "\n");
    },
    finishReport: function() {
        fs.appendFile(outFile, "</checkstyle>");
        console.log("Output to " + outFile);
    },
    startReport: function() {
        var out = [];
        if (fs.existsSync(outFile)) {
            fs.unlinkSync(outFile);
        }
        out.push("<?xml version=\"1.0\" encoding=\"utf-8\"?>");
        out.push("<checkstyle version=\"4.3\">");
        fs.appendFile(outFile, out.join("\n"));
    }

};
