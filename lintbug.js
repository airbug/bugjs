//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugcore             = require('bugcore');
var bugflow             = require('bugflow');
var buildbug            = require('buildbug');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var enableModule        = buildbug.enableModule;
var TypeUtil            = bugcore.TypeUtil;
var $series             = bugflow.$series;
var $task               = bugflow.$task;


//-------------------------------------------------------------------------------
// Enable Modules
//-------------------------------------------------------------------------------

var lintbug             = enableModule("lintbug");


//-------------------------------------------------------------------------------
// Script
//-------------------------------------------------------------------------------

lintbug.lintTask("ensureUpperCaseRequireAnnotations", function(lintFile, callback) {

});

lintbug.lintTask("fixExportAndRemovePackageAnnotations", function(lintFile, callback) {
    var fileContents = lintFile.getFileContents();
    var packageAnnotationRegex = /\/\/(\s*)@Package\('([\w|\.]*)'\)(\s*)\n/;

    var packageName = undefined;
    fileContents = fileContents.replace(packageAnnotationRegex, function(match, p1, p2, p3, offset, string) {
        if (!packageName) {
            packageName = p2;
        } else {
            throw new Error("More than one @Package annotation in file '" + lintFile.getFilePath().getAbsolutePath() + "'");
        }

        return "";
    });

    if (packageName) {
        var exportAnnotationRegex = /(\s*)\/\/(\s*)@Export\((['"])(\w*)(['"])\)(\s*)\n/g;
        fileContents = fileContents.replace(exportAnnotationRegex, function(match, p1, p2, p3, p4, p5, p6, offset, string) {
            return p1 + "//" + p2 + "@Export(" + p3 + packageName + "." + p4 + p5 + ")" + p6 + "\n";
        });
    }

    lintFile.setFileContents(fileContents);
    callback();
});

lintbug.lintTask("orderAnnotationsInFile", function(lintFile, callback) {
    var _this = this;
    var fileContents = "";
    $series([
        $task(function(flow) {
            var lines = fileContents.split("\n");
            _this.sortRequireAnnotationLines(lines);
            flow.complete();
        })
    ]).execute(callback);
});

lintbug.lintTask("orderBugPackRequiresInFile", function(jsFilePath, callback) {
    //var Class                   = bugpack.require('Class');
});

lintbug.lintTask("sortRequireAnnotationLines", function(lines) {
    var _this = this;
    var requireAnnotationStartIndex = -1;
    var requireAnnotationStopIndex = -1;
    var requireAnnotationRegex = new RegExp("\\s*//\\s*@Require\\('(\\w|\\.)*'\\)");
    var requireLines = [];

    //find start
    for (var i = 0, size = lines.length; i < size; i++) {
        var line = lines[i];
        if (line.match(requireAnnotationRegex)) {
            requireAnnotationStartIndex = i;
            break;
        }
    }

    if (requireAnnotationStartIndex > -1) {
        requireAnnotationStopIndex = requireAnnotationStartIndex;
        for (var i2 = requireAnnotationStartIndex, size2 = lines.length; i2 < size2; i2++) {
            var line = lines[i];
            var results = line.match(requireAnnotationRegex);
            requireLines.push({
                line: line,
                requireName: results[1]
            });
            if (results) {
                requireAnnotationStopIndex = i2;
            }
        }
    }

    //var results = line.match(/\s*\/\/\s*@([a-zA-Z][0-9a-zA-Z]*)(?:\((.+)?\))?\s*/);
    /*if (results) {
     var annotation = {
     name: results[1]
     };
     var argumentsString = results[2];
     if (argumentsString !== undefined) {
     annotation.arguments = _this.parseArguments(argumentsString);
     }
     annotations.push(annotation);
     }*/


    //var requireLines = lines.splice(requireAnnotationStartIndex, requireAnnotationStopIndex - requireAnnotationStartIndex);
    requireLines.sort(function(a, b) {

    });
});

/**
 * @private
 * @param {string} argumentsString
 * @return {Array.<(string|number)>}
 */
var parseArguments = function(argumentsString) {
    var args = [];
    var parts = argumentsString.split(',');
    parts.forEach(function(part) {
        var results = part.match(/\s*('|")(.*?)\1\s*/);
        if (results) {
            args.push(results[2]);
        } else {
            var num = parseFloat(part);
            if (isNaN(num)) {
                throw new Error("Could not parse parameter '" + part + "'");
            }
            args.push(num);
        }
    });
    return args;
};

/**
 * @private
 * @param {string} text
 * @return {string}
 */
var parseString = function(text) {
    var results = text.match(/\s*('|")(.*?)\1\s*/);
    if (results) {
        return results[2];
    }
    return null;
};