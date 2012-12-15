//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@Export('BugUnit')

//@Require('ReportCard')
//@Require('Set')
//@Require('TestRunner')

var bugpack = require('bugpack');


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var ReportCard = bugpack.require('ReportCard');
var Set = bugpack.require('Set');
var TestRunner = bugpack.require('TestRunner');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var BugUnit = {};


//-------------------------------------------------------------------------------
// Static Variables
//-------------------------------------------------------------------------------

/**
 * @private
 * @type {Set<Test>}
 */
BugUnit.registeredTestSet = new Set();


//-------------------------------------------------------------------------------
// Static Methods
//-------------------------------------------------------------------------------

/**
 * @param {Test} test
 */
BugUnit.registerTest = function(test) {
    if (!BugUnit.registeredTestSet.contains(test)) {
        BugUnit.registeredTestSet.add(test);
    }
};

/**
 * @param {boolean} logResults
 * @return {ReportCard}
 */
BugUnit.runTests = function(logResults) {
    var reportCard = new ReportCard();
    BugUnit.registeredTestSet.forEach(function(test) {
        var testResult = TestRunner.runTest(test, logResults);
        reportCard.addTestResult(testResult);
    });
    return reportCard;
};


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export(BugUnit);
