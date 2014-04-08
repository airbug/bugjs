//-------------------------------------------------------------------------------
// BuildBug
//-------------------------------------------------------------------------------

var buildbug            = require('buildbug');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var buildProject        = buildbug.buildProject;
var buildProperties     = buildbug.buildProperties;
var buildScript         = buildbug.buildScript;
var buildTarget         = buildbug.buildTarget;
var enableModule        = buildbug.enableModule;
var parallel            = buildbug.parallel;
var series              = buildbug.series;
var targetTask          = buildbug.targetTask;


//-------------------------------------------------------------------------------
// Enable Modules
//-------------------------------------------------------------------------------

var lintbug             = enableModule("lintbug");


//-------------------------------------------------------------------------------
// Build Properties
//-------------------------------------------------------------------------------

buildProperties({
    bugjs: {
        targetPaths: [
            "."
        ],
        ignorePatterns: [
            ".*\\.buildbug$",
            ".*\\.bugunit$",
            ".*\\.git$",
            ".*node_modules$"
        ]
    }
});


//-------------------------------------------------------------------------------
// Build Targets
//-------------------------------------------------------------------------------

buildTarget('clean').buildFlow(
    targetTask('clean')
);

buildTarget('local').buildFlow(
    series([
        targetTask('lint', {
            properties: {
                targetPaths: buildProject.getProperty("bugjs.targetPaths"),
                ignores: buildProject.getProperty("bugjs.ignorePatterns"),
                lintTasks: [
                    "fixExportAndRemovePackageAnnotations"
                ]
            }
        })
    ])
).makeDefault();


//-------------------------------------------------------------------------------
// Build Scripts
//-------------------------------------------------------------------------------

buildScript({
    dependencies: [
        "bugcore",
        "bugflow"
    ],
    script: "./lintbug.js"
});
