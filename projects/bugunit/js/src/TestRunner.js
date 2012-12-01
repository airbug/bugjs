//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@Export('TestRunner')

//@Require('Class')
//@Require('List')
//@Require('Test')
//@Require('TestResult')

var bugpack = require('bugpack');


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

bugpack.declare('TestRunner');

var Class = bugpack.require('Class');
var List = bugpack.require('List');
var Test = bugpack.require('Test');
var TestResult = bugpack.require('TestResult');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

//TODO BRN: Merge this back in to BugUnit
var TestRunner = {};


//-------------------------------------------------------------------------------
// Static Methods
//-------------------------------------------------------------------------------

TestRunner.runTest = function(test, logResults) {
    var testResult = new TestResult(test);
    var hearAssertionResult = function(event) {
        var assertionResult = event.data;
        if (logResults) {
            console.log(assertionResult.getMessage());
        }
        testResult.addAssertionResult(assertionResult);
    };
    test.addEventListener(Test.EventType.ASSERTION_RESULT, hearAssertionResult);
    try {
        if (logResults) {
            console.log("Running test [" + test.getName() + "]");
        }
        test.runTest();
        if (logResults) {
            console.log("Completed test [" + test.getName() + "]");
        }
    } catch (error) {
        if (logResults) {
            console.log("Error occurred - message:" + error.message);
        }
        if (logResults) {
            console.log("Aborted test [" + test.getName() + "]");
        }
        testResult.setError(error);
    }
    test.removeEventListener(Test.EventType.ASSERTION_RESULT, hearAssertionResult);
    return testResult;
};


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export(TestRunner);
