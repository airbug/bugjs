//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@Export('TestRunner')

//@Require('Class')
//@Require('List')
//@Require('Test')
//@Require('TestResult')


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

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
    test.addEventListener(Test.EventTypes.ASSERTION_RESULT, hearAssertionResult);
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
    test.removeEventListener(Test.EventTypes.ASSERTION_RESULT, hearAssertionResult);
    return testResult;
};
